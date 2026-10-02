"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  supabaseBrowser,
} from "@/lib/supabase-browser";

export default function CreatorJoinPage() {
  const params =
    useParams<{ token: string }>();

  const router = useRouter();

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirm, setConfirm] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function submit(
    e: FormEvent
  ) {
    e.preventDefault();

    setError("");

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirm) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    const response =
      await fetch(
        "/api/creator/join",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            token: params.token,
            fullName,
            email,
            password,
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      setError(
        data.error ||
          "Unable to create account."
      );

      setLoading(false);
      return;
    }

    const {
      error: signInError,
    } =
      await supabaseBrowser.auth.signInWithPassword(
        {
          email:
            email
              .trim()
              .toLowerCase(),
          password,
        }
      );

    if (signInError) {
      setError(
        "Account created, but automatic login failed. Please use the Login page."
      );

      setLoading(false);
      return;
    }

    router.replace("/creator");
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
          maxWidth: 430,
          background: "#fff",
          padding: 24,
          borderRadius: 16,
          boxShadow:
            "0 10px 35px rgba(0,0,0,.08)",
        }}
      >
        <h1
          style={{
            margin: 0,
          }}
        >
          Create Creator Account
        </h1>

        <p
          style={{
            color: "#6b7280",
          }}
        >
          You were invited to build
          websites on Store Platform.
        </p>

        <Field label="Full Name">
          <input
            required
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value
              )
            }
            style={inputStyle}
          />
        </Field>

        <Field label="Email">
          <input
            required
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            style={inputStyle}
          />
        </Field>

        <Field label="Password">
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            style={inputStyle}
          />
        </Field>

        <Field label="Confirm Password">
          <input
            required
            type="password"
            minLength={8}
            value={confirm}
            onChange={(e) =>
              setConfirm(
                e.target.value
              )
            }
            style={inputStyle}
          />
        </Field>

        {error && (
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: "#fef2f2",
              color: "#b91c1c",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <button
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 18,
            height: 46,
            border: 0,
            borderRadius: 8,
            background: "#16a34a",
            color: "#fff",
            fontWeight: 800,
          }}
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label
      style={{
        display: "block",
        marginTop: 14,
        fontWeight: 700,
      }}
    >
      {label}
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: 44,
  marginTop: 6,
  padding: "0 12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  boxSizing: "border-box",
};
