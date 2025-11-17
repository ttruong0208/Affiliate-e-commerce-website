import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { productId, merchantId, url = null, affiliateUrl = null, currentPrice = null, inStock = true, stockStatus = 'IN_STOCK' } = body
    if (!productId || !merchantId) return NextResponse.json({ error: 'productId and merchantId are required' }, { status: 400 })
    const offer = await prisma.offer.create({
      data: {
        productId, merchantId, url, affiliateUrl,
        currentPrice: currentPrice != null ? Number(currentPrice) : null,
        inStock: Boolean(inStock), stockStatus,
      },
    })
    return NextResponse.json({ success: true, offer })
  } catch (e: any) {
    console.error(e); return NextResponse.json({ error: e.message }, { status: 500 })
  }
}