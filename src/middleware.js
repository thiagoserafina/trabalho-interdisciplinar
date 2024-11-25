import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const TOKEN_KEY = "token";

export async function middleware(request) {
  const cookie = await cookies();
  const token = cookie.get(TOKEN_KEY);

  const protectedRoutes = [
    "/calendar",
    "/professionals",
    "/students",
    "/settings",
  ];

  const isProtectedRoute = protectedRoutes.includes(request.nextUrl.pathname);

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/calendar/:path*",
    "/professionals/:path*",
    "/students/:path*",
    "/settings/:path*",
  ],
};
