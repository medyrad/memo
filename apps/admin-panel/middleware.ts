import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export async function middleware(request: NextRequest) {
  const isLogin = request.nextUrl.pathname === "/login";
  const session = request.cookies.get("sessionid")?.value;
  let isStaff = false;
  if (session) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/`, {
        cache: "no-store",
        headers: { Cookie: `sessionid=${session}` },
      });
      if (response.ok) isStaff = Boolean((await response.json()).is_staff);
    } catch {
      isStaff = false;
    }
  }
  if (!isLogin && !isStaff) return NextResponse.redirect(new URL("/login", request.url));
  if (isLogin && isStaff) return NextResponse.redirect(new URL("/dashboard", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
