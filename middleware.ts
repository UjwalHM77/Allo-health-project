import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Performance-optimized middleware for Allo Health
export function middleware(request: NextRequest) {
  const startTime = Date.now();
  
  // Get the pathname from the request
  const path = request.nextUrl.pathname;
  
  // Performance monitoring
  const response = NextResponse.next();
  
  // Add performance headers
  response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
  response.headers.set('X-Performance-Monitor', 'enabled');
  
  // Route-specific optimizations
  if (path.startsWith('/api/')) {
    // API route optimizations
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  } else if (path.startsWith('/dashboard') || path.startsWith('/appointments') || 
             path.startsWith('/patients') || path.startsWith('/doctors') || 
             path.startsWith('/queue') || path.startsWith('/records')) {
    // Protected route optimizations
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // Check authentication for protected routes
    const token = request.cookies.get('authToken')?.value;
    if (!token && path !== '/') {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else if (path === '/') {
    // Public route optimizations
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  }
  
  // Performance optimizations for all routes
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add CORS headers for API routes
  if (path.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  // Log performance metrics in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${path} - ${Date.now() - startTime}ms`);
  }
  
  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
