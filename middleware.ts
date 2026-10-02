import { NextRequest, NextResponse } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase-middleware";

function normalizeHostname(hostname: string) {
  return hostname.toLowerCase().trim().replace(/:\d+$/, "").replace(/^www\./, "");
}

export async function middleware(request: NextRequest) {
  const authResponse = await updateSupabaseSession(request);

  const hostname = normalizeHostname(request.headers.get("host") || "");
  const masterDomain = normalizeHostname(process.env.NEXT_PUBLIC_MASTER_DOMAIN || "");
  const pathname = request.nextUrl.pathname;

  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".localhost")) {
    return authResponse;
  }

  if (hostname.includes("vercel.app") || hostname.includes("vercel.com")) {
    return authResponse;
  }

  if (masterDomain && (hostname === masterDomain || hostname === `www.${masterDomain}` || hostname.endsWith(`.${masterDomain}`))) {
    return authResponse;
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".") ||
    pathname.startsWith("/__custom_domain")
  ) {
    return authResponse;
  }

  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/creator" ||
    pathname.startsWith("/creator/") ||
    pathname === "/dashboard-creator" ||
    pathname.startsWith("/dashboard-creator/") ||
    pathname.startsWith("/auth")
  ) {
    return authResponse;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/__custom_domain${pathname}`;
  url.searchParams.set("__domain", hostname);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
