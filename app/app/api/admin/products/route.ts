import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

let makeSlug = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
   .replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '-').toLowerCase()
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('slugify')
  const s = mod.default || mod
  makeSlug = (name: string) => s(name, { lower: true, locale: 'vi', strict: true })
} catch {}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      description,
      price,           // có thể rỗng từ form
      image,
      images,
      brand,
      stock,
      isActive = true,
      slug: inputSlug,
      specs,
    } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    // Bắt buộc price là number
    const numericPrice = Number(price)
    if (Number.isNaN(numericPrice)) {
      return NextResponse.json({ error: 'price must be a number' }, { status: 400 })
    }

    const numericStock = stock !== undefined ? Number(stock) : 0
    if (Number.isNaN(numericStock)) {
      return NextResponse.json({ error: 'stock must be a number' }, { status: 400 })
    }

    const slug = (inputSlug && String(inputSlug)) || makeSlug(name)

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        image,
        images,
        brand,
        stock: numericStock,
        isActive: Boolean(isActive),
        specs,
      },
    })

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (e: any) {
    if (e?.code === 'P2002') return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    console.error('POST /api/admin/products error:', e)
    return NextResponse.json({ error: e?.message || 'Internal Server Error' }, { status: 500 })
  }
}