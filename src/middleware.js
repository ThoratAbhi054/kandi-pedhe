import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { AuthActions } from "../src/app/auth/utils";

export async function middleware(request) {
  const cookieStore = cookies();
  const { getToken, logout, handleJWTRefresh } = AuthActions();

  let token = getToken("access");

  console.log("Current token:", token);

  // If no access token is found, try to refresh it
  if (!token) {
    try {
      console.log("Token expired! Attempting refresh...");
      await handleJWTRefresh();
      token = getToken("access"); // Get new token after refresh
      console.log("Token refreshed successfully:", token);
    } catch (error) {
      console.error("Token refresh failed. Logging out:", error);
      logout();
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image|.*\\.png$).*)"],
};
