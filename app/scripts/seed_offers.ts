import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const shopee = await prisma.merchant.upsert({
    where: { domain: "shopee.vn" },
    update: {},
    create: { name: "Shopee", domain: "shopee.vn", network: "accesstrade" }
  });
  const lazada = await prisma.merchant.upsert({
    where: { domain: "lazada.vn" },
    update: {},
    create: { name: "Lazada", domain: "lazada.vn", network: "masoffer" }
  });

  const products = await prisma.product.findMany({ take: 3 });
  for (const p of products) {
    await prisma.offer.create({
      data: {
        productId: p.id,
        merchantId: shopee.id,
        url: "https://shopee.vn/product/...",                 // sửa link thật
        affiliateUrl: "https://go.accesstrade.vn/deeplink?..." // deeplink của bạn
      }
    });
    await prisma.offer.create({
      data: {
        productId: p.id,
        merchantId: lazada.id,
        url: "https://www.lazada.vn/products/...",
        affiliateUrl: "https://go.masoffer.net/deeplink/..."
      }
    });
  }
  console.log("✅ Seed offers done");
}
main().catch(console.error).finally(() => prisma.$disconnect());
