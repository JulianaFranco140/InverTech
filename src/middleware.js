import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    // Solo proteger rutas específicas que realmente necesitan middleware
    '/((?!api|_next/static|_next/image|favicon.ico|unauthorized).*)',
  ]
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Permitir acceso a rutas públicas
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

  // Para rutas protegidas, permitir acceso
  // La protección real se hace en el componente ProtectedRoute
  return NextResponse.next();
}