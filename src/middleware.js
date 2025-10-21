import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|unauthorized).*)',
  ]
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/unauthorized',
    '/about',
    '/contact'
  ];

  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }


  return NextResponse.next();
}