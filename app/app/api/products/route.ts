// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

function toNumber(d: any) {
  if (d == null) return null
  if (typeof d === 'number') return d
  if (typeof d?.toNumber === 'function') return d.toNumber()
  const n = Number(d)
  return Number.isFinite(n) ? n : null
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const categoryParam = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = (searchParams.get('featured') ?? '').toLowerCase() === 'true'
    const limitNum = Number(searchParams.get('limit') ?? (featured ? 6 : 12))
    const pageNum = Number(searchParams.get('page') ?? 1)
    const pageSize = 12

    const take = Number.isFinite(limitNum) && limitNum > 0 && limitNum <= 100 ? limitNum : 12
    const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1

    // where cho Product
    const where: any = { isActive: true }

    // Filter theo category đúng kiểu quan hệ (dùng slug)
    if (categoryParam && categoryParam !== 'all') {
      where.category = {
        slug: { equals: categoryParam },
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ]
    }

    const productSelect = {
      id: true,
      slug: true,
      name: true,
      description: true,
      image: true,
      images: true,
      specs: true,
      brand: true,
      stock: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: { id: true, name: true, slug: true },
      },
      offers: {
        select: {
          id: true,
          currentPrice: true,
          inStock: true,
          stockStatus: true,
          merchant: { 
            select: { 
              id: true,
              name: true, 
              slug: true, 
              logo: true, 
              domain: true 
            } 
          },
          affiliateUrl: true,
          url: true,
        },
        orderBy: { currentPrice: 'asc' as const },
        take: 10,
      },
    } as const

    type OfferLite = {
      id: string
      currentPrice: number | null
      inStock?: boolean | null
      stockStatus?: string | null
      affiliateUrl?: string | null
      url?: string | null
      merchant: {
        id: string
        name: string
        slug: string
        logo?: string | null
        domain?: string | null
      } | null
    }
    
    const serialize = (p: any) => {
      const offers: OfferLite[] = (p.offers || []).map((o: any): OfferLite => ({
        id: o.id,
        currentPrice: toNumber(o.currentPrice),
        inStock: o.inStock ?? null,
        stockStatus: o.stockStatus ?? null,
        affiliateUrl: o.affiliateUrl ?? null,
        url: o.url ?? null,
        merchant: o.merchant
          ? {
              id: o.merchant.id,
              name: o.merchant.name,
              slug: o.merchant.slug,
              logo: o.merchant.logo ?? null,
              domain: o.merchant.domain ?? null,
            }
          : null,
      }))
    
      const minOffer =
        offers.length > 0
          ? offers
              .filter((o: OfferLite) => o.currentPrice != null)
              .sort((a: OfferLite, b: OfferLite) => (a.currentPrice! - b.currentPrice!))[0]
          : null
    
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        image: p.image,
        images: p.images,
        specs: p.specs,
        brand: p.brand,
        stock: p.stock,
        isActive: p.isActive,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        category: p.category
          ? {
              id: p.category.id as string,
              name: p.category.name as string,
              slug: p.category.slug as string,
            }
          : null,
        offers,
        offerCount: offers.length,
        minPrice: minOffer?.currentPrice ?? null,
        minPriceMerchant: minOffer?.merchant ?? null,
      }
    }

    if (featured) {
      const rows = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        select: productSelect,
      })
      const data = rows.map(serialize)
      return NextResponse.json({
        success: true,
        data,
        pagination: { page: 1, pageSize: take, totalCount: data.length, totalPages: 1 },
      })
    }

    const [totalCount, rows] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: pageSize,
        skip: (page - 1) * pageSize,
        select: productSelect,
      }),
    ])
    const data = rows.map(serialize)

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Có lỗi xảy ra khi tải sản phẩm' } },
      { status: 500 }
    )
  }
}