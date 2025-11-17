// lib/analytics/clicks-mysql.ts
import { prisma } from '@/lib/db'

type Granularity = 'day' | 'month' | 'year'

function bucketExpr(granularity: Granularity) {
  if (granularity === 'day') return `DATE(createdAt)`                  // 2025-10-29
  if (granularity === 'month') return `DATE_FORMAT(createdAt,'%Y-%m-01')` // 2025-10-01
  return `DATE_FORMAT(createdAt,'%Y-01-01')`                           // 2025-01-01
}

export async function getClicksByTimeMySQL(
  start: Date,
  end: Date,
  granularity: Granularity,
  productId?: string
) {
  const bucket = bucketExpr(granularity)
  const whereProduct = productId ? 'AND productId = ?' : ''
  const params: any[] = [start, end]
  if (productId) params.push(productId)

  const rows = await prisma.$queryRawUnsafe<any[]>(
    `
    SELECT ${bucket} AS bucket, COUNT(*) AS clicks
    FROM Click
    WHERE createdAt >= ? AND createdAt < ?
    ${whereProduct}
    GROUP BY bucket
    ORDER BY bucket
    `,
    ...params
  )

  return rows.map(r => ({
    bucket: new Date(r.bucket),            // chuẩn Date để render biểu đồ/bảng
    clicks: Number(r.clicks) || 0,
  }))
}