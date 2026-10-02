"use client";

import {
  FormEvent,
  useState,
  Suspense,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  supabaseBrowser,
} from "@/lib/supabase-browser";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabaseBrowser.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const roleResponse = await fetch("/api/auth/role", {
      cache: "no-store",
    });

    const role = await roleResponse.json();

    if (role.role === "master_admin") {
      router.replace("/admin");
    } else if (role.role === "creator") {
      router.replace(searchParams.get("next") || "/creator");
    } else {
      await supabaseBrowser.auth.signOut();
      setError("This account is not authorized for the Store Platform.");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 20,
        background: "#f0fdf4",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#fff",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 10px 35px rgba(0,0,0,.08)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24 }}>Store Platform</h1>
        <p style={{ color: "#6b7280", marginTop: 6 }}>Secure account login</p>

        <label style={{ display: "block", marginTop: 18, fontWeight: 700 }}>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={inputStyle} />

        <label style={{ display: "block", marginTop: 14, fontWeight: 700 }}>Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required style={inputStyle} />

        {error && (
          <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: "#fef2f2", color: "#b91c1c", fontSize: 14 }}>
            {error}
          </div>
        )}

        <button
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 18,
            height: 44,
            border: 0,
            borderRadius: 8,
            background: "#16a34a",
            color: "#fff",
            fontWeight: 800,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  marginTop: 6,
  padding: "0 12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  boxSizing: "border-box",
};
