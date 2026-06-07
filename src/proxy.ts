import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('syncline-access-token')?.value;

  const protectedPrefixes = ['/dashboard', '/projects', '/notifications', '/users'];
  const authPrefixes = ['/login', '/signup'];

  const hasToken = accessToken && accessToken !== 'undefined' && accessToken !== 'null';

  // Handle root — only redirect to dashboard if logged in, otherwise allow landing page access
  if (pathname === '/') {
    if (hasToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protect private routes — redirect unauthenticated users to login
  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    if (!hasToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent authenticated users from visiting auth pages
  if (authPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    if (hasToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
