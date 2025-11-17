import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'
const placeholderImg = 'https://placehold.co/600x600?text=No+Image'
const prisma = new PrismaClient()
const toSlug = (s: string) => slugify(s, { lower: true, strict: true, locale: 'vi' })

async function main() {
  console.log('🌱 Starting seed...')

  // 0) Categories (Category.slug là @unique)
  const categoriesData = [
    { name: 'Phones', slug: 'phones' },
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Headphones', slug: 'headphones' },
    { name: 'Watches', slug: 'watches' },
    { name: 'Tablets', slug: 'tablets' },
    { name: 'Cameras', slug: 'cameras' },
    { name: 'Gaming', slug: 'gaming' },
  ]
  for (const c of categoriesData) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: { name: c.name, slug: c.slug },
    })
  }
  console.log('✅ Categories ready')

  // 1) Merchants (domain + network bắt buộc; slug optional)
  const merchantsData = [
    { name: 'Tiki',   domain: 'tiki.vn',   network: 'accesstrade', slug: 'tiki',   logo: 'https://salt.tikicdn.com/ts/upload/0e/07/78/ee828743c9afa9792cf20d75995e134e.png' },
    { name: 'Shopee', domain: 'shopee.vn', network: 'accesstrade', slug: 'shopee', logo: 'https://down-vn.img.susercontent.com/file/vn-50009109-1f3c3f98d6dfb6d9a0a4e0a8f1d4e1d5' },
    { name: 'Lazada', domain: 'lazada.vn', network: 'accesstrade', slug: 'lazada', logo: 'https://laz-img-cdn.alicdn.com/images/ims-web/TB1T7K2d8Cw3KVjSZFuXXcAOpXa.png' },
    { name: 'Sendo',  domain: 'sendo.vn',  network: 'direct',      slug: 'sendo',  logo: 'https://media.sendo.vn/image/png/logo.png' },
  ]
  const merchants = []
  for (const m of merchantsData) {
    const merchant = await prisma.merchant.upsert({
      where: { domain: m.domain }, // domain là @unique trong schema
      update: {
        name: m.name,
        network: m.network,
        slug: m.slug ?? null,
        logo: m.logo ?? null,
      },
      create: {
        name: m.name,
        domain: m.domain,
        network: m.network,
        slug: m.slug ?? null,
        logo: m.logo ?? null,
      },
    })
    merchants.push(merchant)
  }
  console.log('✅ Merchants ready')

  // 2) Products (images: String? -> lưu 1 URL; category connect bằng slug; slug là unique nullable -> mình set giá trị)
  const pData = [
    { name: 'iPhone 15 Pro Max',            img: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-15-pro-max.png',            cat: 'phones' },
    { name: 'MacBook Pro M3 14 inch',       img: 'https://macfinder.co.uk/product-images/Macbook/A2992/MacBook-Pro-Retina-14-Inch-96139.jpg',    cat: 'laptops' },
    { name: 'AirPods Pro (2nd generation)', img: 'https://cdsassets.apple.com/live/SZLF0YNV/images/sp/111851_sp880-airpods-Pro-2nd-gen.png',      cat: 'headphones' },
    { name: 'Apple Watch Series 9',         img: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/apple-watch-series-9.png',          cat: 'watches' },
    { name: 'iPad Air M2',                  img: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/ipad-air-11-inch-m2.png',           cat: 'tablets' },
    { name: 'Canon EOS R8',                 img: 'https://s7d1.scene7.com/is/image/canon/eos_r8_body_primary?fmt=webp-alpha&wid=800&hei=800',     cat: 'cameras' },
    { name: 'PlayStation 5 Slim',           img: 'https://media.direct.playstation.com/is/image/sierialto/ps5-slim-model-hero-new',               cat: 'gaming' },
    { name: 'Samsung Galaxy S24 Ultra',     img: 'https://incomm.com.bn/img/uploaditemdetail/dt17497e9d678e827b7dfda3247399e3e846cb1592.png',     cat: 'phones' },
    { name: 'Dell XPS 13 Plus',             img: 'https://store.mtechitng.com/wp-content/uploads/2024/04/Dell-XPS-13-Plus-9320-3.jpg',            cat: 'laptops' },
    { name: 'Sony WH-1000XM5',              img: 'https://png.pngtree.com/png-clipart/20240428/original/pngtree-isolated-of-sony-wh-1000xm5-wireless-headphones-front-view-featuring-a-png-image_14964838.png', cat: 'headphones' },
    { name: 'Xiaomi 13 Pro',                img: 'http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1677427639.01867146.png', cat: 'phones' },
    { name: 'MSI Gaming Laptop GF63',       img: 'https://cdn.cs.1worldsync.com/syndication/mediaserverredirect/7beee5f4ebc56ac67ffac56ee9a3383e/original.jpg', cat: 'laptops' },
  ]

  const products = []
  for (const p of pData) {
    const slug = toSlug(p.name)
    const product = await prisma.product.upsert({
      where: { slug }, // Product.slug có @unique (nullable) → mình đặt luôn giá trị khi seed để dùng upsert
      update: {
        description: `${p.name} - mô tả ngắn.`,
        image: p.img || placeholderImg,
        images: p.img || placeholderImg,
        brand: null,
        isActive: true,
        category: { connect: { slug: p.cat } }, // connect Category theo slug
      },
      create: {
        name: p.name,
        slug,
        description: `${p.name} - mô tả ngắn.`,
        image: p.img,
        images: p.img,
        brand: null,
        isActive: true,
        // stock có default 0, để nguyên hoặc set số khác tùy bạn
        category: { connect: { slug: p.cat } },
      },
      include: { category: true },
    })
    products.push(product)
  }
  console.log(`✅ Products ready: ${products.length}`)

  // 3) Offers + PriceHistory
  // currentPrice là Decimal? → truyền number ổn, Prisma cast
  const priceMap: Record<string, number[]> = {
    'iphone-15-pro-max': [29990000, 29490000, 30990000, 29790000],
    'macbook-pro-m3-14-inch': [49990000, 48990000, 51990000, 49490000],
    'airpods-pro-2nd-generation': [6590000, 6390000, 6790000, 6490000],
    'apple-watch-series-9': [10990000, 10790000, 11290000, 10890000],
    'ipad-air-m2': [16990000, 16490000, 17490000, 16790000],
    'canon-eos-r8': [42990000, 41990000, 43990000, 42490000],
    'playstation-5-slim': [13990000, 13490000, 14490000, 13790000],
    'samsung-galaxy-s24-ultra': [27990000, 27490000, 28990000, 27790000],
    'dell-xps-13-plus': [38990000, 37990000, 39990000, 38490000],
    'sony-wh-1000xm5': [8990000, 8790000, 9290000, 8890000],
    'xiaomi-13-pro': [18990000, 18490000, 19490000, 18790000],
    'msi-gaming-laptop-gf63': [22990000, 21990000, 23990000, 22490000],
  }

  for (const product of products) {
    const prices = priceMap[product.slug!] || [100000, 95000, 105000, 98000]

    for (let i = 0; i < merchants.length; i++) {
      const merchant = merchants[i]
      const price = prices[i] ?? prices[0]
      // unique(productId, merchantId) → dùng upsert theo cặp này
      await prisma.offer.upsert({
        where: {
          productId_merchantId: { productId: product.id, merchantId: merchant.id },
        },
        update: {
          url: `https://${merchant.domain}/product/${product.slug}`,
          affiliateUrl: `https://${merchant.domain}/product/${product.slug}?aff_id=demo`,
          currentPrice: price,
          inStock: true,
          stockStatus: 'IN_STOCK',
        },
        create: {
          productId: product.id,
          merchantId: merchant.id,
          url: `https://${merchant.domain}/product/${product.slug}`,
          affiliateUrl: `https://${merchant.domain}/product/${product.slug}?aff_id=demo`,
          currentPrice: price,
          inStock: true,
          stockStatus: 'IN_STOCK',
        },
      })

      // Thêm 1 bản ghi lịch sử giá mẫu
      const createdOffer = await prisma.offer.findUnique({
        where: { productId_merchantId: { productId: product.id, merchantId: merchant.id } },
        select: { id: true },
      })
      if (createdOffer) {
        await prisma.priceHistory.create({
          data: {
            offerId: createdOffer.id,
            price, // Decimal
          },
        })
      }
    }
  }
  console.log('✅ Offers and price history ready')

  console.log('🎉 Seed finished successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })