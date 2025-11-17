// app/api/click/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const offerId = searchParams.get("offerId");
    const productId = searchParams.get("productId") || undefined;
    const src = searchParams.get("src") || "unknown"; // tracking source

    if (!offerId) {
      return NextResponse.json({ ok: false, error: "Missing offerId" }, { status: 400 });
    }

    // Lấy offer + affiliateUrl
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      select: {
        id: true,
        affiliateUrl: true,
        merchantId: true,
        productId: true,
      },
    });

    if (!offer || !offer.affiliateUrl) {
      return NextResponse.json({ ok: false, error: "Offer not found" }, { status: 404 });
    }

    // Tracking data
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || "unknown";
    const ua = req.headers.get("user-agent") || undefined;
    const referer = req.headers.get("referer") || undefined;
    const ipHash = crypto.createHash("sha256").update(ip + process.env.IP_SALT || "salt").digest("hex");

    // Tạo subid chuẩn: offerId:productId:timestamp
    const subid = `${offerId}:${productId || offer.productId}:${Date.now()}`;

    // Ghi log click
    await prisma.click.create({
      data: {
        offerId: offer.id,
        subid,
        ipHash,
        ua,
        referer,
        productId: productId || offer.productId,
        merchantId: offer.merchantId,
      },
    });

    // Append subid vào affiliateUrl (tùy network)
    const redirectUrl = new URL(offer.affiliateUrl);
    redirectUrl.searchParams.set("subid", subid); // hoặc sub1, aff_sub tùy network
    redirectUrl.searchParams.set("utm_source", src);

    return NextResponse.redirect(redirectUrl.toString(), { status: 302 });
  } catch (e: any) {
    console.error("click tracking error:", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}