import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode"; // Ensure correct import

export default function middleware(req) {
  const url = req.nextUrl.clone();
  const accessToken = req.cookies.get("accessToken")?.value;

  console.log("Access token from cookies:", accessToken); // Debugging log

  // Helper function to check if a token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };
  // If accessing a protected route
  const isAuthRoute = !["/login", "/signup"].includes(url.pathname);

  // Handle missing or expired accessToken
  //   || isTokenExpired(accessToken)
  if (!accessToken) {
    console.log("accessToken is wrong or expired");
    if (isAuthRoute) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from login/signup pages
  //&& !isTokenExpired(accessToken)
  if (accessToken && !isAuthRoute) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // Allow the request to proceed
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
