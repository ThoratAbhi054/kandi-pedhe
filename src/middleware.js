import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    // console.log("No token found, redirecting to /login");
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify the token with `jose`
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
    );
    console.log("Token is valid, allowing access to the route");
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!login|signup|api).*)"], // Exclude `/login`, `/signup`, and `/api`
};
