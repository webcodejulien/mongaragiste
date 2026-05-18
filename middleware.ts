import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token    = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Garage routes → rôle GARAGE requis
    if (pathname.startsWith('/garage') && token?.role !== 'GARAGE') {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Client routes → rôle CLIENT requis
    if (pathname.startsWith('/client') && token?.role !== 'CLIENT') {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/garage/:path*', '/client/:path*'],
}
