import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token    = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Routes dashboard garagiste → rôle GARAGE obligatoire
    if (pathname.startsWith('/garage')) {
      if (!token) {
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }
      if (token.role !== 'GARAGE') {
        // Un client qui essaie d'accéder au dashboard garage
        return NextResponse.redirect(new URL('/login?error=AccessDenied', req.url))
      }
    }

    // Routes espace client → rôle CLIENT obligatoire
    if (pathname.startsWith('/client')) {
      if (!token) {
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }
      if (token.role !== 'CLIENT') {
        return NextResponse.redirect(new URL('/login?error=AccessDenied', req.url))
      }
    }

    // Routes admin → rôle ADMIN obligatoire
    if (pathname.startsWith('/admin')) {
      if (!token) {
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }
      if (token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // N'autorise l'accès qu'aux routes publiques sans token
      // La logique de rôle est gérée dans middleware()
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        if (pathname.startsWith('/garage') || pathname.startsWith('/client') || pathname.startsWith('/admin')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/garage/:path*',
    '/client/:path*',
    '/admin/:path*',
  ],
}
