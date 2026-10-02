import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedCreator } from "@/lib/creator-auth";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function ProtectedCreatorLayout({ children }: { children: React.ReactNode }) {
  const creator = await getAuthenticatedCreator();
  if (!creator) {
    redirect("/login?next=/creator");
  }

  const supabase = await createClient();
  const { data: store } = await supabase.from("stores").select("id, name").eq("owner_id", creator.id).maybeSingle();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 240, background: "#111827", color: "#fff", padding: 20 }}>
        <h2 style={{ fontWeight: 900, marginBottom: 20 }}>Creator Panel</h2>
        <Link href="/creator" style={{ display: "block", marginBottom: 10, color: "#fff", textDecoration: "none" }}>Dashboard</Link>
        <Link href="/creator/create" style={{ display: "block", marginBottom: 10, color: "#fff", textDecoration: "none" }}>Create Store</Link>
        {store && <Link href={`/store/${store.id}`} style={{ display: "block", color: "#fff", textDecoration: "none" }}>View Store</Link>}
        <div style={{ marginTop: 30 }}>
          <Link href="/api/auth/logout" style={{ color: "#f87171", textDecoration: "none" }}>Logout</Link>
        </div>
      </aside>
      <main style={{ flex: 1, background: "#f9fafb" }}>{children}</main>
    </div>
  );
}
