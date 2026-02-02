import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Define paths to protect
  const protectedPaths = ['/admin', '/api/admin'];
  const isProtected = protectedPaths.some((path) => 
    request.nextUrl.pathname.startsWith(path)
  );

  // 2. Allow access to login page specifically to avoid loop
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // 3. Check for auth token
  if (isProtected) {
    const token = request.cookies.get('admin_token');

    if (!token) {
      // If API request, verify authorization or return 401
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      // If page request, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ],
};
