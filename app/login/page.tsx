"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    event: FormEvent
  ) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    const {
      error: loginError
    } =
      await supabaseBrowser.auth.signInWithPassword(
        {
          email: email.trim(),
          password
        }
      );

    if (loginError) {
      setError(
        loginError.message
      );
      setLoading(false);
      return;
    }

    const response =
      await fetch(
        "/api/auth/role",
        {
          cache: "no-store"
        }
      );

    const result =
      await response.json();

    if (result.role === "master_admin") {
      router.replace("/admin");
      router.refresh();
      return;
    }

    if (result.role === "creator") {
      router.replace("/creator");
      router.refresh();
      return;
    }

    await supabaseBrowser.auth.signOut();

    setError(
      "This account does not have access to this platform."
    );

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg,#f0fdf4,#f8fafc)",
        padding: 20
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          maxWidth: 430,
          background: "#fff",
          padding: 30,
          borderRadius: 20,
          border:
            "1px solid #e5e7eb",
          boxShadow:
            "0 20px 50px rgba(0,0,0,.08)"
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 950,
            color: "#111827"
          }}
        >
          Store Platform
        </div>

        <p
          style={{
            color: "#6b7280",
            marginTop: 8
          }}
        >
          Secure account login
        </p>

        <label
          style={{
            display: "block",
            marginTop: 24,
            fontWeight: 800
          }}
        >
          Email

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            style={inputStyle}
          />
        </label>

        <label
          style={{
            display: "block",
            marginTop: 16,
            fontWeight: 800
          }}
        >
          Password

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            required
            style={inputStyle}
          />
        </label>

        {error && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 10,
              background: "#fef2f2",
              color: "#b91c1c",
              fontSize: 14,
              fontWeight: 700
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 22,
            padding: 14,
            border: 0,
            borderRadius: 10,
            background:
              loading
                ? "#9ca3af"
                : "#16a34a",
            color: "#fff",
            fontWeight: 900,
            fontSize: 15,
            cursor:
              loading
                ? "not-allowed"
                : "pointer"
          }}
        >
          {loading
            ? "Signing in..."
            : "Login"}
        </button>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 46,
  marginTop: 7,
  padding: "0 12px",
  border:
    "1px solid #d1d5db",
  borderRadius: 9,
  outline: "none"
};
