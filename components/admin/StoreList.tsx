"use client";

import Link from "next/link";
import type { Store } from "@/types/store";

interface Props {
  stores: Store[];
}

export default function StoreList({
  stores
}: Props) {
  if (stores.length === 0) {
    return (
      <div
        style={{
          padding: "30px",
          textAlign: "center",
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e5e7eb"
        }}
      >
        <h3>No stores yet</h3>

        <p>
          Create your first client store using the
          form above.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "18px"
      }}
    >
      {stores.map((store) => (
        <div
          key={store.id}
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid #e5e7eb"
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: store.primary_color,
              marginBottom: "14px"
            }}
          />

          <h3>{store.store_name}</h3>

          <p>
            <strong>Slug:</strong> /{store.slug}
          </p>

          {store.custom_domain && (
            <p>
              <strong>Domain:</strong>{" "}
              {store.custom_domain}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "18px"
            }}
          >
            <Link
              href={`/editor/${store.slug}`}
              style={buttonStyle}
            >
              Open Editor
            </Link>

            <Link
              href={`/s/${store.slug}`}
              style={{
                ...buttonStyle,
                background: "#111827"
              }}
            >
              Live Store
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

const buttonStyle = {
  padding: "10px 14px",
  borderRadius: "8px",
  background: "#16a34a",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: "14px"
};
