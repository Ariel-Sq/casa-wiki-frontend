import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/constants';

/**
 * Mint the anonymous shopper id before any server component reads it, so the
 * cart is stable from the very first page view.
 */
export function middleware(request: NextRequest) {
  if (request.cookies.get(SESSION_COOKIE)?.value) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.cookies.set(SESSION_COOKIE, crypto.randomUUID(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
