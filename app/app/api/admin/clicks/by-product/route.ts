import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type Row = { productId: string; clicks: bigint | number }
type ProductPick = { id: string; name: string | null; slug: string | null } // name/slug có thể null
type Out = { productId: string; name: string; slug: string; clicks: number }

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const startStr = searchParams.get('start')
    const endStr = searchParams.get('end')
    const limit = Math.max(1, Math.min(Number(searchParams.get('limit') || '50'), 200))

    const end = endStr ? new Date(endStr) : new Date()
    const start = startStr ? new Date(startStr) : new Date(end.getTime() - 30 * 864e5)

    const raw: Row[] = await prisma.$queryRawUnsafe(
      `
      SELECT productId, COUNT(*) AS clicks
      FROM clicks
      WHERE productId IS NOT NULL
        AND clickedAt >= ? AND clickedAt < ?
      GROUP BY productId
      ORDER BY clicks DESC
      LIMIT ?
      `,
      start, end, limit
    )

    if (!raw.length) {
      return NextResponse.json({ success: true, data: [] as Out[] })
    }

    const ids = raw.map(r => r.productId)

    const products: ProductPick[] = await prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, slug: true },
    })

    const map = new Map<string, ProductPick>(products.map(p => [p.id, p]))

    const data: Out[] = raw.map(r => {
      const clicks = typeof r.clicks === 'bigint' ? Number(r.clicks) : Number(r.clicks || 0)
      const p = map.get(r.productId)
      return {
        productId: r.productId,
        name: (p?.name ?? '(Không tìm thấy)') || '(Không tìm thấy)',
        slug: p?.slug ?? '',
        clicks,
      }
    })

    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Server error' }, { status: 500 })
  }
}