import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const MERCHANTS = [
  { name: 'Shopee', slug: 'shopee', domain: 'shopee.vn', network: 'custom', logo: null },
  { name: 'Tiki', slug: 'tiki', domain: 'tiki.vn', network: 'custom', logo: null },
  { name: 'Lazada', slug: 'lazada', domain: 'lazada.vn', network: 'custom', logo: null },
  { name: 'Con Cưng', slug: 'concung', domain: 'concung.com', network: 'custom', logo: null },
  { name: 'KidsPlaza', slug: 'kidsplaza', domain: 'kidsplaza.vn', network: 'custom', logo: null },
  { name: 'CellphoneS', slug: 'cellphones', domain: 'cellphones.com.vn', network: 'custom', logo: null },
  { name: 'Thế Giới Di Động', slug: 'thegioididong', domain: 'thegioididong.com', network: 'custom', logo: null },
  { name: 'FPT Shop', slug: 'fptshop', domain: 'fptshop.com.vn', network: 'custom', logo: null },
]

async function main() {
  for (const m of MERCHANTS) {
    const exists = await prisma.merchant.findUnique({ where: { domain: m.domain } })
    if (exists) {
      console.log(`Skip (exists): ${m.name}`)
      continue
    }
    const created = await prisma.merchant.create({ data: m as any })
    console.log(`Created: ${created.name}`)
  }
}
main().finally(() => prisma.$disconnect())