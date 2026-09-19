"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

interface OrderLookupProps {
  storeSlug: string;
}

interface OrderResult {
  id: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  total: number;
  created_at: string;
}

export default function OrderLookup({
  storeSlug
}: OrderLookupProps) {

  const [phone, setPhone] =
    useState("");

  const [orders, setOrders] =
    useState<OrderResult[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  async function searchOrders(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setLoading(true);
    setError("");
    setOrders([]);


    try {

      const response =
        await fetch(
          `/api/orders/lookup?storeSlug=${encodeURIComponent(
            storeSlug
          )}&phone=${encodeURIComponent(
            phone.trim()
          )}`
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data?.error ||
          "Unable to find orders."
        );
      }


      setOrders(
        data.orders ?? []
      );

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to find orders."
      );

    } finally {

      setLoading(false);

    }
  }


  return (
    <section
      style={{
        maxWidth: 800,
        margin: "30px auto",
        padding: "0 20px"
      }}
    >

      <div
        style={{
          background: "#fff",
          border:
            "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 20
        }}
      >

        <h1>
          Track Your Orders
        </h1>

        <p
          style={{
            color: "#6b7280"
          }}
        >
          Enter the phone number used
          when placing your order.
        </p>


        <form
          onSubmit={searchOrders}
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap"
          }}
        >

          <input
            required
            type="tel"
            value={phone}
            onChange={(event) =>
              setPhone(
                event.target.value
              )
            }
            placeholder="03XXXXXXXXX"
            style={{
              flex: 1,
              minWidth: 220,
              padding:
                "12px 14px",
              border:
                "1px solid #d1d5db",
              borderRadius: 9
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding:
                "12px 20px",
              border: "none",
              borderRadius: 9,
              background:
                "#111827",
              color: "#fff",
              fontWeight: 800
            }}
          >
            {loading
              ? "Searching..."
              : "Find Orders"}
          </button>

        </form>


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


        {orders.length > 0 && (
          <div
            style={{
              marginTop: 20,
              display: "grid",
              gap: 12
            }}
          >

            {orders.map(
              (order) => (

                <Link
                  key={order.id}
                  href={`/s/${storeSlug}/order/${order.id}`}
                  style={{
                    display:
                      "block",
                    padding: 16,
                    border:
                      "1px solid #e5e7eb",
                    borderRadius: 10,
                    background:
                      "#fafafa"
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      gap: 15,
                      flexWrap:
                        "wrap"
                    }}
                  >

                    <strong>
                      Order #
                      {order.id.slice(
                        0,
                        8
                      )}
                    </strong>

                    <strong>
                      Rs.{" "}
                      {order.total.toLocaleString()}
                    </strong>

                  </div>


                  <div
                    style={{
                      marginTop: 8,
                      color:
                        "#6b7280",
                      fontSize: 13
                    }}
                  >
                    {new Date(
                      order.created_at
                    ).toLocaleString()}
                  </div>


                  <div
                    style={{
                      marginTop: 8,
                      fontWeight: 700
                    }}
                  >
                    Status:{" "}
                    {order.status}
                  </div>

                </Link>

              )
            )}

          </div>
        )}


        {!loading &&
          !error &&
          orders.length === 0 &&
          phone && (
            <p
              style={{
                marginTop: 20,
                color: "#6b7280"
              }}
            >
              No orders found for this
              phone number.
            </p>
          )}

      </div>

    </section>
  );
}
