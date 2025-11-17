'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import component Chart (tránh SSR)
const BarTopProducts = dynamic(() => import('@/components/Charts/BarTopProducts'), { ssr: false })

type Granularity = 'day' | 'month' | 'year'
type ApiRow = { bucket: string; clicks: number }
type TopRow = { productId: string; name: string; slug: string; clicks: number }

function formatVNDate(d: string) {
  try { return new Date(d).toLocaleDateString('vi-VN') } catch { return d }
}
function formatVNMonthStart(d: string) {
  const dt = new Date(d)
  return `${dt.getMonth() + 1}/${dt.getFullYear()}`
}

export default function ClickAnalyticsPage() {
  const [granularity, setGranularity] = useState<Granularity>('day')
  const [start, setStart] = useState<string>(() => {
    const end = new Date()
    const s = new Date(end.getTime() - 30 * 864e5)
    return s.toISOString().slice(0, 10)
  })
  const [end, setEnd] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [productId, setProductId] = useState<string>('')

  const [rows, setRows] = useState<ApiRow[]>([])
  const [topRows, setTopRows] = useState<TopRow[]>([])
  const [loading, setLoading] = useState(false)
  const [topLoading, setTopLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [topError, setTopError] = useState<string | null>(null)

  const query = useMemo(() => {
    const p = new URLSearchParams()
    p.set('granularity', granularity)
    p.set('start', start)
    p.set('end', end)
    if (productId) p.set('productId', productId)
    return p.toString()
  }, [granularity, start, end, productId])

  // Bảng theo mốc thời gian
  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true); setError(null)
      try {
        const res = await fetch(`/api/admin/clicks?${query}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!ignore) setRows(json?.data || [])
      } catch (e: any) {
        if (!ignore) setError(e.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [query])

  // Bảng và biểu đồ top sản phẩm
  useEffect(() => {
    let ignore = false
    async function loadTop() {
      setTopLoading(true); setTopError(null)
      try {
        const endPlus1 = new Date(end)
        endPlus1.setDate(endPlus1.getDate() + 1)
        const qs = new URLSearchParams({
          start,
          end: endPlus1.toISOString().slice(0, 10),
          limit: '50',
        }).toString()

        const res = await fetch(`/api/admin/clicks/by-product?${qs}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!ignore) setTopRows(json?.data || [])
      } catch (e: any) {
        if (!ignore) setTopError(e.message)
      } finally {
        if (!ignore) setTopLoading(false)
      }
    }
    loadTop()
    return () => { ignore = true }
  }, [start, end])

  const numberVN = (n: number) => new Intl.NumberFormat('vi-VN').format(n)

  // Chuẩn bị data cho chart
  const chartData = topRows.map((r) => ({
    label: r.name || r.productId.slice(0, 8),
    clicks: r.clicks,
  }))

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold mb-6">Thống kê lượt click</h1>

      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2 border bg-white p-3 rounded-lg">
          <label className="w-24 text-sm text-gray-600">Chế độ</label>
          <select 
            value={granularity} 
            onChange={(e) => setGranularity(e.target.value as Granularity)} 
            className="w-full border px-2 py-1 rounded"
          >
            <option value="day">Theo ngày</option>
            <option value="month">Theo tháng</option>
            <option value="year">Theo năm</option>
          </select>
        </div>

        <div className="flex items-center gap-2 border bg-white p-3 rounded-lg">
          <label className="w-24 text-sm text-gray-600">Bắt đầu</label>
          <input 
            type="date" 
            value={start} 
            onChange={(e) => setStart(e.target.value)} 
            className="w-full border px-2 py-1 rounded" 
          />
        </div>

        <div className="flex items-center gap-2 border bg-white p-3 rounded-lg">
          <label className="w-24 text-sm text-gray-600">Kết thúc</label>
          <input 
            type="date" 
            value={end} 
            onChange={(e) => setEnd(e.target.value)} 
            className="w-full border px-2 py-1 rounded" 
          />
        </div>

        <div className="flex items-center gap-2 border bg-white p-3 rounded-lg">
          <label className="w-24 text-sm text-gray-600">Product ID</label>
          <input 
            placeholder="(Tuỳ chọn)" 
            value={productId} 
            onChange={(e) => setProductId(e.target.value)} 
            className="w-full border px-2 py-1 rounded" 
          />
        </div>
      </div>

      {/* Biểu đồ top sản phẩm */}
      <div className="rounded-lg border bg-white p-4 shadow-sm mb-6">
        <div className="mb-3 font-semibold text-gray-700">Biểu đồ Top sản phẩm theo lượt click</div>
        <BarTopProducts data={chartData} loading={topLoading} error={topError} />
      </div>

      {/* Bảng Top sản phẩm */}
      <div className="overflow-x-auto border bg-white rounded-lg shadow-sm">
        <div className="border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">
          Top sản phẩm theo lượt click
        </div>
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 text-gray-600 font-semibold">Sản phẩm</th>
              <th className="px-4 py-3 text-gray-600 font-semibold">Product ID</th>
              <th className="px-4 py-3 text-gray-600 text-right font-semibold">Lượt click</th>
              <th className="px-4 py-3 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {topLoading ? (
              <tr><td colSpan={4} className="px-4 py-4 text-gray-600">Đang tải…</td></tr>
            ) : topError ? (
              <tr><td colSpan={4} className="px-4 py-4 text-red-600">{topError}</td></tr>
            ) : topRows.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-4 text-gray-600">Không có dữ liệu.</td></tr>
            ) : (
              topRows.map((r) => (
                <tr key={r.productId} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 max-w-[300px] truncate">{r.name}</div>
                    {r.slug && <div className="text-xs text-gray-500">/{r.slug}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{r.productId}</td>
                  <td className="px-4 py-3 text-right font-semibold">{numberVN(r.clicks)}</td>
                  <td className="px-4 py-3">
                    {r.slug ? (
                      <a
                      href={`/products/${r.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-700 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Mở PDP
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Không có slug</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}