import { NextResponse } from 'next/server';

export function proxy(request) {
  const sessionToken = request.cookies.get('neon_session')?.value || request.cookies.get('better-auth.session_token')?.value;

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup') ||
    request.nextUrl.pathname.startsWith('/verify');

  // Protect the dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!sessionToken) {
      // User is not authenticated, redirect to login
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent logged-in users from accessing the auth pages
  if (sessionToken && isAuthRoute) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Only run proxy on dashboard and auth routes
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/verify'],
};
