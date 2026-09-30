import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function AdminOrdersPage() {
  const { data: orders, error } = await supabase
   .from("orders")
   .select(`
      id,
      store_id,
      customer_name,
      customer_phone,
      customer_city,
      payment_method,
      status,
      total,
      created_at,
      order_channel,
      stores (
        store_name,
        slug
      )
    `)
   .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div>
      <h1>All Orders</h1>

      <p
        style={{
          color: "#6b7280",
        }}
      >
        Orders from all client stores.
      </p>

      <div
        style={{
          marginTop: 25,
          display: "grid",
          gap: 12,
        }}
      >
        {(orders?? []).map((order: any) => {
          const store = Array.isArray(order.stores)
           ? order.stores[0]
            : order.stores;

          return (
            <div
              key={order.id}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 15,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>Order #{order.id.slice(0, 8)}</strong>

                  <div
                    style={{
                      marginTop: 6,
                      color: "#6b7280",
                    }}
                  >
                    Store: {store?.store_name?? "Unknown"}
                  </div>

                  <div
                    style={{
                      display: "inline-block",
                      marginTop: 6,
                      padding: "4px 8px",
                      borderRadius: 999,
                      background:
                        order.order_channel === "whatsapp"
                         ? "#dcfce7"
                          : "#dbeafe",
                      color:
                        order.order_channel === "whatsapp"
                         ? "#15803d"
                          : "#1d4ed8",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {order.order_channel === "whatsapp"
                     ? "💬 WhatsApp"
                      : "🌐 Website"}
                  </div>
                </div>

                <div>
                  <strong>{order.customer_name}</strong>

                  <div
                    style={{
                      marginTop: 4,
                      color: "#6b7280",
                    }}
                  >
                    {order.customer_phone}
                  </div>
                </div>

                <div>
                  <strong>Rs. {order.total.toLocaleString()}</strong>

                  <div
                    style={{
                      marginTop: 5,
                      fontSize: 13,
                    }}
                  >
                    COD
                  </div>
                </div>

                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 20,
                    background: "#f3f4f6",
                    fontWeight: 700,
                    textTransform: "capitalize",
                  }}
                >
                  {order.status}
                </div>

                {store?.slug && (
                  <Link
                    href={`/s/${store.slug}/order/${order.id}`}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "#111827",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    View
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
