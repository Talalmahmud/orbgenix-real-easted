import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup"];
// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/settings"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // User is authenticated
  if (refreshToken) {
    // Redirect authenticated users away from public routes to dashboard
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Allow access to protected routes
    if (isProtectedRoute) {
      return NextResponse.next();
    }
  }
  // User is not authenticated
  else {
    // Redirect unauthenticated users away from protected routes to login
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Allow access to public routes
    if (isPublicRoute) {
      return NextResponse.next();
    }
  }

  // For any other routes that are not explicitly defined, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
