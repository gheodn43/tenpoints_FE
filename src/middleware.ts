import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('refreshToken');
  const redirectUrl = new URL('/signin', request.url);

  // Trường hợp không có token và không ở trang signin
  if (!token && request.nextUrl.pathname !== '/signin') {
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    console.log(request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Trường hợp có token và cố gắng truy cập signin
  if (token && request.nextUrl.pathname === '/signin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/test/:path*', '/signin'],
};
