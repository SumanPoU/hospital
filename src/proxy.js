import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { verifyToken } from "@/lib/jwt";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const bearerToken = request.headers
    .get("authorization")
    ?.replace("Bearer ", "")
    .trim();

  const cookieToken = request.cookies.get("token")?.value;
  const customToken = bearerToken || cookieToken;

  const nextAuthToken = await getToken({
    req: request,
    secret: NEXTAUTH_SECRET,
  });

  if (pathname.startsWith("/api/protected")) {
    let decoded = null;
    if (customToken) decoded = await verifyToken(customToken);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const headers = new Headers(request.headers);
    headers.set("x-user", JSON.stringify(decoded));
    headers.set("x-user-id", decoded.id || decoded.sub);
    headers.set("x-user-role", decoded.role || "");
    headers.set("x-user-email", decoded.email || "");

    return NextResponse.next({ request: { headers } });
  }

  if (pathname.startsWith("/dashboard")) {
    if (!nextAuthToken)
      return NextResponse.redirect(new URL("/auth?tab=login", request.url));
  }

  if (pathname.startsWith("/dashboard/user")) {
    if (!nextAuthToken)
      return NextResponse.redirect(new URL("/auth?tab=login", request.url));

    if (nextAuthToken.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (nextAuthToken.role === "DOCTOR") {
      return NextResponse.redirect(new URL("/doctor", request.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!nextAuthToken)
      return NextResponse.redirect(new URL("/auth?tab=login", request.url));

    const role = nextAuthToken.role;
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }
  }

  if (pathname.startsWith("/doctor")) {
    if (!nextAuthToken)
      return NextResponse.redirect(new URL("/auth?tab=login", request.url));

    if (nextAuthToken.role !== "DOCTOR") {
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }
  }

  if (pathname.startsWith("/auth")) {
    if (nextAuthToken) {
      if (nextAuthToken.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (nextAuthToken.role === "DOCTOR") {
        return NextResponse.redirect(new URL("/doctor", request.url));
      }
      return NextResponse.redirect(new URL("/user", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/protected/:path*",
    "/dashboard/:path*",
    "/dashboard/user/:path*",
    "/admin/:path*",
    "/doctor/:path*",
    "/auth/:path*",
  ],
};
