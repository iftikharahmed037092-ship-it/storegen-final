"use client";

import { useRouter } from "next/navigation";
import {
  supabaseBrowser,
} from "@/lib/supabase-browser";

export default function LogoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await supabaseBrowser.auth.signOut();

        router.replace("/login");
        router.refresh();
      }}
      style={{
        border: 0,
        borderRadius: 8,
        padding: "8px 12px",
        background: "#dc2626",
        color: "#fff",
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}
