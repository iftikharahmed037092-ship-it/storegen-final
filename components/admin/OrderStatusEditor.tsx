"use client";

import {
  useState
} from "react";

import type {
  OrderStatus
} from "@/types/order";

interface OrderStatusEditorProps {
  orderId: string;
  initialStatus: OrderStatus;
}

const statuses: {
  value: OrderStatus;
  label: string;
}[] = [
  {
    value: "pending",
    label: "Pending"
  },
  {
    value: "confirmed",
    label: "Confirmed"
  },
  {
    value: "processing",
    label: "Processing"
  },
  {
    value: "shipped",
    label: "Shipped"
  },
  {
    value: "delivered",
    label: "Delivered"
  },
  {
    value: "cancelled",
    label: "Cancelled"
  }
];

export default function OrderStatusEditor({
  orderId,
  initialStatus
}: OrderStatusEditorProps) {

  const [status, setStatus] =
    useState<OrderStatus>(
      initialStatus
    );

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");


  async function updateStatus(
    newStatus: OrderStatus
  ) {
    setStatus(newStatus);
    setSaving(true);
    setMessage("");

    try {
      const response =
        await fetch(
          `/api/orders/${orderId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              status: newStatus
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
          "Unable to update status."
        );
      }

      setMessage(
        "Order status updated."
      );

    } catch (error) {
      setStatus(initialStatus);

      setMessage(
        error instanceof Error
          ? error.message
          : "Update failed."
      );

    } finally {
      setSaving(false);
    }
  }


  return (
    <div
      style={{
        marginTop: 20,
        padding: 20,
        background: "#fff",
        border:
          "1px solid #e5e7eb",
        borderRadius: 14
      }}
    >
      <h2>
        Update Order Status
      </h2>

      <select
        value={status}
        disabled={saving}
        onChange={(event) =>
          updateStatus(
            event.target
              .value as OrderStatus
          )
        }
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 12,
          border:
            "1px solid #d1d5db",
          borderRadius: 8,
          background: "#fff"
        }}
      >
        {statuses.map(
          (item) => (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          )
        )}
      </select>

      {saving && (
        <div
          style={{
            marginTop: 10,
            color: "#6b7280"
          }}
        >
          Saving...
        </div>
      )}

      {message && (
        <div
          style={{
            marginTop: 10,
            fontWeight: 700
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
