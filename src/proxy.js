import { NextResponse } from 'next/server';

export default function proxy(request) {
  // In a full production implementation with Neon Auth, 
  // you would verify the JWT cookie here using Jose or similar Edge-compatible library.

  const hasSession = request.cookies.has('neon_session');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup') ||
    request.nextUrl.pathname.startsWith('/verify');

  // For the sake of the UI demo, we are not strictly enforcing the block
  // bbecause we are currently relying on localStorage in the client components.
  // In production, uncomment the below to enforce server-side protection:

  if (!hasSession && !isAuthRoute && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/verify'],
};
