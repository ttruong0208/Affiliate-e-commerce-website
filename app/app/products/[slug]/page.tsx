// app/products/[id]/page.tsx (hoặc tương ứng)
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ProductDetailPageContent } from '@/components/product-detail-page-content'

type MerchantLite = {
  id: string
  name: string
  slug: string
  logo: string | null
}

type OfferLite = {
  id: string
  url: string | null
  affiliateUrl: string | null
  currentPrice: number | null
  inStock: boolean | null
  stockStatus: string | null
  merchant: MerchantLite | null
}

type ProductLite = {
  id: string
  slug?: string | null
  name: string
  description: string | null
  image: string | null
  images: string | null
  specs: string | null
  brand: string | null
  stock: number
  createdAt: string
  updatedAt: string
  offers: OfferLite[]
}

function toNumber(d: any): number | null {
  if (d == null) return null
  if (typeof d === 'number') return d
  if (typeof d?.toNumber === 'function') return d.toNumber()
  const n = Number(d)
  return Number.isFinite(n) ? n : null
}

function serializeProduct(p: any): ProductLite {
  return {
    id: p.id,
    // slug: p.slug ?? null, // bật nếu bạn select slug
    name: p.name,
    description: p.description ?? null,
    image: p.image ?? null,
    images: p.images ?? null,
    specs: p.specs ?? null,
    brand: p.brand ?? null,
    stock: p.stock ?? 0,
    createdAt: p.createdAt?.toISOString?.() ?? String(p.createdAt),
    updatedAt: p.updatedAt?.toISOString?.() ?? String(p.updatedAt),
    offers: (p.offers || []).map((o: any): OfferLite => ({
      id: o.id,
      url: o.url ?? null,
      affiliateUrl: o.affiliateUrl ?? null,
      currentPrice: toNumber(o.currentPrice),
      inStock: o.inStock ?? null,
      stockStatus: o.stockStatus ?? null,
      merchant: o.merchant
        ? {
            id: o.merchant.id,
            name: o.merchant.name,
            slug: o.merchant.slug,
            logo: o.merchant.logo ?? null,
          }
        : null,
    })),
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await prisma.product.findFirst({
    where: { id: params.id, isActive: true },
    select: { id: true, name: true, description: true },
  })

  if (!product) {
    return { title: 'Sản phẩm không tồn tại' }
  }

  return {
    title: `${product.name} - ShopDemo`,
    description:
      product.description || `Mua ${product.name} chính hãng với giá tốt nhất tại ShopDemo`,
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const productRow = await prisma.product.findFirst({
    where: { id: params.id, isActive: true },
    select: {
      id: true,
      slug: true, 
      name: true,
      description: true,
      image: true,
      images: true,
      specs: true,
      brand: true,
      stock: true,
      createdAt: true,
      updatedAt: true,
      offers: {
        select: {
          id: true,
          url: true,
          affiliateUrl: true,
          currentPrice: true,
          inStock: true,
          stockStatus: true,
          merchant: { select: { id: true, name: true, slug: true, logo: true } },
        },
        orderBy: [{ currentPrice: 'asc' as const }, { id: 'asc' as const }],
        take: 20,
      },
    },
  })

  if (!productRow) {
    notFound()
  }

  const product = serializeProduct(productRow)

  const relatedRows = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      ...(product.brand ? { brand: product.brand } : {}),
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      name: true,
      image: true,
      brand: true,
      stock: true,
      createdAt: true,
      // Không select price nữa vì schema đã bỏ
    },
  })

  type Related = {
    id: string
    slug?: string | null
    name: string
    image: string | null
    brand: string | null
    stock: number
    createdAt: string
  }

  const relatedProducts: Related[] = relatedRows.map((r: any): Related => ({
    id: r.id,
    slug: r.slug ?? null,
    name: r.name,
    image: r.image ?? null,
    brand: r.brand ?? null,
    stock: r.stock ?? 0,
    createdAt: r.createdAt?.toISOString?.() ?? String(r.createdAt),
  }))

  return (
    <ProductDetailPageContent
      product={product}
      relatedProducts={relatedProducts}
    />
  )
}