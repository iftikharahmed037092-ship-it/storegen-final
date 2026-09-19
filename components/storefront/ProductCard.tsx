"use client";

import Link from "next/link";

import type {
  Product
} from "@/types/product";

interface ProductCardProps {
  product: Product;
  storeSlug: string;
  onAddToCart?: (
    product: Product
  ) => void;
}

export default function ProductCard({
  product,
  storeSlug,
  onAddToCart
}: ProductCardProps) {
  const image =
    product.image_url ||
    product.image_urls?.[0] ||
    "";

  const hasDiscount =
    product.old_price !== null &&
    product.old_price >
      product.price;

  return (
    <article
      style={{
        background: "#ffffff",
        border:
          "1px solid #e5e7eb",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Link
        href={`/s/${storeSlug}/product/${product.id}`}
      >
        <div
          style={{
            aspectRatio: "1 / 1",
            background: "#f3f4f6",
            overflow: "hidden"
          }}
        >
          {image ? (
            <img
              src={image}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
                color: "#9ca3af"
              }}
            >
              No Image
            </div>
          )}
        </div>
      </Link>

      <div
        style={{
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: 1
        }}
      >
        <Link
          href={`/s/${storeSlug}/product/${product.id}`}
          style={{
            fontWeight: 700,
            lineHeight: 1.4
          }}
        >
          {product.name}
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap"
          }}
        >
          <strong
            style={{
              fontSize: 18
            }}
          >
            Rs. {product.price.toLocaleString()}
          </strong>

          {hasDiscount && (
            <span
              style={{
                color: "#9ca3af",
                textDecoration:
                  "line-through",
                fontSize: 13
              }}
            >
              Rs.{" "}
              {product.old_price!.toLocaleString()}
            </span>
          )}
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: 8
          }}
        >
          <Link
            href={`/s/${storeSlug}/product/${product.id}`}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px 8px",
              border:
                "1px solid #d1d5db",
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 700
            }}
          >
            View
          </Link>

          {onAddToCart && (
            <button
              type="button"
              onClick={() =>
                onAddToCart(product)
              }
              disabled={
                product.stock <= 0
              }
              style={{
                flex: 1,
                padding:
                  "10px 8px",
                border: 0,
                borderRadius: 9,
                background:
                  product.stock > 0
                    ? "#16a34a"
                    : "#9ca3af",
                color: "#ffffff",
                fontWeight: 700,
                cursor:
                  product.stock > 0
                    ? "pointer"
                    : "not-allowed"
              }}
            >
              {product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
