import { redirect } from "next/navigation";
import { getAuthenticatedCreator } from "@/lib/creator-auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CreatorDashboardPage() {
  const creator = await getAuthenticatedCreator();
  if (!creator) {
    redirect("/login?next=/creator");
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 900 }}>My Stores</h1>
      <p style={{ marginTop: 8, color: "#374151" }}>Logged in as: {creator.email}</p>
      <Link 
        href="/creator/create" 
        style={{ 
          display: "inline-block", 
          marginTop: 20, 
          background: "#111827", 
          color: "#fff", 
          padding: "10px 14px", 
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: 700
        }}
      >
        + Create New Website
      </Link>
    </div>
  );
}
