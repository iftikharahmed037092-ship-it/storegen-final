import { NextRequest, NextResponse } from "next/server";

function normalizeHostname(hostname: string) {
  return hostname.toLowerCase().trim().replace(/:\d+$/, "").replace(/^www\./, "");
}

export function middleware(request: NextRequest) {
  const hostname = normalizeHostname(request.headers.get("host") || "");
  const masterDomain = normalizeHostname(process.env.NEXT_PUBLIC_MASTER_DOMAIN || "");
  const pathname = request.nextUrl.pathname;

  // 1. Local development - Allow
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".localhost")) {
    return NextResponse.next();
  }

  // 2. Vercel domains - IMPORTANT FIX: Allow all vercel.app domains
  if (hostname.includes("vercel.app") || hostname.includes("vercel.com")) {
    return NextResponse.next();
  }

  // 3. Master domain - Allow
  if (masterDomain && (hostname === masterDomain || hostname === `www.${masterDomain}` || hostname.endsWith(`.${masterDomain}`))) {
    return NextResponse.next();
  }

  // 4. Static files and APIs - Allow
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 5. Admin routes - Always master
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.next();
  }

  // 6. Custom domain routing - Only if NOT master and NOT vercel
  const url = request.nextUrl.clone();
  url.pathname = `/__custom_domain${pathname}`;
  url.searchParams.set("__domain", hostname);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
