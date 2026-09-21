import Link from "next/link";

import type {
  AdminAnalytics as AdminAnalyticsData
} from "@/lib/admin-analytics";


interface AdminAnalyticsProps {
  data: AdminAnalyticsData;
}


export default function AdminAnalytics({
  data
}: AdminAnalyticsProps) {

  return (
    <div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 15
        }}
      >

        <StatCard
          title="Total Orders"
          value={data.totalOrders}
        />

        <StatCard
          title="Total Revenue"
          value={`Rs. ${data.totalRevenue.toLocaleString()}`}
        />

        <StatCard
          title="Delivered Revenue"
          value={`Rs. ${data.deliveredRevenue.toLocaleString()}`}
        />

        <StatCard
          title="Pending Revenue"
          value={`Rs. ${data.pendingRevenue.toLocaleString()}`}
        />

        <StatCard
          title="Delivered Orders"
          value={data.deliveredOrders}
        />

        <StatCard
          title="Pending Orders"
          value={data.pendingOrders}
        />

        <StatCard
          title="Cancelled Orders"
          value={data.cancelledOrders}
        />

      </div>


      <section
        style={{
          marginTop: 30,
          background: "#fff",
          border:
            "1px solid #e5e7eb",
          borderRadius: 14,
          overflow: "hidden"
        }}
      >

        <div
          style={{
            padding: 20,
            borderBottom:
              "1px solid #e5e7eb"
          }}
        >
          <h2
            style={{
              margin: 0
            }}
          >
            Store Performance
          </h2>

          <p
            style={{
              marginBottom: 0,
              color: "#6b7280"
            }}
          >
            Revenue and order performance
            for every client store.
          </p>
        </div>


        {data.stores.length === 0 ? (

          <div
            style={{
              padding: 30,
              textAlign: "center",
              color: "#6b7280"
            }}
          >
            No stores found.
          </div>

        ) : (

          <div
            style={{
              overflowX: "auto"
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                minWidth: 700
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
                    Store
                  </th>

                  <th
                    style={thStyle}
                  >
                    Orders
                  </th>

                  <th
                    style={thStyle}
                  >
                    Delivered
                  </th>

                  <th
                    style={thStyle}
                  >
                    Pending
                  </th>

                  <th
                    style={thStyle}
                  >
                    Revenue
                  </th>

                  <th
                    style={thStyle}
                  >
                    Action
                  </th>

                </tr>
              </thead>


              <tbody>

                {data.stores.map(
                  (store) => (

                    <tr
                      key={
                        store.storeId
                      }
                    >

                      <td
                        style={tdStyle}
                      >
                        <strong>
                          {
                            store.storeName
                          }
                        </strong>

                        <div
                          style={{
                            fontSize: 12,
                            color:
                              "#6b7280",
                            marginTop: 3
                          }}
                        >
                          /{store.slug}
                        </div>
                      </td>


                      <td
                        style={tdStyle}
                      >
                        {store.orders}
                      </td>


                      <td
                        style={tdStyle}
                      >
                        {store.deliveredOrders}
                      </td>


                      <td
                        style={tdStyle}
                      >
                        {store.pendingOrders}
                      </td>


                      <td
                        style={tdStyle}
                      >
                        <strong>
                          Rs.{" "}
                          {store.revenue.toLocaleString()}
                        </strong>
                      </td>


                      <td
                        style={tdStyle}
                      >

                        <Link
                          href={`/admin/stores/${store.slug}/orders`}
                          style={{
                            display:
                              "inline-block",
                            padding:
                              "7px 11px",
                            borderRadius: 7,
                            background:
                              "#111827",
                            color:
                              "#fff",
                            fontSize: 13,
                            fontWeight:
                              700
                          }}
                        >
                          Orders
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

    </div>
  );
}


function StatCard({
  title,
  value
}: {
  title: string;
  value: string | number;
}) {

  return (
    <div
      style={{
        background: "#fff",
        border:
          "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 20
      }}
    >

      <div
        style={{
          color: "#6b7280",
          fontSize: 14,
          fontWeight: 700
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 25,
          fontWeight: 900
        }}
      >
        {value}
      </div>

    </div>
  );
}


const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "13px 15px",
  fontSize: 13,
  color: "#374151",
  borderBottom:
    "1px solid #e5e7eb"
};


const tdStyle: React.CSSProperties = {
  padding: "14px 15px",
  borderBottom:
    "1px solid #f3f4f6",
  fontSize: 14
};
