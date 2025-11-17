// app/api/admin/clicks/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type Granularity = 'day' | 'month' | 'year'

function bucketExpr(granularity: Granularity) {
  const ts = `CONVERT_TZ(clickedAt,'UTC','Asia/Ho_Chi_Minh')` // ĐỔI createdAt -> clickedAt
  if (granularity === 'day') return `DATE(${ts})`
  if (granularity === 'month') return `DATE_FORMAT(${ts},'%Y-%m-01')`
  return `DATE_FORMAT(${ts},'%Y-01-01')`
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const granularity = (searchParams.get('granularity') as Granularity) || 'day'
    const startStr = searchParams.get('start')
    const endStr = searchParams.get('end')
    const productId = searchParams.get('productId') || undefined

    const end = endStr ? new Date(endStr) : new Date()
    const start = startStr ? new Date(startStr) : new Date(end.getTime() - 30 * 864e5)

    const bucket = bucketExpr(granularity)
    const whereProduct = productId ? 'AND productId = ?' : ''
    const params: any[] = [start, end]
    if (productId) params.push(productId)

    const rows = await prisma.$queryRawUnsafe<any[]>(
      `
      SELECT ${bucket} AS bucket, COUNT(*) AS clicks
      FROM Clicks
      WHERE clickedAt >= ? AND clickedAt < ?
      ${whereProduct}
      GROUP BY bucket
      ORDER BY bucket
      `,
      ...params
    )

    const data = rows.map(r => ({
      bucket: new Date(r.bucket).toISOString(),
      clicks: Number(r.clicks) || 0,
    }))

    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    console.error('Click analytics error:', e)
    return NextResponse.json({ success: false, error: e?.message || 'Server error' }, { status: 500 })
  }
}