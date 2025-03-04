import { NextResponse } from 'next/server'

export function middleware(request) {
  const authToken = request.cookies.get('authToken')?.value
  const { pathname } = request.nextUrl

  // Daftar path yang tidak memerlukan autentikasi
  const publicPaths = ['/authentication/sign-in']
  
  // Jika user mengakses halaman publik dan sudah login, redirect ke dashboard
  if (publicPaths.includes(pathname) && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Jika user mengakses halaman private dan belum login, redirect ke login
  if (!publicPaths.includes(pathname) && !authToken) {
    return NextResponse.redirect(new URL('/authentication/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/iuran/:path*',
    '/sumbangan/:path*',
    '/pengeluaran/:path*',
    '/algo/:path*',
    '/authentication/:path*'
  ]
} 