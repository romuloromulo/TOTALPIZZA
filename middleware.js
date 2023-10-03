import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data } = await supabase.auth.getSession();

  if (
    data?.session &&
    req.nextUrl.pathname.startsWith(
      "/auth" || req.nextUrl.pathname.startsWith("/sign-up")
    )
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Must be a session to see these routes
  if (
    !data?.session &&
    (req.nextUrl.pathname.startsWith("/checkout") ||
      req.nextUrl.pathname.startsWith("/success") ||
      req.nextUrl.pathname.startsWith("/orders") ||
      req.nextUrl.pathname.startsWith("/address"))
  ) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};
