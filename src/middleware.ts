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







// // middleware.ts
// import { NextResponse, type NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// // Configure paths
// const AUTH_ROUTES = ["/auth/login", "/auth/signup"];
// const PROTECTED_ROUTES = ["/dashboard", "/dashboard/:path*"];

// export async function middleware(request: NextRequest) {
//   const { pathname, origin } = request.nextUrl;
//   const isProduction = process.env.NODE_ENV === "production";

//   // Debug headers
//   const headers = new Headers(request.headers);
//   headers.set("x-middleware-request", "true");

//   try {
//     // 1. Validate session token
//     const token = await getToken({
//       req: request,
//       secret: process.env.AUTH_SECRET,
//     });

//     const isAuthenticated = !!token;
//     headers.set("x-auth-status", isAuthenticated ? "authenticated" : "unauthenticated");

//     // 2. Redirect authenticated users from auth routes
//     if (isAuthenticated && AUTH_ROUTES.some(route => pathname.startsWith(route))) {
//       headers.set("x-redirect-reason", "Authenticated user accessing auth route");
//       return NextResponse.redirect(new URL("/dashboard", origin), { headers });
//     }

//     // 3. Protect dashboard routes
//     if (!isAuthenticated && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
//       const loginUrl = new URL("/auth/login", origin);
//       loginUrl.searchParams.set("callbackUrl", pathname);
      
//       headers.set("x-redirect-reason", "Unauthenticated access to protected route");
//       return NextResponse.redirect(loginUrl, { headers });
//     }

//     // 4. Allow public access
//     return NextResponse.next({ request: { headers } });
//   } catch (error) {
//     console.error("Middleware error:", error);
    
//     // 5. Handle errors in production
//     if (isProduction) {
//       const errorUrl = new URL("/500", origin);
//       return NextResponse.rewrite(errorUrl);
//     }
    
//     // Debug headers for development
//     headers.set("x-middleware-error", "true");
//     return NextResponse.next({ request: { headers } });
//   }
// }

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/auth/login",
//     "/auth/signup",
//   ],
// };
