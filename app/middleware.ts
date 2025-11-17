// middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  (req) => {
    const token = req.nextauth.token
    const role = (token as any)?.role
    const p = req.nextUrl.pathname

    // Allow tạm để test
    if (p.startsWith('/api/admin/clicks/by-product')) {
      return NextResponse.next()
    }

    if (role !== 2) {
      if (p.startsWith('/api/admin')) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden: Admin only' }), {
          status: 403, headers: { 'Content-Type': 'application/json' },
        })
      }
      return NextResponse.redirect(new URL('/403', req.url))
    }
    return NextResponse.next()
  },
  { callbacks: { authorized: ({ token }) => !!token }, pages: { signIn: '/auth/login' } }
)

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] }