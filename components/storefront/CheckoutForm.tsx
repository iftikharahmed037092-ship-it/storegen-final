"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";

interface CheckoutFormProps {
  storeId: string;
  storeSlug: string;
  primaryColor: string;
}

export default function CheckoutForm({
  storeId,
  storeSlug,
  primaryColor
}: CheckoutFormProps) {
  const router = useRouter();

  const {
    items,
    totalPrice,
    clearCart
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitOrder(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          storeId,

          customer: {
            name: customerName.trim(),
            phone: customerPhone.trim(),
            address: customerAddress.trim(),
            city: customerCity.trim()
          },

          paymentMethod: "cod",

          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to place order."
        );
      }

      clearCart();

      router.push(
        `/s/${storeSlug}/order-success?id=${data.orderId}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          maxWidth: 700,
          margin: "40px auto",
          padding: 20,
          textAlign: "center"
        }}
      >
        <h2>Your cart is empty.</h2>
      </div>
    );
  }

  return (
    <form
      onSubmit={submitOrder}
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "30px 20px"
      }}
    >
      <h1>Checkout</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 25,
          marginTop: 20
        }}
      >
        <section
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 20
          }}
        >
          <h2>Customer Information</h2>

          <label style={labelStyle}>
            Full Name
          </label>

          <input
            required
            value={customerName}
            onChange={(e) =>
              setCustomerName(e.target.value)
            }
            placeholder="Your full name"
            style={inputStyle}
          />

          <label style={labelStyle}>
            Phone Number
          </label>

          <input
            required
            type="tel"
            value={customerPhone}
            onChange={(e) =>
              setCustomerPhone(e.target.value)
            }
            placeholder="03XXXXXXXXX"
            style={inputStyle}
          />

          <label style={labelStyle}>
            Complete Address
          </label>

          <textarea
            required
            value={customerAddress}
            onChange={(e) =>
              setCustomerAddress(e.target.value)
            }
            placeholder="House, street, area..."
            rows={4}
            style={{
              ...inputStyle,
              resize: "vertical"
            }}
          />

          <label style={labelStyle}>
            City
          </label>

          <input
            required
            value={customerCity}
            onChange={(e) =>
              setCustomerCity(e.target.value)
            }
            placeholder="City"
            style={inputStyle}
          />
        </section>

        <section
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 20
          }}
        >
          <h2>Order Summary</h2>

          {items.map((item) => (
            <div
              key={item.product.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                padding: "12px 0",
                borderBottom:
                  "1px solid #f3f4f6"
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>
                  {item.product.name}
                </div>

                <div
                  style={{
                    color: "#6b7280",
                    fontSize: 13
                  }}
                >
                  Qty: {item.quantity}
                </div>
              </div>

              <strong>
                Rs.{" "}
                {(
                  item.product.price *
                  item.quantity
                ).toLocaleString()}
              </strong>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
              fontSize: 20,
              fontWeight: 800
            }}
          >
            <span>Total</span>

            <span>
              Rs. {totalPrice.toLocaleString()}
            </span>
          </div>

          <div
            style={{
              marginTop: 20,
              padding: 14,
              borderRadius: 10,
              background: "#f0fdf4",
              border: "1px solid #bbf7d0"
            }}
          >
            <strong>Payment Method</strong>

            <div style={{ marginTop: 6 }}>
              Cash on Delivery
            </div>
          </div>

          {error && (
            <div
              style={{
                marginTop: 15,
                padding: 12,
                borderRadius: 8,
                background: "#fef2f2",
                color: "#b91c1c"
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
              marginTop: 20,
              padding: "15px 20px",
              border: "none",
              borderRadius: 10,
              background: primaryColor,
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading
              ? "Placing Order..."
              : "Place COD Order"}
          </button>
        </section>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginTop: 16,
  marginBottom: 6,
  fontWeight: 700
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 13px",
  borderRadius: 9,
  border: "1px solid #d1d5db",
  outline: "none",
  background: "#fff"
};
