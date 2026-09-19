"use client";

import type {
  Product
} from "@/types/product";

import ProductCard
  from "./ProductCard";

import {
  useCart
} from "./CartProvider";

export default function ProductGrid({
  products,
  storeSlug
}: {
  products: Product[];
  storeSlug: string;
}) {
  const {
    addToCart
  } = useCart();

  if (!products.length) {
    return (
      <div
        style={{
          padding: 50,
          textAlign:
            "center",
          color:
            "#6b7280"
        }}
      >
        No products found.
      </div>
    );
  }

  return (
    <div
      style={{
        display:
          "grid",
        gridTemplateColumns:
          "repeat(auto-fill, minmax(210px, 1fr))",
        gap: 18
      }}
    >
      {products.map(
        product => (
          <ProductCard
            key={
              product.id
            }
            product={
              product
            }
            storeSlug={
              storeSlug
            }
            onAddToCart={
              addToCart
            }
          />
        )
      )}
    </div>
  );
}
