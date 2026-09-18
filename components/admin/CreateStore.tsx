"use client";

import { FormEvent, useState } from "react";
import { createStore } from "@/lib/stores";

interface Props {
  onCreated: () => void;
}

export default function CreateStore({
  onCreated
}: Props) {
  const [storeName, setStoreName] = useState("");
  const [slug, setSlug] = useState("");
  const [domain, setDomain] = useState("");
  const [color, setColor] = useState("#000000");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleNameChange(value: string) {
    setStoreName(value);

    if (!slug) {
      setSlug(createSlug(value));
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!storeName.trim()) {
      setError("Store name is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Store slug is required.");
      return;
    }

    setLoading(true);

    try {
      await createStore({
        store_name: storeName.trim(),
        slug: createSlug(slug),
        custom_domain: domain.trim() || undefined,
        primary_color: color
      });

      setStoreName("");
      setSlug("");
      setDomain("");
      setColor("#000000");

      onCreated();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create store."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #e5e7eb"
      }}
    >
      <h2>Create New Store</h2>

      <div style={{ display: "grid", gap: "14px" }}>
        <div>
          <label>Store Name</label>

          <input
            value={storeName}
            onChange={(e) =>
              handleNameChange(e.target.value)
            }
            placeholder="Ali Mobiles"
            style={inputStyle}
          />
        </div>

        <div>
          <label>Store Slug</label>

          <input
            value={slug}
            onChange={(e) =>
              setSlug(createSlug(e.target.value))
            }
            placeholder="ali-mobiles"
            style={inputStyle}
          />
        </div>

        <div>
          <label>Custom Domain</label>

          <input
            value={domain}
            onChange={(e) =>
              setDomain(e.target.value)
            }
            placeholder="alimobileshop.com"
            style={inputStyle}
          />
        </div>

        <div>
          <label>Primary Color</label>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center"
            }}
          >
            <input
              type="color"
              value={color}
              onChange={(e) =>
                setColor(e.target.value)
              }
              style={{
                width: "55px",
                height: "42px",
                padding: 0
              }}
            />

            <span>{color}</span>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: "12px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "8px"
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "13px",
            border: 0,
            borderRadius: "10px",
            background: "#16a34a",
            color: "#ffffff",
            fontWeight: 700
          }}
        >
          {loading ? "Creating..." : "Create Store"}
        </button>
      </div>
    </form>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: "7px",
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "9px",
  outline: "none"
};
