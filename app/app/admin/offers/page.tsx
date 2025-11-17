'use client'
import { useState } from 'react'

export default function NewOfferPage() {
  const [form, setForm] = useState({
    productId: '', merchantId: '', currentPrice: '', url: '', affiliateUrl: '', inStock: true, stockStatus: 'IN_STOCK',
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMsg(null)
    try {
      const res = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, currentPrice: form.currentPrice ? Number(form.currentPrice) : null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Lỗi tạo offer')
      setMsg('Tạo offer thành công')
      setForm({ productId: '', merchantId: '', currentPrice: '', url: '', affiliateUrl: '', inStock: true, stockStatus: 'IN_STOCK' })
    } catch (err: any) { setMsg(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Thêm offer</h1>
      <form className="space-y-4" onSubmit={submit}>
        <input name="productId" value={form.productId} onChange={onChange} placeholder="Product ID" className="w-full border p-2 rounded" />
        <input name="merchantId" value={form.merchantId} onChange={onChange} placeholder="Merchant ID" className="w-full border p-2 rounded" />
        <input name="currentPrice" value={form.currentPrice} onChange={onChange} placeholder="Giá hiện tại (VD: 25990000)" className="w-full border p-2 rounded" />
        <input name="url" value={form.url} onChange={onChange} placeholder="URL gốc" className="w-full border p-2 rounded" />
        <input name="affiliateUrl" value={form.affiliateUrl} onChange={onChange} placeholder="Affiliate URL" className="w-full border p-2 rounded" />
        <label className="flex items-center gap-2"><input type="checkbox" name="inStock" checked={form.inStock} onChange={onChange} />Còn hàng</label>
        <select name="stockStatus" value={form.stockStatus} onChange={onChange} className="w-full border p-2 rounded">
          <option value="IN_STOCK">IN_STOCK</option>
          <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
          <option value="PREORDER">PREORDER</option>
        </select>
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Đang lưu...' : 'Tạo offer'}</button>
      </form>
      {msg && <div className="mt-4 text-sm">{msg}</div>}
    </div>
  )
}