import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Pages du dashboard garagiste (routes protégées)
const GARAGE_DASHBOARD_ROUTES = [
  '/garage/agenda',
  '/garage/appointments',
  '/garage/clients',
  '/garage/stats',
  '/garage/reviews',
  '/garage/notifications',
  '/garage/billing',
  '/garage/settings',
  '/garage/help',
]

function isGarageDashboard(pathname: string) {
  if (pathname === '/garage') return true
  return GARAGE_DASHBOARD_ROUTES.some(r => pathname.startsWith(r))
}

export default withAuth(
  function middleware(req) {
    const token    = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Dashboard garagiste → rôle GARAGE obligatoire
    if (isGarageDashboard(pathname)) {
      if (!token) {
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }
      if (token.role !== 'GARAGE') {
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
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        // Seules les routes dashboard et admin nécessitent un token
        if (isGarageDashboard(pathname) || pathname.startsWith('/client') || pathname.startsWith('/admin')) {
          return !!token
        }
        // /garage/[slug] (pages publiques) → toujours autorisé
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/garage',
    '/garage/agenda/:path*',
    '/garage/appointments/:path*',
    '/garage/clients/:path*',
    '/garage/stats/:path*',
    '/garage/reviews/:path*',
    '/garage/notifications/:path*',
    '/garage/billing/:path*',
    '/garage/settings/:path*',
    '/garage/help/:path*',
    '/client/:path*',
    '/admin/:path*',
  ],
}
