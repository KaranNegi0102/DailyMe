import { NextResponse, NextRequest } from "next/server";

const protectedRoutes = ["/blogingPage", "/myBlog", "/createBlog"];
const publicRoutes = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const pathname = req.nextUrl.pathname;

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublic = publicRoutes.includes(pathname);

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/blogingPage", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blogingPage", "/myBlog", "/createBlog", "/login", "/register"],
};
