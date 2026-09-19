import Link from "next/link";
import { notFound } from "next/navigation";

import { getStoreBySlug } from "@/lib/stores";
import { supabase } from "@/lib/supabase";

interface StoreOrdersPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StoreOrdersPage({
  params
}: StoreOrdersPageProps) {

  const { slug } =
    await params;

  const store =
    await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const {
    data: orders,
    error
  } = await supabase
    .from("orders")
    .select("*")
    .eq("store_id", store.id)
    .order("created_at", {
      ascending: false
    });

  if (error) {
    throw new Error(
      error.message
    );
  }

  return (
    <div>

      <Link
        href={`/admin/stores/${store.slug}`}
        style={{
          color: "#2563eb",
          fontWeight: 700
        }}
      >
        ← Back to Store
      </Link>

      <h1>
        {store.store_name} — Orders
      </h1>

      <p
        style={{
          color: "#6b7280"
        }}
      >
        Manage orders for this store.
      </p>

      {(!orders ||
        orders.length === 0) ? (
        <div
          style={{
            marginTop: 25,
            padding: 30,
            background: "#fff",
            borderRadius: 14,
            textAlign: "center"
          }}
        >
          No orders found.
        </div>
      ) : (
        <div
          style={{
            marginTop: 25,
            display: "grid",
            gap: 12
          }}
        >
          {orders.map(
            (order) => (
              <div
                key={order.id}
                style={{
                  background: "#fff",
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 18
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    gap: 15,
                    flexWrap:
                      "wrap"
                  }}
                >

                  <div>
                    <strong>
                      Order #
                      {order.id.slice(
                        0,
                        8
                      )}
                    </strong>

                    <div
                      style={{
                        marginTop: 6,
                        color:
                          "#6b7280"
                      }}
                    >
                      {order.customer_name}
                    </div>

                    <div
                      style={{
                        color:
                          "#6b7280"
                      }}
                    >
                      {
                        order.customer_phone
                      }
                    </div>
                  </div>

                  <div>
                    <strong>
                      Rs.{" "}
                      {order.total.toLocaleString()}
                    </strong>

                    <div
                      style={{
                        marginTop: 5,
                        fontSize: 13,
                        color:
                          "#6b7280"
                      }}
                    >
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </div>
                  </div>

                  <div
                    style={{
                      padding:
                        "7px 12px",
                      borderRadius: 20,
                      background:
                        "#f3f4f6",
                      fontWeight: 800,
                      textTransform:
                        "capitalize"
                    }}
                  >
                    {order.status}
                  </div>

                  <Link
                    href={`/admin/stores/${store.slug}/orders/${order.id}`}
                    style={{
                      padding:
                        "9px 14px",
                      borderRadius: 8,
                      background:
                        "#111827",
                      color: "#fff",
                      fontWeight: 700
                    }}
                  >
                    Manage Order
                  </Link>

                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
