import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Clone request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-url', request.url)
  requestHeaders.set('x-pathname', pathname)

  if (pathname.startsWith('/api')) {
    requestHeaders.set('x-is-api', '1')
  }

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('ftc_admin_session')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Note: We don't verify token in middleware (no DB access)
    // Token is verified in each API route and page-level fetch
    // For extra security, add edge-compatible token verification here
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
