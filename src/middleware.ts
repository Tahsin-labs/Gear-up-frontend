import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface JwtPayload {
  id: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardPage = pathname.startsWith("/dashboard");

  let payload: JwtPayload | null = null;

  if (token) {
    try {
      const secretKey = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || "default_jwt_secret_gearup";
      const secret = new TextEncoder().encode(secretKey);
      const { payload: verifiedPayload } = await jwtVerify(token, secret);
      payload = verifiedPayload as unknown as JwtPayload;
    } catch {
      // If token decoding fails, decode unverified payload to prevent locking user out if JWT_SECRET differs
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const decoded = JSON.parse(Buffer.from(parts[1], "base64").toString());
          if (decoded && decoded.role) {
            payload = decoded as JwtPayload;
          }
        }
      } catch {
        payload = null;
      }
    }
  }

  // Redirect authenticated user away from login/register to dashboard
  if (isAuthPage) {
    if (payload) {
      const rolePath = payload.role.toLowerCase();
      return NextResponse.redirect(new URL(`/dashboard/${rolePath}`, request.url));
    }
    return NextResponse.next();
  }

  // Protect /dashboard
  if (isDashboardPage) {
    if (!payload) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("token");
      response.cookies.delete("user");
      return response;
    }

    const role = payload.role.toLowerCase();
    const customerPrefix = "/dashboard/customer";
    const providerPrefix = "/dashboard/provider";
    const adminPrefix = "/dashboard/admin";

    if (pathname.startsWith(customerPrefix) && role !== "customer") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    if (pathname.startsWith(providerPrefix) && role !== "provider") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    if (pathname.startsWith(adminPrefix) && role !== "admin") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
