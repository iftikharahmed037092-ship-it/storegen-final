"use client";

import { useState } from "react";

import {
  normalizeDomain
} from "@/lib/domains";

interface DomainManagerProps {
  store: {
    id: string;
    slug: string;
    custom_domain: string | null;
    domain_status:
      | "none"
      | "pending"
      | "verified"
      | "failed";
    domain_verified: boolean;
    domain_verified_at: string | null;
  };

  onUpdated?: () => void;
}

export default function DomainManager({
  store,
  onUpdated
}: DomainManagerProps) {
  const [domain, setDomain] =
    useState(
      store.custom_domain || ""
    );

  const [saving, setSaving] =
    useState(false);

  const [removing, setRemoving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function saveDomain() {
    setMessage("");
    setError("");

    const normalized =
      normalizeDomain(domain);

    if (!normalized) {
      setError(
        "Please enter a custom domain."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/stores/${store.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            custom_domain: normalized
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Could not save domain."
        );
      }

      setDomain(
        data.store?.custom_domain ||
          normalized
      );

      setMessage(
        "Domain saved. Verification is now pending."
      );

      onUpdated?.();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not save domain."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeDomain() {
    if (
      !window.confirm(
        "Remove this custom domain?"
      )
    ) {
      return;
    }

    setMessage("");
    setError("");
    setRemoving(true);

    try {
      const response = await fetch(
        `/api/stores/${store.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            custom_domain: null
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Could not remove domain."
        );
      }

      setDomain("");
      setMessage(
        "Custom domain removed."
      );

      onUpdated?.();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not remove domain."
      );
    } finally {
      setRemoving(false);
    }
  }

  const liveDomain =
    store.domain_verified &&
    store.custom_domain
      ? `https://${store.custom_domain}`
      : null;

  return (
    <section
      style={{
        marginTop: 24,
        padding: 22,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 16
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "flex-start",
          gap: 15,
          flexWrap: "wrap"
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              color: "#111827"
            }}
          >
            Custom Domain
          </h2>

          <p
            style={{
              margin:
                "6px 0 0",
              color: "#6b7280",
              fontSize: 13,
              lineHeight: 1.5
            }}
          >
            Connect this client website
            to its own domain.
          </p>
        </div>

        <DomainStatus
          status={store.domain_status}
        />
      </div>

      <div
        style={{
          marginTop: 18
        }}
      >
        <label
          style={{
            display: "block",
            marginBottom: 7,
            fontSize: 13,
            fontWeight: 800,
            color: "#374151"
          }}
        >
          Custom Domain
        </label>

        <input
          value={domain}
          onChange={(event) =>
            setDomain(
              event.target.value
            )
          }
          placeholder="example.com"
          type="text"
          style={{
            width: "100%",
            padding:
              "12px 13px",
            border:
              "1px solid #d1d5db",
            borderRadius: 10,
            outline: "none"
          }}
        />

        <p
          style={{
            margin:
              "7px 0 0",
            fontSize: 12,
            color: "#6b7280"
          }}
        >
          Enter the domain without
          http:// or https://
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 16
        }}
      >
        <button
          type="button"
          onClick={saveDomain}
          disabled={saving}
          style={{
            border: "none",
            borderRadius: 10,
            padding:
              "11px 17px",
            background: saving
              ? "#9ca3af"
              : "#16a34a",
            color: "#ffffff",
            fontWeight: 800,
            cursor: saving
              ? "not-allowed"
              : "pointer"
          }}
        >
          {saving
            ? "Saving..."
            : "Save Domain"}
        </button>

        {store.custom_domain && (
          <button
            type="button"
            onClick={removeDomain}
            disabled={removing}
            style={{
              border:
                "1px solid #fecaca",
              borderRadius: 10,
              padding:
                "11px 17px",
              background:
                "#fef2f2",
              color: "#b91c1c",
              fontWeight: 800,
              cursor: removing
                ? "not-allowed"
                : "pointer"
            }}
          >
            {removing
              ? "Removing..."
              : "Remove Domain"}
          </button>
        )}
      </div>

      {store.domain_status !==
        "verified" &&
        store.custom_domain && (
          <div
            style={{
              marginTop: 18,
              padding: 14,
              borderRadius: 12,
              background:
                "#f8fafc",
              border:
                "1px solid #e2e8f0"
            }}
          >
            <strong
              style={{
                display: "block",
                color: "#111827",
                fontSize: 14,
                marginBottom: 5
              }}
            >
              Next step
            </strong>

            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#64748b",
                lineHeight: 1.5
              }}
            >
              Add the required DNS
              verification record, then
              use the Verify Domain
              button in the verification
              section.
            </p>
          </div>
        )}

      {liveDomain && (
        <a
          href={liveDomain}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            marginTop: 16,
            padding:
              "11px 16px",
            borderRadius: 10,
            background:
              "#111827",
            color: "#ffffff",
            fontWeight: 800
          }}
        >
          Open Custom Domain ↗
        </a>
      )}

      {store.domain_verified_at && (
        <p
          style={{
            margin:
              "12px 0 0",
            color: "#6b7280",
            fontSize: 12
          }}
        >
          Verified on{" "}
          {new Date(
            store.domain_verified_at
          ).toLocaleString()}
        </p>
      )}

      {message && (
        <div
          style={{
            marginTop: 14,
            padding: 11,
            borderRadius: 10,
            background:
              "#dcfce7",
            color: "#166534",
            fontSize: 13,
            fontWeight: 700
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: 14,
            padding: 11,
            borderRadius: 10,
            background:
              "#fef2f2",
            color: "#991b1b",
            fontSize: 13,
            fontWeight: 700
          }}
        >
          {error}
        </div>
      )}
    </section>
  );
}

function DomainStatus({
  status
}: {
  status:
    | "none"
    | "pending"
    | "verified"
    | "failed";
}) {
  const config = {
    none: {
      label: "Not Configured",
      bg: "#f3f4f6",
      color: "#374151"
    },

    pending: {
      label: "Pending",
      bg: "#fef3c7",
      color: "#92400e"
    },

    verified: {
      label: "Verified ✓",
      bg: "#dcfce7",
      color: "#166534"
    },

    failed: {
      label: "Verification Failed",
      bg: "#fee2e2",
      color: "#991b1b"
    }
  }[status];

  return (
    <span
      style={{
        display: "inline-flex",
        padding:
          "6px 11px",
        borderRadius: 999,
        background:
          config.bg,
        color:
          config.color,
        fontSize: 12,
        fontWeight: 800
      }}
    >
      {config.label}
    </span>
  );
}
