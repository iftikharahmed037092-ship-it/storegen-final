import {
  NextRequest,
  NextResponse
} from "next/server";

function normalizeHostname(
  hostname: string
) {
  return hostname
    .toLowerCase()
    .trim()
    .replace(/:\d+$/, "")
    .replace(/^www\./, "");
}

export function middleware(
  request: NextRequest
) {
  const hostname =
    normalizeHostname(
      request.headers.get("host") || ""
    );

  const masterDomain =
    normalizeHostname(
      process.env
        .NEXT_PUBLIC_MASTER_DOMAIN || ""
    );

  const pathname =
    request.nextUrl.pathname;

  /*
   * Local development
   */
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  ) {
    return NextResponse.next();
  }

  /*
   * Master domain
   */
  if (
    masterDomain &&
    (
      hostname === masterDomain ||
      hostname === `www.${masterDomain}`
    )
  ) {
    return NextResponse.next();
  }

  /*
   * Static files and APIs
   */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  /*
   * Admin routes always belong
   * to the master application.
   */
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  ) {
    return NextResponse.next();
  }

  /*
   * Custom domain routing
   */
  if (masterDomain) {
    const url =
      request.nextUrl.clone();

    url.pathname =
      `/__custom_domain${pathname}`;

    url.searchParams.set(
      "__domain",
      hostname
    );

    return NextResponse.rewrite(
      url
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ]
};
