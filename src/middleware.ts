// middleware.ts - place this in your project root
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Configuration for public and protected routes
const publicRoutes = ["/", "/auth/login", "/auth/signup"];
const authRoutes = ["/auth/login", "/auth/signup"];
const protectedRoutes = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the token from the session
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  // Check if the user is authenticated
  const isAuthenticated = !!token;

  // Redirect logic for authenticated users trying to access auth pages
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect logic for unauthenticated users trying to access protected routes
  if (
    !isAuthenticated &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    const redirectUrl = new URL("/auth/login", request.url);
    // Store the original URL to redirect back after login
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Allow access to public routes for everyone
  if (
    publicRoutes.some((route) => pathname === route) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure the middleware to match specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * But including:
     * - API routes
     * - Auth routes
     * - Dashboard routes
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
