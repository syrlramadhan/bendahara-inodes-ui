import { NextResponse } from 'next/server'

export function middleware(request) {
  // Cek jika user mengakses halaman dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/pemasukan') ||
      request.nextUrl.pathname.startsWith('/pengeluaran') ||
      request.nextUrl.pathname.startsWith('/kas-desa') ||
      request.nextUrl.pathname.startsWith('/laporan')) {
    
    // Ambil status autentikasi dari localStorage
    const isAuthenticated = request.cookies.get('isAuthenticated')
    
    // Jika tidak terautentikasi, redirect ke halaman login
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/authentication/sign-in', request.url))
    }
  }

  // Jika user sudah login dan mencoba akses halaman login, redirect ke 
  if (request.nextUrl.pathname.startsWith('/authentication/sign-in')) {
    const isAuthenticated = request.cookies.get('isAuthenticated')
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

// Konfigurasi path yang akan diproteksi
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/pemasukan/:path*',
    '/pengeluaran/:path*',
    '/kas-desa/:path*',
    '/laporan/:path*',
    '/authentication/sign-in'
  ]
} 