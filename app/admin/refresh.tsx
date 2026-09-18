"use client";

import { useRouter } from "next/navigation";

export default function RefreshStores() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.refresh()}
      style={{
        marginTop: "12px",
        padding: "10px 15px",
        border: "1px solid #d1d5db",
        background: "#ffffff",
        borderRadius: "9px"
      }}
    >
      Refresh Store List
    </button>
  );
}
