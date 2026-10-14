import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname } = req.nextUrl;
  const isAuth = !!token;
  const role = token?.role as string | undefined;

  // Tutup halaman register publik
  if (pathname === "/register") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect admin yang mencoba masuk ke halaman user
  if (isAuth && role === "ADMIN") {
    if (
      pathname === "/dashboard" ||
      pathname.startsWith("/targets") ||
      pathname === "/history"
    ) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // Proteksi halaman admin untuk non-admin
  if (pathname.startsWith("/admin")) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Proteksi halaman user untuk tamu
  const userProtected = ["/dashboard", "/targets", "/history", "/profile"];
  if (userProtected.some((p) => pathname.startsWith(p)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/targets/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/register",
  ],
};
