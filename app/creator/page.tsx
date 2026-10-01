import Link from "next/link";

import {
  getAuthenticatedCreator
} from "@/lib/creator-auth";

import {
  supabaseAdmin
} from "@/lib/supabase-admin";

export const dynamic =
  "force-dynamic";

export default async function CreatorDashboard() {
  const creator =
    await getAuthenticatedCreator();

  if (!creator) {
    return null;
  }

  const {
    data: relations
  } =
    await supabaseAdmin
      .from("creator_stores")
      .select(
        "store_id, created_at"
      )
      .eq(
        "creator_id",
        creator.id
      )
      .order("created_at", {
        ascending: false
      });

  const storeIds =
    (relations ?? []).map(
      (item) =>
        item.store_id
    );

  let stores: any[] = [];

  if (storeIds.length) {
    const {
      data
    } =
      await supabaseAdmin
        .from("stores")
        .select(
          "id, slug, store_name, is_active, created_at"
        )
        .in(
          "id",
          storeIds
        );

    stores =
      data ?? [];
  }

  let orders: any[] = [];

  if (storeIds.length) {
    const {
      data
    } =
      await supabaseAdmin
        .from("orders")
        .select(
          "id, store_id, customer_name, total, status, created_at, order_channel"
        )
        .in(
          "store_id",
          storeIds
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );

    orders =
      data ?? [];
  }

  const totalRevenue =
    orders.reduce(
      (sum, order) =>
        sum +
        (
          String(
            order.status
          ).toLowerCase() ===
          "cancelled"
            ? 0
            : Number(
                order.total
              ) || 0
        ),
      0
    );

  const pending =
    orders.filter(
      (order) =>
        order.status ===
        "pending"
    ).length;

  return (
    <div>
      <div>
        <h1
          style={{
            marginBottom: 5
          }}
        >
          Welcome,{" "}
          {creator.full_name ||
            "Creator"}
        </h1>

        <p
          style={{
            color:
              "#6b7280"
          }}
        >
          یہاں سے آپ اپنی client websites
          create اور manage کریں گے۔
        </p>
      </div>

      {/* Stats */}

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(200px,1fr))",
          gap: 14,
          marginTop: 25
        }}
      >
        <Stat
          title="My Websites"
          value={
            stores.length
          }
        />

        <Stat
          title="Total Orders"
          value={
            orders.length
          }
        />

        <Stat
          title="Pending Orders"
          value={
            pending
          }
        />

        <Stat
          title="Revenue"
          value={`Rs. ${totalRevenue.toLocaleString(
            "en-PK"
          )}`}
        />
      </div>

      {/* Create */}

      <section
        style={{
          marginTop: 22,
          background:
            "#16a34a",
          color: "#fff",
          padding: 25,
          borderRadius: 18
        }}
      >
        <h2
          style={{
            marginTop: 0
          }}
        >
          Build a New Client Website
        </h2>

        <p>
          Client کے business کی information
          دیں اور website generate کریں۔
        </p>

        <Link
          href="/creator/create"
          style={{
            display:
              "inline-block",
            marginTop: 8,
            padding:
              "11px 16px",
            borderRadius: 9,
            background:
              "#fff",
            color:
              "#166534",
            textDecoration:
              "none",
            fontWeight: 900
          }}
        >
          + Create Website
        </Link>
      </section>

      {/* Stores */}

      <section
        style={{
          marginTop: 22,
          background:
            "#fff",
          border:
            "1px solid #e5e7eb",
          borderRadius: 18,
          padding: 22
        }}
      >
        <h2>
          My Client Websites
        </h2>

        {stores.length === 0 ? (
          <p
            style={{
              color:
                "#6b7280"
            }}
          >
            ابھی کوئی website نہیں بنائی گئی۔
          </p>
        ) : (
          <div
            style={{
              display:
                "grid",
              gap: 12
            }}
          >
            {stores.map(
              (store) => (
                <div
                  key={
                    store.id
                  }
                  style={{
                    border:
                      "1px solid #e5e7eb",
                    borderRadius:
                      13,
                    padding: 16,
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
                  <div>
                    <strong>
                      {
                        store.store_name
                      }
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
                      /s/
                      {
                        store.slug
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      display:
                        "flex",
                      gap: 8,
                      flexWrap:
                        "wrap"
                    }}
                  >
                    <Link
                      href={`/editor/${store.slug}`}
                      style={
                        actionStyle
                      }
                    >
                      Editor
                    </Link>

                    <Link
                      href={`/s/${store.slug}`}
                      target="_blank"
                      style={
                        actionStyle
                      }
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

function Stat({
  title,
  value
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        background:
          "#fff",
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
          fontSize: 13,
          fontWeight:
            700
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 28,
          fontWeight:
            950
        }}
      >
        {value}
      </div>
    </div>
  );
}

const actionStyle: React.CSSProperties =
  {
    display:
      "inline-block",
    padding:
      "8px 12px",
    borderRadius:
      8,
    background:
      "#111827",
    color:
      "#fff",
    textDecoration:
      "none",
    fontSize: 12,
    fontWeight:
      800
  };
