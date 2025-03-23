import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const path = req.nextUrl.pathname;

  // Define public routes (don't require authentication)
  const publicRoutes = ["/sign-in", "/sign-up", "/verify-email", "/reset-password"];
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route)) || path === "/"; 

  // If authenticated and trying to access public routes, redirect to dashboard
  if (session?.user && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If trying to access protected routes without authentication
  if (!session?.user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

// matching the routes
export const config = {
  matcher: [
    "/", 
    "/sign-up", 
    "/sign-in", 
    "/sign-out", 
    "/reset-password", 
    "/reset-password/:token", 
    "/verify-email", 
    "/verify-email/:token", 
    "/dashboard", 
    "/dashboard/:path*"
  ],
};
