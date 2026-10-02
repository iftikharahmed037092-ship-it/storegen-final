import Link from "next/link";
import { redirect } from "next/navigation";

import {
  getAuthenticatedCreator,
} from "@/lib/creator-auth";

import LogoutButton from "@/components/auth/LogoutButton";

export const dynamic =
  "force-dynamic";

export default async function CreatorLayout({
  children,
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
        background: "#f3f4f6",
      }}
    >
      <header
        style={{
          background: "#111827",
          color: "#fff",
          padding: "14px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 15,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/creator"
            style={{
              fontSize: 20,
              fontWeight: 900,
            }}
          >
            Creator Dashboard
          </Link>

          <nav
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/creator"
              style={nav}
            >
              Dashboard
            </Link>

            <Link
              href="/creator/create"
              style={nav}
            >
              Create Website
            </Link>

            <LogoutButton />
          </nav>
        </div>
      </header>

      <main
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 20,
        }}
      >
        {children}
      </main>
    </div>
  );
}

const nav: React.CSSProperties = {
  padding: "8px 11px",
  borderRadius: 7,
  background: "#1f2937",
  fontSize: 14,
  fontWeight: 700,
};
