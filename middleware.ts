import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/register'];

// Routes that should redirect to home if already authenticated
const authRoutes = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if user has auth token (stored in localStorage on client)
    // Since middleware runs on server, we'll use a cookie-based approach
    const token = request.cookies.get('auth_token')?.value;

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // If user is authenticated and trying to access auth pages, redirect to home
    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If user is not authenticated and trying to access protected routes, redirect to login
    if (!token && !isPublicRoute && pathname !== '/') {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
    ],
};
