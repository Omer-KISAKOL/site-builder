import { NextResponse } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth-edge';

// Public route'lar - bu route'lara authentication olmadan erişilebilir
const publicRoutes = ['/login', '/register'];
const publicApiRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/verify', '/api/auth/logout'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Login/Register sayfalarına token varsa erişimi engelle
  if (publicRoutes.includes(pathname) && token) {
    try {
      // Token geçerliyse ana sayfaya yönlendir
      await verifyTokenEdge(token);
      return NextResponse.redirect(new URL('/', request.url));
    } catch (error) {
      // Token geçersizse cookie'yi temizle ve sayfaya devam et
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }

  // Public route kontrolü (token yoksa)
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Public API route kontrolü
  if (pathname.startsWith('/api/auth/')) {
    const isPublicRoute = publicApiRoutes.some((route) => pathname.startsWith(route));
    if (isPublicRoute) {
      return NextResponse.next();
    }
  }

  // API route'ları için farklı davranış
  const isApiRoute = pathname.startsWith('/api/');

  // Token yoksa
  if (!token) {
    if (isApiRoute) {
      // API route'ları için 401 döndür
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    // Sayfa route'ları için login'e yönlendir
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token'ı doğrula (async)
  try {
    const decoded = await verifyTokenEdge(token);
    return NextResponse.next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    // Geçersiz token
    if (isApiRoute) {
      // API route'ları için 401 döndür ve cookie'yi temizle
      const response = NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
      response.cookies.delete('token');
      return response;
    }
    // Sayfa route'ları için login'e yönlendir ve cookie'yi temizle
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('token');
    return response;
  }
}

// Middleware'in çalışacağı route'ları belirle
export const config = {
  matcher: [
    /*
     * Şu path'lere uygulanacak:
     * - /login hariç tüm sayfalar
     * - /register hariç tüm sayfalar
     * - /api/auth/ hariç tüm API route'ları
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

