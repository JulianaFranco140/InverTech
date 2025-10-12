import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';


export const config = {
  runtime: 'nodejs',
  matcher: [
    '/dashboard/:path*',
    '/opportunities/:path*',
    '/simulation/:path*',
    '/portfolio/:path*',
    '/entrepreneur/:path*',
    '/investors/:path*',
    '/project/:path*',
    '/login',
    '/register'
  ]
};

export function middleware(request) {
const token = request.cookies.get('auth-token')?.value;
const { pathname } = request.nextUrl;
console.log('Requested Path:', pathname);

const entrepreneurRoutes = ['/entrepreneur', '/investors', '/project'];
const investorRoutes = ['/dashboard', '/opportunities', '/simulation', '/portfolio'];

const protectedRoutes = [...entrepreneurRoutes, ...investorRoutes];


const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
const isEntrepreneurRoute = entrepreneurRoutes.some(route => pathname.startsWith(route));
const isInvestorRoute = investorRoutes.some(route => pathname.startsWith(route));

console.log('Is protected route:', isProtectedRoute);
console.log('Is entrepreneur route:', isEntrepreneurRoute);
console.log('Is investor route:', isInvestorRoute);

const authRoutes = ['/login', '/register'];
const isAuthRoute = authRoutes.includes(pathname);
console.log('Is auth route: ', isAuthRoute)
console.log('Token:', token);

if (isProtectedRoute) {
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
}

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 1 && isInvestorRoute) {
      return NextResponse.redirect(new URL('/entrepreneur', request.url));
    }

    if (decoded.role === 2 && isEntrepreneurRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

} catch (error) {
  console.log('Error al verificar token:', error);
  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.delete('auth-token');
  return response;
  
}
}


if (isAuthRoute && token) {
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const redirectUrl = decoded.role === 1 ? '/entrepreneur' : '/dashboard';
  return NextResponse.redirect(new URL(redirectUrl, request.url));
} catch (error) {
  console.log('Error al verificar token en auth route:', error);

  const response = NextResponse.next();
  response.cookies.delete('auth-token');
  return response;
}
}

return NextResponse.next();
}

