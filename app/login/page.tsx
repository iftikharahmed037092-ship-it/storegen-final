"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

function LoginContent() {
  const searchParams =
    useSearchParams();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function submit(
    e: FormEvent
  ) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const loginResponse =
        await fetch(
          "/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials:
              "include",
            cache: "no-store",
            body: JSON.stringify({
              email:
                email
                  .trim()
                  .toLowerCase(),
              password,
            }),
          }
        );

      const loginData =
        await loginResponse
          .json()
          .catch(
            () => ({})
          );

      if (
        !loginResponse.ok
      ) {
        setError(
          loginData.error ||
            "Login failed."
        );

        setLoading(false);
        return;
      }

      /*
       * Ask the server which role the
       * newly authenticated session has.
       */
      const roleResponse =
        await fetch(
          "/api/auth/role",
          {
            method: "GET",
            credentials:
              "include",
            cache: "no-store",
          }
        );

      const role =
        await roleResponse
          .json()
          .catch(
            () => ({})
          );

      if (
        !roleResponse.ok ||
        !role.authenticated
      ) {
        setError(
          "Login succeeded, but the session was not available. Please try again."
        );

        setLoading(false);
        return;
      }

      const next =
        searchParams.get(
          "next"
        );

      /*
       * Only allow internal StoreGen paths.
       * This prevents an external redirect.
       */
      const safeNext =
        next &&
        next.startsWith("/") &&
        !next.startsWith("//")
          ? next
          : null;

      if (
        role.role ===
        "master_admin"
      ) {
        window.location.replace(
          safeNext ||
            "/admin"
        );

        return;
      }

      if (
        role.role ===
        "creator"
      ) {
        window.location.replace(
          safeNext ||
            "/creator"
        );

        return;
      }

      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
          credentials:
            "include",
        }
      );

      setError(
        "This account is not authorized for the Store Platform."
      );

      setLoading(false);
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );

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
        background:
          "#f0fdf4",
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
          boxShadow:
            "0 10px 35px rgba(0,0,0,.08)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 24,
          }}
        >
          Store Platform
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: 6,
          }}
        >
          Secure account login
        </p>

        <label
          style={{
            display: "block",
            marginTop: 18,
            fontWeight: 700,
          }}
        >
          Email
        </label>

        <input
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          type="email"
          autoComplete="email"
          required
          style={inputStyle}
        />

        <label
          style={{
            display: "block",
            marginTop: 14,
            fontWeight: 700,
          }}
        >
          Password
        </label>

        <input
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          type="password"
          autoComplete="current-password"
          required
          style={inputStyle}
        />

        {error && (
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background:
                "#fef2f2",
              color: "#b91c1c",
              fontSize: 14,
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
            marginTop: 18,
            height: 44,
            border: 0,
            borderRadius: 8,
            background:
              "#16a34a",
            color: "#fff",
            fontWeight: 800,
            opacity: loading
              ? 0.7
              : 1,
          }}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight:
              "100vh",
            display: "grid",
            placeItems:
              "center",
          }}
        >
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

const inputStyle: React.CSSProperties =
  {
    width: "100%",
    height: 44,
    marginTop: 6,
    padding: "0 12px",
    border:
      "1px solid #d1d5db",
    borderRadius: 8,
    boxSizing:
      "border-box",
  };
