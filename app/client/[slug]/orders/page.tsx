import Link from "next/link";
import { notFound } from "next/navigation";

import { getStoreBySlug } from "@/lib/stores";
import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic =
  "force-dynamic";

export default async function ClientOrdersPage({
  params
}: Props) {

  const { slug } = await params;

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
    <main
      style={{
        minHeight:
          "100vh",
        background:
          "#f5f7f6",
        padding:
          "25px 20px 50px"
      }}
    >

      <div
        style={{
          maxWidth:
            1100,
          margin:
            "0 auto"
        }}
      >

        <Link
          href={`/client/${store.slug}`}
          style={{
            color:
              store.primary_color ||
              "#16a34a",
            fontWeight:
              700
          }}
        >
          ← Dashboard
        </Link>

        <h1>
          {store.store_name}
          {" "}— Orders
        </h1>

        <p
          style={{
            color:
              "#6b7280"
          }}
        >
          All customer orders
          for your store.
        </p>


        {!orders ||
        orders.length ===
          0 ? (
          <div
            style={{
              marginTop:
                25,
              background:
                "#ffffff",
              border:
                "1px solid #e5e7eb",
              borderRadius:
                14,
              padding: 35,
              textAlign:
                "center"
            }}
          >
            No orders yet.
          </div>
        ) : (
          <div
            style={{
              marginTop:
                25,
              display:
                "grid",
              gap: 12
            }}
          >

            {orders.map(
              (order) => (
                <Link
                  key={
                    order.id
                  }
                  href={`/client/${store.slug}/orders/${order.id}`}
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "1fr auto auto",
                    gap: 20,
                    alignItems:
                      "center",
                    background:
                      "#ffffff",
                    border:
                      "1px solid #e5e7eb",
                    borderRadius:
                      14,
                    padding:
                      18
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
                        marginTop:
                          6,
                        color:
                          "#6b7280"
                      }}
                    >
                      {
                        order.customer_name
                      }
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
                      {Number(
                        order.total ||
                          0
                      ).toLocaleString()}
                    </strong>

                    <div
                      style={{
                        marginTop:
                          5,
                        color:
                          "#6b7280",
                        fontSize:
                          13
                      }}
                    >
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </div>
                  </div>


                  <span
                    style={{
                      padding:
                        "7px 12px",
                      borderRadius:
                        20,
                      background:
                        "#f3f4f6",
                      fontWeight:
                        800,
                      textTransform:
                        "capitalize"
                    }}
                  >
                    {
                      order.status
                    }
                  </span>

                </Link>
              )
            )}

          </div>
        )}

      </div>

    </main>
  );
}
