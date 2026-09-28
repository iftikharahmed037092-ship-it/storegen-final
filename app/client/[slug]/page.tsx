import Link from "next/link";
import { notFound } from "next/navigation";

import { getStoreBySlug } from "@/lib/stores";
import { getProductsByStoreId } from "@/lib/products";
import { supabase } from "@/lib/supabase";

interface ClientDashboardProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function ClientDashboard({
  params
}: ClientDashboardProps) {

  const { slug } = await params;

  const store =
    await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const products =
    await getProductsByStoreId(
      store.id
    );

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

  const totalOrders =
    orders?.length || 0;

  const pendingOrders =
    orders?.filter(
      (order) =>
        order.status ===
        "pending"
    ).length || 0;

  const totalProducts =
    products.length;

  const totalSales =
    (orders || [])
      .filter(
        (order) =>
          order.status !==
          "cancelled"
      )
      .reduce(
        (
          total,
          order
        ) =>
          total +
          Number(
            order.total || 0
          ),
        0
      );

  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          "#f5f7f6"
      }}
    >

      {/* Header */}

      <header
        style={{
          background:
            "#ffffff",
          borderBottom:
            "1px solid #e5e7eb",
          padding:
            "16px 20px"
        }}
      >

        <div
          style={{
            maxWidth:
              1200,
            margin:
              "0 auto",
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: 15,
            flexWrap:
              "wrap"
          }}
        >

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: 12
            }}
          >

            {store.logo_url ? (
              <img
                src={
                  store.logo_url
                }
                alt={
                  store.store_name
                }
                style={{
                  width: 42,
                  height: 42,
                  borderRadius:
                    10,
                  objectFit:
                    "cover"
                }}
              />
            ) : (
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius:
                    10,
                  background:
                    store.primary_color ||
                    "#16a34a",
                  color:
                    "#ffffff",
                  display:
                    "grid",
                  placeItems:
                    "center",
                  fontWeight:
                    900
                }}
              >
                {store.store_name
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div>
              <strong
                style={{
                  fontSize: 18
                }}
              >
                {store.store_name}
              </strong>

              <div
                style={{
                  color:
                    "#6b7280",
                  fontSize: 13
                }}
              >
                Client Dashboard
              </div>
            </div>

          </div>

          <Link
            href={`/s/${store.slug}`}
            target="_blank"
            style={{
              padding:
                "10px 15px",
              borderRadius:
                9,
              background:
                store.primary_color ||
                "#16a34a",
              color:
                "#ffffff",
              fontWeight:
                700
            }}
          >
            View Store →
          </Link>

        </div>

      </header>


      {/* Main */}

      <div
        style={{
          maxWidth:
            1200,
          margin:
            "0 auto",
          padding:
            "25px 20px 50px"
        }}
      >

        <div
          style={{
            marginBottom:
              25
          }}
        >
          <h1
            style={{
              margin:
                "0 0 5px"
            }}
          >
            Dashboard
          </h1>

          <p
            style={{
              margin: 0,
              color:
                "#6b7280"
            }}
          >
            Manage your online
            store from here.
          </p>
        </div>


        {/* Statistics */}

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 15
          }}
        >

          <StatCard
            title="Total Orders"
            value={
              totalOrders
            }
            color="#2563eb"
          />

          <StatCard
            title="Pending Orders"
            value={
              pendingOrders
            }
            color="#d97706"
          />

          <StatCard
            title="Products"
            value={
              totalProducts
            }
            color="#16a34a"
          />

          <StatCard
            title="Sales"
            value={`Rs. ${totalSales.toLocaleString()}`}
            color="#7c3aed"
          />

        </div>


        {/* Main Actions */}

        <h2
          style={{
            marginTop:
              35,
            marginBottom:
              15
          }}
        >
          Manage Store
        </h2>

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 15
          }}
        >

          <DashboardCard
            title="Orders"
            description="View customer orders and update order status."
            href={`/client/${store.slug}/orders`}
          />

          <DashboardCard
            title="Products"
            description="Add, edit and manage products."
            href={`/client/${store.slug}/products`}
          />

          <DashboardCard
            title="Store Settings"
            description="Manage store name, logo, WhatsApp and shipping."
            href={`/client/${store.slug}/settings`}
          />

          <DashboardCard
            title="Store Editor"
            description="Open your private visual store editor."
            href={`/editor/${store.slug}`}
          />

          <DashboardCard
            title="Live Website"
            description="Open the public customer website."
            href={`/s/${store.slug}`}
            newTab
          />

        </div>


        {/* Recent Orders */}

        <section
          style={{
            marginTop:
              35,
            background:
              "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              14,
            padding: 20
          }}
        >

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: 10,
              marginBottom:
                15
            }}
          >

            <h2
              style={{
                margin: 0
              }}
            >
              Recent Orders
            </h2>

            <Link
              href={`/client/${store.slug}/orders`}
              style={{
                color:
                  store.primary_color ||
                  "#16a34a",
                fontWeight:
                  700
              }}
            >
              View All →
            </Link>

          </div>


          {!orders ||
          orders.length ===
            0 ? (
            <p
              style={{
                color:
                  "#6b7280"
              }}
            >
              No orders yet.
            </p>
          ) : (
            <div
              style={{
                display:
                  "grid",
                gap: 10
              }}
            >

              {orders
                .slice(
                  0,
                  5
                )
                .map(
                  (
                    order
                  ) => (
                    <Link
                      key={
                        order.id
                      }
                      href={`/client/${store.slug}/orders/${order.id}`}
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        gap: 15,
                        flexWrap:
                          "wrap",
                        padding:
                          14,
                        border:
                          "1px solid #e5e7eb",
                        borderRadius:
                          10
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
                            color:
                              "#6b7280",
                            fontSize:
                              13,
                            marginTop:
                              4
                          }}
                        >
                          {
                            order.customer_name
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
                            color:
                              "#6b7280",
                            fontSize:
                              13,
                            marginTop:
                              4,
                            textTransform:
                              "capitalize"
                          }}
                        >
                          {
                            order.status
                          }
                        </div>
                      </div>

                    </Link>
                  )
                )}

            </div>
          )}

        </section>

      </div>

    </main>
  );
}


/* -------------------------------- */
/* Components                       */
/* -------------------------------- */

function StatCard({
  title,
  value,
  color
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      style={{
        background:
          "#ffffff",
        border:
          "1px solid #e5e7eb",
        borderRadius:
          14,
        padding: 20
      }}
    >

      <div
        style={{
          color:
            "#6b7280",
          fontSize: 14
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 27,
          fontWeight: 900,
          color
        }}
      >
        {value}
      </div>

    </div>
  );
}


function DashboardCard({
  title,
  description,
  href,
  newTab
}: {
  title: string;
  description: string;
  href: string;
  newTab?: boolean;
}) {
  return (
    <Link
      href={href}
      target={
        newTab
          ? "_blank"
          : undefined
      }
      style={{
        display:
          "block",
        background:
          "#ffffff",
        border:
          "1px solid #e5e7eb",
        borderRadius:
          14,
        padding: 20
      }}
    >

      <h3
        style={{
          margin:
            "0 0 8px"
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin:
            "0 0 15px",
          color:
            "#6b7280",
          lineHeight:
            1.6
        }}
      >
        {description}
      </p>

      <strong>
        Open →
      </strong>

    </Link>
  );
}
