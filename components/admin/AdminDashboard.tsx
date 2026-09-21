import Link from "next/link";

import type {
  AdminDashboardData
} from "@/lib/admin-dashboard";


interface AdminDashboardProps {
  data: AdminDashboardData;
}


export default function AdminDashboard({
  data
}: AdminDashboardProps) {

  return (
    <div
      style={{
        display: "grid",
        gap: 25
      }}
    >

      {/* Quick Actions */}

      <section>

        <h2>
          Quick Actions
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 12
          }}
        >

          <QuickAction
            href="/admin/stores"
            title="Manage Stores"
            description="Create and manage client stores"
          />

          <QuickAction
            href="/admin/orders"
            title="Manage Orders"
            description="View all customer orders"
          />

          <QuickAction
            href="/admin/products"
            title="Manage Products"
            description="View products across stores"
          />

          <QuickAction
            href="/admin/customers"
            title="Customers"
            description="View customer activity"
          />

          <QuickAction
            href="/admin/analytics"
            title="Analytics"
            description="View sales and store performance"
          />

        </div>

      </section>


      {/* Recent Orders */}

      <section
        style={sectionStyle}
      >

        <div
          style={sectionHeaderStyle}
        >

          <div>
            <h2
              style={{
                margin: 0
              }}
            >
              Recent Orders
            </h2>

            <p
              style={{
                margin:
                  "5px 0 0",
                color:
                  "#6b7280"
              }}
            >
              Latest customer orders
            </p>
          </div>

          <Link
            href="/admin/orders"
            style={viewAllStyle}
          >
            View All
          </Link>

        </div>


        {data.recentOrders.length === 0 ? (

          <EmptyState
            text="No orders yet."
          />

        ) : (

          <div
            style={{
              overflowX:
                "auto"
            }}
          >

            <table
              style={{
                width: "100%",
                minWidth: 750,
                borderCollapse:
                  "collapse"
              }}
            >

              <thead>

                <tr
                  style={{
                    background:
                      "#f9fafb"
                  }}
                >

                  <th
                    style={thStyle}
                  >
                    Order
                  </th>

                  <th
                    style={thStyle}
                  >
                    Store
                  </th>

                  <th
                    style={thStyle}
                  >
                    Customer
                  </th>

                  <th
                    style={thStyle}
                  >
                    Total
                  </th>

                  <th
                    style={thStyle}
                  >
                    Status
                  </th>

                  <th
                    style={thStyle}
                  >
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {data.recentOrders.map(
                  (order) => (

                    <tr
                      key={order.id}
                    >

                      <td
                        style={tdStyle}
                      >
                        #
                        {order.id.slice(
                          0,
                          8
                        )}
                      </td>


                      <td
                        style={tdStyle}
                      >
                        <strong>
                          {
                            order.store_name
                          }
                        </strong>

                        <div
                          style={{
                            fontSize: 12,
                            color:
                              "#6b7280"
                          }}
                        >
                          /{order.store_slug}
                        </div>
                      </td>


                      <td
                        style={tdStyle}
                      >
                        <strong>
                          {
                            order.customer_name
                          }
                        </strong>

                        <div
                          style={{
                            fontSize: 12,
                            color:
                              "#6b7280"
                          }}
                        >
                          {
                            order.customer_phone
                          }
                        </div>
                      </td>


                      <td
                        style={tdStyle}
                      >
                        <strong>
                          Rs.{" "}
                          {order.total.toLocaleString()}
                        </strong>
                      </td>


                      <td
                        style={tdStyle}
                      >
                        <StatusBadge
                          status={
                            order.status
                          }
                        />
                      </td>


                      <td
                        style={tdStyle}
                      >

                        <Link
                          href={`/admin/stores/${order.store_slug}/orders/${order.id}`}
                          style={manageButtonStyle}
                        >
                          Manage
                        </Link>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* Recent Stores */}

      <section
        style={sectionStyle}
      >

        <div
          style={sectionHeaderStyle}
        >

          <div>
            <h2
              style={{
                margin: 0
              }}
            >
              Recent Stores
            </h2>

            <p
              style={{
                margin:
                  "5px 0 0",
                color:
                  "#6b7280"
              }}
            >
              Recently created client websites
            </p>
          </div>

          <Link
            href="/admin/stores"
            style={viewAllStyle}
          >
            View All
          </Link>

        </div>


        {data.recentStores.length === 0 ? (

          <EmptyState
            text="No stores created yet."
          />

        ) : (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
              padding: 20
            }}
          >

            {data.recentStores.map(
              (store) => (

                <div
                  key={store.id}
                  style={{
                    border:
                      "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: 16
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      gap: 10
                    }}
                  >

                    <div>

                      <strong>
                        {
                          store.store_name
                        }
                      </strong>

                      <div
                        style={{
                          marginTop: 5,
                          color:
                            "#6b7280",
                          fontSize: 13
                        }}
                      >
                        /{store.slug}
                      </div>

                    </div>


                    <span
                      style={{
                        height:
                          "fit-content",
                        padding:
                          "4px 8px",
                        borderRadius:
                          20,
                        background:
                          store.is_active
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          store.is_active
                            ? "#166534"
                            : "#991b1b",
                        fontSize: 12,
                        fontWeight: 800
                      }}
                    >
                      {store.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>


                  <div
                    style={{
                      marginTop: 15,
                      display:
                        "flex",
                      gap: 8
                    }}
                  >

                    <Link
                      href={`/admin/stores/${store.slug}`}
                      style={{
                        ...manageButtonStyle,
                        flex: 1,
                        textAlign:
                          "center"
                      }}
                    >
                      Manage
                    </Link>

                    <Link
                      href={`/s/${store.slug}`}
                      target="_blank"
                      style={{
                        ...secondaryButtonStyle,
                        flex: 1,
                        textAlign:
                          "center"
                      }}
                    >
                      Live Site
                    </Link>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}


function QuickAction({
  href,
  title,
  description
}: {
  href: string;
  title: string;
  description: string;
}) {

  return (
    <Link
      href={href}
      style={{
        background: "#fff",
        border:
          "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 18,
        display: "block"
      }}
    >

      <strong
        style={{
          fontSize: 16
        }}
      >
        {title}
      </strong>

      <div
        style={{
          marginTop: 7,
          color: "#6b7280",
          fontSize: 13,
          lineHeight: 1.5
        }}
      >
        {description}
      </div>

    </Link>
  );
}


function StatusBadge({
  status
}: {
  status: string;
}) {

  const isCancelled =
    status === "cancelled";

  const isDelivered =
    status === "delivered";

  return (
    <span
      style={{
        display:
          "inline-block",
        padding:
          "5px 9px",
        borderRadius:
          20,
        background:
          isCancelled
            ? "#fee2e2"
            : isDelivered
              ? "#dcfce7"
              : "#f3f4f6",
        color:
          isCancelled
            ? "#991b1b"
            : isDelivered
              ? "#166534"
              : "#374151",
        fontWeight: 700,
        fontSize: 12,
        textTransform:
          "capitalize"
      }}
    >
      {status}
    </span>
  );
}


function EmptyState({
  text
}: {
  text: string;
}) {

  return (
    <div
      style={{
        padding: 30,
        textAlign: "center",
        color: "#6b7280"
      }}
    >
      {text}
    </div>
  );
}


const sectionStyle: React.CSSProperties = {
  background: "#fff",
  border:
    "1px solid #e5e7eb",
  borderRadius: 14,
  overflow: "hidden"
};


const sectionHeaderStyle: React.CSSProperties = {
  padding: 20,
  borderBottom:
    "1px solid #e5e7eb",
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  gap: 15
};


const viewAllStyle: React.CSSProperties = {
  color: "#2563eb",
  fontWeight: 700,
  fontSize: 14
};


const thStyle: React.CSSProperties = {
  padding:
    "12px 15px",
  textAlign: "left",
  fontSize: 13,
  color: "#374151",
  borderBottom:
    "1px solid #e5e7eb"
};


const tdStyle: React.CSSProperties = {
  padding:
    "13px 15px",
  borderBottom:
    "1px solid #f3f4f6",
  fontSize: 14
};


const manageButtonStyle: React.CSSProperties = {
  display: "inline-block",
  padding:
    "7px 11px",
  borderRadius: 7,
  background: "#111827",
  color: "#fff",
  fontSize: 13,
  fontWeight: 700
};


const secondaryButtonStyle: React.CSSProperties = {
  display: "inline-block",
  padding:
    "7px 11px",
  borderRadius: 7,
  background: "#f3f4f6",
  color: "#111827",
  fontSize: 13,
  fontWeight: 700
};
