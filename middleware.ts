import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {

  if (request.nextUrl.pathname === '/login') {
    if (request.cookies.get('token')) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  if (request.nextUrl.pathname === '/profile') {
    if (!request.cookies.get('token')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/profile',
    '/logout'
  ],
};
