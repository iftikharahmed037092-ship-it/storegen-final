"use client";

import { useState } from "react";

interface DomainHealthProps {
  storeId: string;
  domain: string | null;
}

export default function DomainHealth({
  storeId,
  domain
}: DomainHealthProps) {
  const [checking, setChecking] =
    useState(false);

  const [result, setResult] =
    useState<{
      dnsResolved: boolean;
      message: string;
      addresses: string[];
    } | null>(null);

  const [error, setError] =
    useState("");

  async function checkHealth() {
    setError("");
    setResult(null);
    setChecking(true);

    try {
      const response = await fetch(
        "/api/domains/health",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            storeId
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Domain health check failed."
        );
      }

      setResult(data.health);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Domain health check failed."
      );
    } finally {
      setChecking(false);
    }
  }

  if (!domain) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: 16,
        padding: 16,
        borderRadius: 14,
        background: "#ffffff",
        border:
          "1px solid #e5e7eb"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap"
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              color: "#111827"
            }}
          >
            DNS Health
          </h3>

          <p
            style={{
              margin:
                "5px 0 0",
              fontSize: 12,
              color: "#6b7280"
            }}
          >
            Check whether{" "}
            {domain} currently
            resolves in DNS.
          </p>
        </div>

        <button
          type="button"
          onClick={checkHealth}
          disabled={checking}
          style={{
            border: "none",
            borderRadius: 9,
            padding:
              "10px 14px",
            background:
              checking
                ? "#9ca3af"
                : "#111827",
            color: "#ffffff",
            fontWeight: 800,
            cursor: checking
              ? "not-allowed"
              : "pointer"
          }}
        >
          {checking
            ? "Checking..."
            : "Check DNS"}
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 10,
            background:
              result.dnsResolved
                ? "#dcfce7"
                : "#fef3c7",
            color:
              result.dnsResolved
                ? "#166534"
                : "#92400e",
            fontSize: 13,
            fontWeight: 700,
            lineHeight: 1.6
          }}
        >
          <div>
            {result.dnsResolved
              ? "✓ DNS is resolving."
              : "⚠ DNS is not resolving yet."}
          </div>

          <div
            style={{
              marginTop: 4
            }}
          >
            {result.message}
          </div>

          {result.addresses.length >
            0 && (
            <div
              style={{
                marginTop: 7,
                fontSize: 12
              }}
            >
              Resolved addresses:{" "}
              {result.addresses.join(
                ", "
              )}
            </div>
          )}
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
    </div>
  );
}
