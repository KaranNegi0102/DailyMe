import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  const isProtected =
    pathname.startsWith("/blogingPage") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/myBlog") ||
    pathname.startsWith("/blogInfo");

  const isPublic =
    pathname === "/login" || pathname === "/register";

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/blogingPage", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/blogingPage",
    "/profile",
    "/myBlog",
    "/blogInfo/:path*",  
    "/login",
    "/register",
  ],
};
