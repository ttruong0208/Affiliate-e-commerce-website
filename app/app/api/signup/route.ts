import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password, name, phone } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email và mật khẩu là bắt buộc' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: 'Email đã được sử dụng' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)

    // Tạo user KHÔNG đụng tới field role
    const created = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashed,
        // Nếu schema chưa có cột phone, bỏ dòng này
        phone: typeof phone === 'string' && phone.trim() ? phone.trim() : undefined,
      },
    })

    // Bootstrap admin: user đầu tiên làm admin
    const totalUsers = await prisma.user.count()
    const newRole = totalUsers === 1 ? 2 : 1

    // Update role NGAY SAU KHI TẠO
    // Dùng ép kiểu tạm thời để tránh TS lỗi khi types chưa update
    await prisma.user.update({
      where: { id: created.id },
      data: { role: newRole as any },
    })

    return NextResponse.json(
      {
        message: 'Đăng ký thành công',
        user: {
          id: created.id,
          email: created.email,
          name: created.name,
          role: newRole,
        },
      },
      { status: 201 }
    )
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'Email đã được sử dụng' }, { status: 409 })
    }
    console.error('[SIGNUP ERROR]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}