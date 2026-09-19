"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartProvider";

interface CartContentProps {
  storeSlug: string;
  primaryColor: string;
}

export default function CartContent({
  storeSlug,
  primaryColor
}: CartContentProps) {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  } = useCart();

  if (items.length === 0) {
    return (
      <main
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "40px 20px"
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 40,
            textAlign: "center",
            border: "1px solid #e5e7eb"
          }}
        >
          <h1>Your Cart</h1>

          <p style={{ color: "#6b7280" }}>
            Your shopping cart is empty.
          </p>

          <Link
            href={`/s/${storeSlug}/products`}
            style={{
              display: "inline-block",
              marginTop: 20,
              padding: "12px 20px",
              borderRadius: 10,
              background: primaryColor,
              color: "#fff",
              fontWeight: 700
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "30px 20px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 15,
          marginBottom: 20,
          flexWrap: "wrap"
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Your Cart</h1>

          <p
            style={{
              marginTop: 6,
              color: "#6b7280"
            }}
          >
            {totalItems} item(s)
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          style={{
            border: "1px solid #ef4444",
            background: "#fff",
            color: "#dc2626",
            padding: "10px 14px",
            borderRadius: 8,
            fontWeight: 700
          }}
        >
          Clear Cart
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gap: 15
        }}
      >
        {items.map((item) => {
          const image =
            item.product.image_url ||
            item.product.image_urls?.[0] ||
            null;

          const itemTotal =
            item.product.price * item.quantity;

          return (
            <div
              key={item.product.id}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 15,
                display: "flex",
                gap: 15,
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 10,
                  background: "#f3f4f6",
                  overflow: "hidden",
                  flexShrink: 0
                }}
              >
                {image ? (
                  <Image
                    src={image}
                    alt={item.product.name}
                    width={90}
                    height={90}
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
                      color: "#9ca3af",
                      fontSize: 12
                    }}
                  >
                    No Image
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 180 }}>
                <Link
                  href={`/s/${storeSlug}/product/${item.product.id}`}
                  style={{
                    fontWeight: 700,
                    fontSize: 17
                  }}
                >
                  {item.product.name}
                </Link>

                <div
                  style={{
                    marginTop: 6,
                    fontWeight: 700,
                    color: primaryColor
                  }}
                >
                  Rs. {item.product.price.toLocaleString()}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    color: "#6b7280",
                    fontSize: 13
                  }}
                >
                  Stock available: {item.product.stock}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(
                      item.product.id,
                      item.quantity - 1
                    )
                  }
                  style={quantityButton}
                >
                  −
                </button>

                <span
                  style={{
                    minWidth: 35,
                    textAlign: "center",
                    fontWeight: 700
                  }}
                >
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(
                      item.product.id,
                      item.quantity + 1
                    )
                  }
                  style={quantityButton}
                >
                  +
                </button>
              </div>

              <div
                style={{
                  minWidth: 110,
                  textAlign: "right",
                  fontWeight: 800
                }}
              >
                Rs. {itemTotal.toLocaleString()}
              </div>

              <button
                type="button"
                onClick={() =>
                  removeFromCart(item.product.id)
                }
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#dc2626",
                  fontWeight: 700
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 25,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 20
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            fontWeight: 800
          }}
        >
          <span>Total</span>

          <span>
            Rs. {totalPrice.toLocaleString()}
          </span>
        </div>

        <Link
          href={`/s/${storeSlug}/checkout`}
          style={{
            display: "block",
            textAlign: "center",
            marginTop: 18,
            padding: "14px 20px",
            borderRadius: 10,
            background: primaryColor,
            color: "#fff",
            fontWeight: 800
          }}
        >
          Proceed to Checkout
        </Link>
      </div>
    </main>
  );
}

const quantityButton: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  background: "#fff",
  fontSize: 20,
  fontWeight: 700
};
