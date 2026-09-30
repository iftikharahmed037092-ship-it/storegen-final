"use client";

import { FormEvent, useState } from "react";
import type { Product } from "@/types/product";

interface Props {
  product: Product;
  storeId: string;
  storeSlug: string;
  primaryColor: string;
  onClose: () => void;
}

export default function WhatsAppOrderForm({
  product,
  storeId,
  storeSlug,
  primaryColor,
  onClose
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] =
    useState("");
  const [city, setCity] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function submit(
    event: FormEvent
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            storeId,

            customer: {
              name: name.trim(),
              phone: phone.trim(),
              address: address.trim(),
              city: city.trim()
            },

            paymentMethod: "cod",

            channel: "whatsapp",

            items: [
              {
                productId:
                  product.id,
                quantity: 1
              }
            ]
          })
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to create WhatsApp order."
        );
      }

      if (!data.whatsappUrl) {
        throw new Error(
          "WhatsApp link was not created."
        );
      }

      window.location.href =
        data.whatsappUrl;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background:
          "rgba(0,0,0,.55)",
        display: "grid",
        placeItems: "center",
        padding: 16
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 520,
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: 18,
          padding: 22,
          boxShadow:
            "0 25px 60px rgba(0,0,0,.25)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            gap: 15,
            alignItems:
              "center"
          }}
        >
          <div>
            <h2
              style={{
                margin: 0
              }}
            >
              WhatsApp Order
            </h2>

            <p
              style={{
                margin:
                  "5px 0 0",
                color:
                  "#6b7280"
              }}
            >
              {product.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: 0,
              background:
                "#f3f4f6",
              width: 38,
              height: 38,
              borderRadius:
                "50%",
              fontSize: 20
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            marginTop: 18,
            padding: 14,
            borderRadius: 12,
            background:
              "#f0fdf4",
            border:
              "1px solid #bbf7d0"
          }}
        >
          <strong>
            Rs.{" "}
            {product.price.toLocaleString()}
          </strong>

          <div
            style={{
              fontSize: 13,
              color:
                "#6b7280",
              marginTop: 3
            }}
          >
            Quantity: 1
          </div>
        </div>

        <label style={labelStyle}>
          Full Name
        </label>

        <input
          required
          value={name}
          onChange={(e) =>
            setName(e.target.value)
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
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
          placeholder="03XXXXXXXXX"
          style={inputStyle}
        />

        <label style={labelStyle}>
          Complete Address
        </label>

        <textarea
          required
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
          placeholder="House, street, area..."
          rows={3}
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
          value={city}
          onChange={(e) =>
            setCity(e.target.value)
          }
          placeholder="City"
          style={inputStyle}
        />

        {error && (
          <div
            style={{
              marginTop: 15,
              padding: 12,
              borderRadius: 9,
              background:
                "#fef2f2",
              color:
                "#b91c1c"
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
            marginTop: 18,
            padding:
              "14px 18px",
            border: 0,
            borderRadius: 10,
            background:
              "#25D366",
            color: "#fff",
            fontWeight: 800,
            fontSize: 16,
            cursor:
              loading
                ? "wait"
                : "pointer",
            opacity:
              loading
                ? 0.7
                : 1
          }}
        >
          {loading
            ? "Preparing WhatsApp Order..."
            : "💬 Send Order on WhatsApp"}
        </button>

        <p
          style={{
            margin:
              "12px 0 0",
            textAlign:
              "center",
            fontSize: 12,
            color:
              "#6b7280"
          }}
        >
          Order پہلے website میں محفوظ ہوگا،
          پھر WhatsApp کھلے گا۔
        </p>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginTop: 15,
  marginBottom: 6,
  fontWeight: 700
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 13px",
  borderRadius: 9,
  border:
    "1px solid #d1d5db",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box"
};
