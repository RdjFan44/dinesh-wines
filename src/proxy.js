import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-in-production'
);

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Always allow the login page through (no token required)
  if (pathname === '/admin/login') {
    // If already logged in, redirect away from login → dashboard
    const token = request.cookies.get('admin-token')?.value;
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch {
        // Invalid/expired token — let them through to re-login
      }
    }
    return NextResponse.next();
  }

  // For every other /admin/* route: verify the JWT cookie
  const token = request.cookies.get('admin-token')?.value;

  if (!token) {
    // No token — redirect to login, preserving the intended destination
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next(); // ✅ Valid token — allow through
  } catch {
    // Token expired or tampered — clear it and redirect to login
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('admin-token');
    return response;
  }
}

export const config = {
  // Run on all /admin paths
  matcher: ['/admin', '/admin/:path*'],
};
