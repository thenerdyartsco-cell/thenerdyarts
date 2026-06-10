import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

// Admin pages that must stay reachable without a session.
const PUBLIC_ADMIN_PAGES = ["/admin/login", "/admin/reset"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminApi = pathname.startsWith("/api/admin");
  const isAuthApi = pathname.startsWith("/api/admin/auth");
  const isAdminPage = pathname.startsWith("/admin");
  const isPublicAdminPage = PUBLIC_ADMIN_PAGES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // Auth endpoints and the login/reset pages are always open.
  if (isAuthApi) return NextResponse.next();
  if (isAdminPage && isPublicAdminPage) return NextResponse.next();
  if (!isAdminApi && !isAdminPage) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (session) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
