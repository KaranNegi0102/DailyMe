import {NextResponse , NextRequest} from "next/server";

const protectedRoutes = ["/myBlog","/createBlog","/blogInfo/:blogId"];
const publicRoutes = ["/login","/register"];

export function middleware(req:NextRequest){
  const token = req.cookies.get("auth_token")?.value;
  console.log("this is my token ",token);

  console.log(req.nextUrl.pathname)

  if(!token && protectedRoutes.includes(req.nextUrl.pathname)){
    return NextResponse.redirect(new URL("/",req.url));
  }
  if(token && publicRoutes.includes(req.nextUrl.pathname)){
    return NextResponse.redirect(new URL("/",req.url));
  }

  return NextResponse.next();
}

export const config ={
  matcher: ["/blogInfo","/createBlog","/myBlog","/login","/register"],
}