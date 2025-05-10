// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Configure paths
const AUTH_ROUTES = ["/auth/login", "/auth/signup"];
const PROTECTED_ROUTES = ["/dashboard", "/dashboard/:path*"];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const isProduction = process.env.NODE_ENV === "production";

  // Debug headers
  const headers = new Headers(request.headers);
  headers.set("x-middleware-request", "true");

  try {
    // 1. Validate session token
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    const isAuthenticated = !!token;
    headers.set("x-auth-status", isAuthenticated ? "authenticated" : "unauthenticated");

    // 2. Redirect authenticated users from auth routes
    if (isAuthenticated && AUTH_ROUTES.some(route => pathname.startsWith(route))) {
      headers.set("x-redirect-reason", "Authenticated user accessing auth route");
      return NextResponse.redirect(new URL("/dashboard", origin), { headers });
    }

    // 3. Protect dashboard routes
    if (!isAuthenticated && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
      const loginUrl = new URL("/auth/login", origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      
      headers.set("x-redirect-reason", "Unauthenticated access to protected route");
      return NextResponse.redirect(loginUrl, { headers });
    }

    // 4. Allow public access
    return NextResponse.next({ request: { headers } });
  } catch (error) {
    console.error("Middleware error:", error);
    
    // 5. Handle errors in production
    if (isProduction) {
      const errorUrl = new URL("/500", origin);
      return NextResponse.rewrite(errorUrl);
    }
    
    // Debug headers for development
    headers.set("x-middleware-error", "true");
    return NextResponse.next({ request: { headers } });
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/login",
    "/auth/signup",
  ],
};

