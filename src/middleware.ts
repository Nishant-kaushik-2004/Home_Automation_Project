// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";

// const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/signup"];
const AUTH_ROUTES = ["/auth/login", "/auth/signup"];
const PROTECTED_ROUTES = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams, origin } = request.nextUrl;
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const { auth } = NextAuth({
    ...authConfig,
    session: {
      strategy: "jwt",
    },
  });

  const session = await auth();

  try {
    // Check for session cookie directly
    const hasValidSession = !!session?.user;
    // Debug headers (optional)
    const headers = new Headers(request.headers);
    headers.set(
      "x-auth-status",
      hasValidSession ? "authenticated" : "unauthenticated"
    );

    // Redirect authenticated users from auth pages
    if (
      hasValidSession &&
      AUTH_ROUTES.some((route) => pathname.startsWith(route))
    ) {
      return NextResponse.redirect(new URL(callbackUrl, origin), { headers });
    }

    // Protect dashboard routes
    if (
      !hasValidSession &&
      PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
    ) {
      const loginUrl = new URL("/auth/login", origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl, { headers });
    }

    return NextResponse.next({ request: { headers } });
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/error", origin));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public/).*)"],
};

// // middleware.ts
// import { NextResponse, type NextRequest } from "next/server";
// import { auth } from "@/auth";

// // const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/signup"];
// const AUTH_ROUTES = ["/auth/login", "/auth/signup"];
// const PROTECTED_ROUTES = ["/dashboard"];

// // Cookie name based on environment
// const SESSION_COOKIE_NAME =
//   process.env.NODE_ENV === "production"
//     ? "__Secure-next-auth.session-token"
//     : "authjs.session-token";

// export async function middleware(request: NextRequest) {
//   const { pathname, searchParams, origin } = request.nextUrl;
//   const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

//   const session = await auth();

//   try {
//     // Check for session cookie directly
//     const hasValidSession = request.cookies.has(SESSION_COOKIE_NAME);
//     // Debug headers (optional)
//     const headers = new Headers(request.headers);
//     headers.set(
//       "x-auth-status",
//       hasValidSession ? "authenticated" : "unauthenticated"
//     );

//     // Redirect authenticated users from auth pages
//     if (
//       hasValidSession &&
//       AUTH_ROUTES.some((route) => pathname.startsWith(route))
//     ) {
//       return NextResponse.redirect(new URL(callbackUrl, origin), { headers });
//     }

//     // Protect dashboard routes
//     if (
//       !hasValidSession &&
//       PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
//     ) {
//       const loginUrl = new URL("/auth/login", origin);
//       loginUrl.searchParams.set("callbackUrl", pathname);
//       return NextResponse.redirect(loginUrl, { headers });
//     }

//     return NextResponse.next({ request: { headers } });
//   } catch (error) {
//     console.error("Middleware error:", error);
//     return NextResponse.redirect(new URL("/error", origin));
//   }
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public/).*)"],
// };

// // middleware.ts - place this in your project root
// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";
// // import { getToken } from "next-auth/jwt";
// import { cookies } from "next/headers";

// // Configuration for public and protected routes
// const publicRoutes = ["/", "/auth/login", "/auth/signup"];
// const authRoutes = ["/auth/login", "/auth/signup"];
// const protectedRoutes = ["/dashboard"];

// // Cookie name based on environment
// const SESSION_COOKIE_NAME =
//   process.env.NODE_ENV === "production"
//     ? "__Secure-next-auth.session-token"
//     : "authjs.session-token";

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Get the token from the session
//   // const token = await getToken({
//   //   req: request,
//   //   secret: process.env.AUTH_SECRET,
//   // });

//   const hasValidSession = request.cookies.has(SESSION_COOKIE_NAME);

//   // Check if the user is authenticated
//   const isAuthenticated = !!token;

//   // Redirect logic for authenticated users trying to access auth pages
//   if (isAuthenticated && authRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // Redirect logic for unauthenticated users trying to access protected routes
//   if (
//     !isAuthenticated &&
//     protectedRoutes.some((route) => pathname.startsWith(route))
//   ) {
//     const redirectUrl = new URL("/auth/login", request.url);
//     // Store the original URL to redirect back after login
//     redirectUrl.searchParams.set("callbackUrl", pathname);
//     return NextResponse.redirect(redirectUrl);
//   }

//   // Allow access to public routes for everyone
//   if (
//     publicRoutes.some((route) => pathname === route) ||
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api/auth")
//   ) {
//     return NextResponse.next();
//   }

//   return NextResponse.next();
// }

// // Configure the middleware to match specific paths
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public folder
//      * But including:
//      * - API routes
//      * - Auth routes
//      * - Dashboard routes
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico|public/).*)",
//   ],
// };
