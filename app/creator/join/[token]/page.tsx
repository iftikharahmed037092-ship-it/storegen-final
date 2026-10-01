"use client";

import {
  FormEvent,
  useState
} from "react";

import { useParams, useRouter } from "next/navigation";

import { supabaseBrowser } from "@/lib/supabase-browser";

export default function CreatorJoinPage() {
  const params =
    useParams<{
      token: string;
    }>();

  const router =
    useRouter();

  const token =
    params.token;

  const [
    name,
    setName
  ] = useState("");

  const [
    email,
    setEmail
  ] = useState("");

  const [
    password,
    setPassword
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");

  async function submit(
    event: FormEvent
  ) {
    event.preventDefault();

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    setLoading(true);
    setError("");

    const response =
      await fetch(
        "/api/creator/join",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            token,
            email,
            fullName: name,
            password
          })
        }
      );

    const result =
      await response.json();

    if (!response.ok) {
      setError(
        result.error ||
          "Unable to create creator account."
      );
      setLoading(false);
      return;
    }

    const {
      error: loginError
    } =
      await supabaseBrowser.auth.signInWithPassword(
        {
          email:
            email.trim().toLowerCase(),
          password
        }
      );

    if (loginError) {
      setError(
        "Account created. Please login manually."
      );

      router.replace(
        "/login"
      );

      return;
    }

    router.replace(
      "/creator"
    );

    router.refresh();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        padding: 20,
        background:
          "#f0fdf4"
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 450,
          background: "#fff",
          padding: 30,
          borderRadius: 18,
          border:
            "1px solid #e5e7eb",
          boxShadow:
            "0 20px 50px rgba(0,0,0,.08)"
        }}
      >
        <h1>
          Join Creator Team
        </h1>

        <p
          style={{
            color:
              "#6b7280"
          }}
        >
          آپ کو website building team میں
          شامل ہونے کی invitation ملی ہے۔
        </p>

        <Field
          label="Your Name"
          value={name}
          onChange={setName}
        />

        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
        />

        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
        />

        {error && (
          <div
            style={{
              marginTop: 15,
              padding: 12,
              borderRadius: 9,
              background:
                "#fef2f2",
              color:
                "#b91c1c",
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
            marginTop: 20,
            padding: 14,
            border: 0,
            borderRadius: 10,
            background:
              loading
                ? "#9ca3af"
                : "#16a34a",
            color: "#fff",
            fontWeight: 900
          }}
        >
          {loading
            ? "Creating Account..."
            : "Create Creator Account"}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
}) {
  return (
    <label
      style={{
        display: "block",
        marginTop: 16,
        fontWeight: 800
      }}
    >
      {label}

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        required
        style={{
          width: "100%",
          height: 44,
          marginTop: 6,
          padding:
            "0 12px",
          border:
            "1px solid #d1d5db",
          borderRadius: 8
        }}
      />
    </label>
  );
}
