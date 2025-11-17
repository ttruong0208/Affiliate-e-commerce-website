'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteButton({ slug, name }: { slug: string; name: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    if (loading) return
    const ok = confirm(`Xóa sản phẩm "${name}"? Hành động này không thể hoàn tác.`)
    if (!ok) return
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/products/${encodeURIComponent(slug)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        alert(data?.error || 'Xóa thất bại')
        return
      }
      router.refresh()
    } catch (err: any) {
      alert(err?.message || 'Xóa thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={onDelete}
      disabled={loading}
      className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-60"
      title="Xóa sản phẩm"
    >
      {loading ? 'Đang xóa...' : 'Xóa'}
    </button>
  )
}