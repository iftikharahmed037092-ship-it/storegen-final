"use client";

import Link from "next/link";

import {
  useCart
} from "./CartProvider";

export default function CartButton({
  storeSlug
}: {
  storeSlug: string;
}) {
  const {
    totalItems
  } = useCart();

  return (
    <Link
      href={`/s/${storeSlug}/cart`}
      style={{
        position: "relative",
        padding:
          "10px 12px",
        border:
          "1px solid #d1d5db",
        borderRadius: 10,
        background:
          "#ffffff",
        fontWeight: 700
      }}
    >
      🛒 Cart

      {totalItems > 0 && (
        <span
          style={{
            position:
              "absolute",
            top: -7,
            right: -7,
            minWidth: 21,
            height: 21,
            padding:
              "0 5px",
            display: "grid",
            placeItems:
              "center",
            borderRadius:
              "999px",
            background:
              "#dc2626",
            color:
              "#ffffff",
            fontSize: 11
          }}
        >
          {totalItems}
        </span>
      )}
    </Link>
  );
}
