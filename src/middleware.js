import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request) {
  const res = NextResponse.next();

  // Create Supabase middleware client
  const supabase = createMiddlewareClient({ req: request, res });

  // Check Supabase session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  console.log("Supabase session ====>", session?.user?.email || "No session");

  // If there's an error getting the session, log it
  if (error) {
    console.error("Supabase session error:", error);
  }

  // Protected routes logic (uncomment and customize as needed)
  // const protectedRoutes = ['/profile', '/carts', '/my-purchases'];
  // const isProtectedRoute = protectedRoutes.some(route =>
  //   request.nextUrl.pathname.startsWith(route)
  // );

  // if (isProtectedRoute && !session) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return res;
}

export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image|.*\\.png$).*)"],
};
