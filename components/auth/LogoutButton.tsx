"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await supabaseBrowser.auth.signOut();

    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      style={{
        padding:
          "8px 12px",
        border: 0,
        borderRadius: 8,
        background: "#dc2626",
        color: "#fff",
        fontWeight: 800,
        cursor: "pointer"
      }}
    >
      Logout
    </button>
  );
}
