import { NextResponse } from 'next/server';

export function middleware(request) {
  const sessionToken = request.cookies.get('neon_session')?.value || request.cookies.get('better-auth.session_token')?.value;

  // Protect the dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!sessionToken) {
      // User is not authenticated, redirect to login
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Optional: Prevent logged-in users from accessing the auth pages
  if (sessionToken && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Only run middleware on dashboard and auth routes
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
