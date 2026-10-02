"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function CreateStorePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!name) return alert("Store name likho");
    setLoading(true);
    const { data: { user } } = await supabaseBrowser.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const { data, error } = await supabaseBrowser
      .from("stores")
      .insert({ name, owner_id: user.id })
      .select()
      .single();
    
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      router.push(`/creator`);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h1 style={{ fontSize: 22, fontWeight: 900 }}>Create New Website</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Store Name"
        style={{ width: "100%", padding: 12, marginTop: 20, borderRadius: 8, border: "1px solid #ccc" }}
      />
      <button
        onClick={handleCreate}
        disabled={loading}
        style={{ marginTop: 15, width: "100%", padding: 12, background: "#111827", color: "#fff", borderRadius: 8, fontWeight: 800 }}
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  );
}
