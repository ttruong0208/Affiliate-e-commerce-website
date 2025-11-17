import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function DELETE(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
    }

    const existing = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await prisma.product.delete({ where: { slug } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    if (e?.code === 'P2003') {
      // Nếu có bảng liên quan chưa cascade
      return NextResponse.json({ error: 'Cannot delete due to related records' }, { status: 409 })
    }
    console.error('DELETE /api/admin/products/[slug] error:', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}