'use client'

import { useState } from 'react'

type FormState = {
  name: string
  description: string
  price: string // giữ dạng string ở input, ép số khi submit
  image: string
  brand: string
  stock: string // giữ string, ép số khi submit
  isActive: boolean
  slug: string
  // Nếu bạn có images/specs JSON, có thể thêm vào đây
}

export default function NewProductPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    description: '',
    price: '',
    image: '',
    brand: '',
    stock: '0',
    isActive: true,
    slug: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Ép số và validate
    const numericPrice = Number(form.price)
    const numericStock = Number(form.stock)

    if (Number.isNaN(numericPrice)) {
      setLoading(false)
      setMessage('Giá (price) phải là số')
      return
    }
    if (Number.isNaN(numericStock)) {
      setLoading(false)
      setMessage('Tồn kho (stock) phải là số')
      return
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description || undefined,
          price: numericPrice,       // luôn là number
          image: form.image || undefined,
          brand: form.brand || undefined,
          stock: numericStock,       // luôn là number
          isActive: form.isActive,
          slug: form.slug.trim() || undefined, // để trống thì server tự tạo
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Lỗi tạo sản phẩm')
      }

      setMessage('Tạo sản phẩm thành công')
      setForm({
        name: '',
        description: '',
        price: '',
        image: '',
        brand: '',
        stock: '0',
        isActive: true,
        slug: '',
      })
    } catch (err: any) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Thêm sản phẩm</h1>
      <form className="space-y-4" onSubmit={submit}>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Tên sản phẩm"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Mô tả"
          className="w-full border p-2 rounded"
        />
        <input
          name="price"
          value={form.price}
          onChange={onChange}
          placeholder="Giá (VD: 26990000)"
          className="w-full border p-2 rounded"
          inputMode="numeric"
          pattern="[0-9]*"
          required
        />
        <input
          name="image"
          value={form.image}
          onChange={onChange}
          placeholder="Link ảnh"
          className="w-full border p-2 rounded"
        />
        <input
          name="brand"
          value={form.brand}
          onChange={onChange}
          placeholder="Thương hiệu"
          className="w-full border p-2 rounded"
        />
        <input
          name="stock"
          value={form.stock}
          onChange={onChange}
          placeholder="Tồn kho"
          className="w-full border p-2 rounded"
          inputMode="numeric"
          pattern="[0-9]*"
          required
        />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
          Kích hoạt
        </label>
        <input
          name="slug"
          value={form.slug}
          onChange={onChange}
          placeholder="Slug (để trống sẽ tự tạo từ tên)"
          className="w-full border p-2 rounded"
        />
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? 'Đang lưu...' : 'Tạo sản phẩm'}
        </button>
      </form>
      {message && <div className="mt-4 text-sm">{message}</div>}
    </div>
  )
}