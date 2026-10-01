import Link from "next/link";
import { redirect } from "next/navigation";

import {
  getAuthenticatedCreator
} from "@/lib/creator-auth";

import LogoutButton
  from "@/components/auth/LogoutButton";

export const dynamic =
  "force-dynamic";

export default async function CreatorLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const creator =
    await getAuthenticatedCreator();

  if (!creator) {
    redirect(
      "/login?next=/creator"
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "#f3f4f6"
      }}
    >
      <header
        style={{
          background:
            "#111827",
          color: "#fff",
          padding:
            "14px 20px",
          position:
            "sticky",
          top: 0,
          zIndex: 50
        }}
      >
        <div
          style={{
            maxWidth: 1250,
            margin:
              "0 auto",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            gap: 15,
            flexWrap:
              "wrap"
          }}
        >
          <div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 950
              }}
            >
              Creator Dashboard
            </div>

            <div
              style={{
                fontSize: 12,
                color:
                  "#9ca3af"
              }}
            >
              {creator.email}
            </div>
          </div>

          <nav
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: 8,
              flexWrap:
                "wrap"
            }}
          >
            <Link
              href="/creator"
              style={
                navStyle
              }
            >
              Dashboard
            </Link>

            <Link
              href="/creator/create"
              style={
                navStyle
              }
            >
              + Create Website
            </Link>

            <LogoutButton />
          </nav>
        </div>
      </header>

      <main
        style={{
          maxWidth:
            1250,
          margin:
            "0 auto",
          padding:
            "25px 20px 60px"
        }}
      >
        {children}
      </main>
    </div>
  );
}

const navStyle: React.CSSProperties =
  {
    color: "#fff",
    textDecoration:
      "none",
    background:
      "#1f2937",
    padding:
      "8px 11px",
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 800
  };
