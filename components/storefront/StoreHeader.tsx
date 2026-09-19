"use client";

import Link from "next/link";
import {
  useState
} from "react";

import CartButton
  from "./CartButton";

interface Props {
  storeName: string;
  storeSlug: string;
  logoUrl?: string | null;
  primaryColor?: string;
}

export default function StoreHeader({
  storeName,
  storeSlug,
  logoUrl,
  primaryColor =
    "#16a34a"
}: Props) {
  const [search, setSearch] =
    useState("");

  function submitSearch(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const value =
      search.trim();

    if (!value) {
      return;
    }

    window.location.href =
      `/s/${storeSlug}/products?search=${encodeURIComponent(
        value
      )}`;
  }

  return (
    <header
      style={{
        position:
          "sticky",
        top: 0,
        zIndex: 50,
        background:
          "#ffffff",
        borderBottom:
          "1px solid #e5e7eb"
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin:
            "0 auto",
          padding:
            "12px 16px",
          display:
            "flex",
          alignItems:
            "center",
          gap: 14,
          flexWrap:
            "wrap"
        }}
      >
        <Link
          href={`/s/${storeSlug}`}
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap: 8,
            fontWeight: 800,
            fontSize: 18
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={storeName}
              style={{
                width: 38,
                height: 38,
                objectFit:
                  "contain",
                borderRadius: 8
              }}
            />
          ) : (
            <span
              style={{
                width: 38,
                height: 38,
                display:
                  "grid",
                placeItems:
                  "center",
                borderRadius: 9,
                background:
                  primaryColor,
                color:
                  "#ffffff"
              }}
            >
              {storeName
                .charAt(0)
                .toUpperCase()}
            </span>
          )}

          {storeName}
        </Link>

        <form
          onSubmit={
            submitSearch
          }
          style={{
            flex: 1,
            minWidth:
              220,
            display:
              "flex",
            gap: 8
          }}
        >
          <input
            value={search}
            onChange={e =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search products..."
            style={{
              flex: 1,
              padding:
                "10px 12px",
              border:
                "1px solid #d1d5db",
              borderRadius: 10
            }}
          />

          <button
            type="submit"
            style={{
              padding:
                "10px 14px",
              border: 0,
              borderRadius: 10,
              background:
                primaryColor,
              color:
                "#ffffff",
              fontWeight: 700
            }}
          >
            Search
          </button>
        </form>

        <CartButton
          storeSlug={
            storeSlug
          }
        />
      </div>
    </header>
  );
}
