"use client";

import type { OrderStatus } from "@/types/order";

interface OrderStatusTrackerProps {
  status: OrderStatus;
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
  }
];

export default function OrderStatusTracker({
  status
}: OrderStatusTrackerProps) {

  if (status === "cancelled") {
    return (
      <div
        style={{
          marginTop: 20,
          padding: 15,
          borderRadius: 10,
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#b91c1c",
          fontWeight: 800,
          textAlign: "center"
        }}
      >
        Order Cancelled
      </div>
    );
  }

  const currentIndex =
    statuses.findIndex(
      (item) => item.value === status
    );

  return (
    <div
      style={{
        marginTop: 25,
        overflowX: "auto",
        paddingBottom: 5
      }}
    >
      <div
        style={{
          minWidth: 650,
          display: "grid",
          gridTemplateColumns:
            `repeat(${statuses.length}, 1fr)`
        }}
      >

        {statuses.map(
          (item, index) => {

            const completed =
              index <= currentIndex;

            return (
              <div
                key={item.value}
                style={{
                  position: "relative",
                  textAlign: "center"
                }}
              >

                {index > 0 && (
                  <div
                    style={{
                      position:
                        "absolute",
                      top: 16,
                      right: "50%",
                      width: "100%",
                      height: 3,
                      background:
                        index <= currentIndex
                          ? "#16a34a"
                          : "#e5e7eb",
                      zIndex: 0
                    }}
                  />
                )}

                <div
                  style={{
                    position:
                      "relative",
                    zIndex: 1,
                    width: 34,
                    height: 34,
                    margin: "0 auto",
                    borderRadius:
                      "50%",
                    display: "grid",
                    placeItems:
                      "center",
                    background:
                      completed
                        ? "#16a34a"
                        : "#e5e7eb",
                    color:
                      completed
                        ? "#fff"
                        : "#6b7280",
                    fontWeight: 900
                  }}
                >
                  {completed
                    ? "✓"
                    : index + 1}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    fontWeight:
                      completed
                        ? 800
                        : 500
                  }}
                >
                  {item.label}
                </div>

              </div>
            );
          }
        )}

      </div>
    </div>
  );
}
