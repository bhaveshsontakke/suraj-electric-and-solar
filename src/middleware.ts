import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths that don't require auth
  const publicPaths = [
    '/',
    '/about',
    '/services',
    '/projects',
    '/reviews',
    '/calculator',
    '/faq',
    '/contact',
    '/login',
    '/signup',
    '/api/auth',
    '/api/upload',
  ]

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith('/api/auth') || pathname.startsWith('/api/upload') || pathname.startsWith('/_next') || pathname.startsWith('/uploads') || pathname.includes('.')
  )

  if (isPublicPath) {
    return NextResponse.next()
  }

  const session = await auth()

  if (!session) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  const user = session.user as any

  // Customer role access
  if (user.role === 'CUSTOMER') {
    const allowedCustomerRoutes = ['/dashboard', '/dashboard/reviews']
    const isAllowed = allowedCustomerRoutes.some((route) => pathname === route)
    if (!isAllowed && pathname.startsWith('/dashboard/')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Worker can only access worker-specific routes
  if (user.role === 'WORKER') {
    const workerRoutes = ['/dashboard/worker', '/dashboard/my-projects', '/dashboard/my-attendance', '/dashboard/submit-report']
    const isWorkerRoute = workerRoutes.some((route) => pathname.startsWith(route))
    if (!isWorkerRoute && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/dashboard/worker', request.url))
    }
  }

  // Office staff restrictions
  if (user.role === 'OFFICE_STAFF') {
    const restrictedRoutes = [
      '/dashboard/workers',
      '/dashboard/expenses',
      '/dashboard/reports',
      '/dashboard/settings',
      '/dashboard/users',
    ]
    const isRestricted = restrictedRoutes.some((route) => pathname.startsWith(route))
    if (isRestricted) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
