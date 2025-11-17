// app/r/[offerId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db"; // giữ như bạn đang dùng

export const dynamic = "force-dynamic"; // tránh cache

// Chặn bot/preview
const BOT = /(bot|crawler|spider|preview|facebookexternalhit|slackbot|whatsapp|telegram)/i;

// Lấy IP đầu tiên từ x-forwarded-for
function getClientIP(h: Headers): string {
  const xff = h.get("x-forwarded-for") || "";
  const ip = xff.split(",")[0]?.trim();
  return ip && ip.length <= 45 ? ip : "0.0.0.0";
}

// Sanitize subid: chỉ [A-Za-z0-9_-], max 100 ký tự
function cleanSubId(raw: string) {
  return raw.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 100);
}

// Sinh subid MỚI cho mỗi click (tránh đụng unique subid)
function newSubId(offerId: string, src?: string | null, pos?: string | null) {
  const base = `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const extra = [offerId, src || "", pos || ""].filter(Boolean).join("_");
  return cleanSubId(`${base}_${extra}`);
}

// SHA-256 HMAC (WebCrypto, chạy được cả Node & Edge)
async function hmacHex(text: string) {
  const secret = (process.env.IP_HASH_SECRET || process.env.CLICK_SALT || "salt") as string;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// Thêm aff_sub (+ aff_sub2/src, aff_sub3/pos) vào URL đích
function attachSubParams(rawUrl: string, subid: string, src?: string | null, pos?: string | null) {
  let u: URL;
  try {
    u = new URL(rawUrl);
  } catch {
    // nếu affiliateUrl lỗi cú pháp, cứ trả lại chuỗi cũ để redirect
    return rawUrl;
  }
  if (!u.searchParams.has("aff_sub")) u.searchParams.set("aff_sub", subid);
  if (src && !u.searchParams.has("aff_sub2")) u.searchParams.set("aff_sub2", src);
  if (pos && !u.searchParams.has("aff_sub3")) u.searchParams.set("aff_sub3", pos);
  return u.toString();
}

// MVP rate-limit (in-memory; serverless reset theo phiên)
const BUCKET = new Map<string, { n: number; t: number }>();
function rateOk(key: string) {
  const now = Date.now();
  const win = 15_000; // 15s
  const max = 8;      // tối đa 8 click/15s/IP
  const cur = BUCKET.get(key);
  if (!cur || now - cur.t > win) { BUCKET.set(key, { n: 1, t: now }); return true; }
  if (cur.n >= max) return false;
  cur.n++; return true;
}

export async function GET(req: NextRequest, { params }: { params: { offerId: string } }) {
  const h = headers();

  // 1) Lấy offer
  const offer = await prisma.offer.findUnique({ where: { id: params.offerId } });
  if (!offer?.affiliateUrl) {
    // fallback lịch sự
    return NextResponse.redirect("/", { status: 302 });
  }

  // 2) Anti-bot + rate limit
  const ua = h.get("user-agent") || "";
  const ref = h.get("referer") || "";
  const ip = getClientIP(h);
  if (!rateOk(ip)) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  // 3) subid (MỚI mỗi click để không đụng unique)
  const q = new URL(req.url);
  const src = q.searchParams.get("src") ?? "web";
  const pos = q.searchParams.get("p") ?? "pos1";
  const subid = newSubId(params.offerId, src, pos);

  // 4) Hash IP
  const ipHash = await hmacHex(ip);

  // 5) Log click (skip bot/preview)
  if (!BOT.test(ua)) {
    try {
      await prisma.click.create({
        data: {
          offerId: params.offerId,
          subid,             // @unique trong schema của bạn → luôn mới
          ipHash,            // không lưu IP thô
          ua: ua.slice(0, 512),
          referer: ref.slice(0, 512),
          // (schema hiện tại chưa có productId/merchantId denormalize)
        },
      });
    } catch (e) {
      // Trường hợp cực hiếm nếu subid va chạm unique → bỏ qua để không chặn redirect
      console.error("click log error", e);
    }
  }

  // 6) Build URL đích + redirect
  const target = attachSubParams(offer.affiliateUrl, subid, src, pos);
  const res = NextResponse.redirect(target, 302);
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Robots-Tag", "noindex"); // tránh bị index link redirect
  return res;
}
