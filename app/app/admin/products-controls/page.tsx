'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function ProductsClientControls({
  initialQuery,
  page,
  totalPages,
}: {
  initialQuery: string
  page: number
  totalPages: number
}) {
  const [q, setQ] = useState(initialQuery || '')
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  // đồng bộ q khi back/forward
  useEffect(() => {
    setQ(params.get('q') || '')
  }, [params])

  const go = (nextPage: number, nextQ = q) => {
    const sp = new URLSearchParams()
    if (nextPage > 1) sp.set('page', String(nextPage))
    if (nextQ.trim()) sp.set('q', nextQ.trim())
    router.push(`${pathname}${sp.toString() ? `?${sp.toString()}` : ''}`)
  }

  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full max-w-xl items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && go(1, q)}
          placeholder="Tìm sản phẩm theo tên..."
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <button
          onClick={() => go(1, q)}
          className="rounded bg-gray-800 px-3 py-2 text-sm text-white hover:bg-black"
        >
          Tìm
        </button>
        {q && (
          <button
            onClick={() => { setQ(''); go(1, '') }}
            className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Xóa
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => canPrev && go(page - 1)}
          disabled={!canPrev}
          className={`rounded border px-3 py-2 ${canPrev ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'cursor-not-allowed border-gray-200 text-gray-300'}`}
        >
          ← Trước
        </button>
        <span className="rounded bg-gray-100 px-2 py-1">{page} / {totalPages}</span>
        <button
          onClick={() => canNext && go(page + 1)}
          disabled={!canNext}
          className={`rounded border px-3 py-2 ${canNext ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'cursor-not-allowed border-gray-200 text-gray-300'}`}
        >
          Sau →
        </button>
      </div>
    </div>
  )
}