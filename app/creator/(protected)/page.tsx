import Link from "next/link";

import {
  getAuthenticatedCreator,
} from "@/lib/creator-auth";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export const dynamic =
  "force-dynamic";

export default async function CreatorDashboard() {
  const creator =
    await getAuthenticatedCreator();

  if (!creator) return null;

  const { data: links } =
    await supabaseAdmin
      .from("creator_stores")
      .select(
        "store_id,created_at"
      )
      .eq(
        "creator_id",
        creator.id
      )
      .order(
        "created_at",
        { ascending: false }
      );

  const storeIds =
    (links || []).map(
      (x) => x.store_id
    );

  const { data: stores } =
    storeIds.length
      ? await supabaseAdmin
          .from("stores")
          .select(
            "id,store_name,slug,created_at,is_active"
          )
          .in(
            "id",
            storeIds
          )
      : {
          data: [] as any[],
        };

  const { data: orders } =
    storeIds.length
      ? await supabaseAdmin
          .from("orders")
          .select(
            "id,store_id,status,total,total_amount,created_at"
          )
          .in(
            "store_id",
            storeIds
          )
      : {
          data: [] as any[],
        };

  const totalSales =
    (orders || []).reduce(
      (sum, o) =>
        sum +
        Number(
          o.total_amount ??
            o.total ??
            0
        ),
      0
    );

  const pending =
    (orders || []).filter(
      (o) =>
        o.status === "pending"
    ).length;

  return (
    <div>
      <h1>
        Welcome,{" "}
        {creator.full_name}
      </h1>

      <p
        style={{
          color: "#6b7280",
        }}
      >
        {creator.email}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: 14,
          marginTop: 20,
        }}
      >
        <Stat
          title="Websites"
          value={
            stores?.length || 0
          }
        />

        <Stat
          title="Orders"
          value={
            orders?.length || 0
          }
        />

        <Stat
          title="Pending"
          value={pending}
        />

        <Stat
          title="Sales"
          value={`Rs ${totalSales.toLocaleString()}`}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginTop: 30,
          gap: 10,
        }}
      >
        <h2>
          Your Websites
        </h2>

        <Link
          href="/creator/create"
          style={button}
        >
          + Create Website
        </Link>
      </div>

      {(stores || []).map(
        (store) => {
          const storeOrders =
            (orders || []).filter(
              (o) =>
                o.store_id ===
                store.id
            );

          const sales =
            storeOrders.reduce(
              (sum, o) =>
                sum +
                Number(
                  o.total_amount ??
                    o.total ??
                    0
                ),
              0
            );

          return (
            <div
              key={store.id}
              style={card}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                  }}
                >
                  {store.store_name}
                </h3>

                <div
                  style={{
                    color:
                      "#6b7280",
                    marginTop: 4,
                  }}
                >
                  /{store.slug}
                </div>
              </div>

              <div
                style={{
                  fontSize: 14,
                }}
              >
                Orders:{" "}
                <b>
                  {storeOrders.length}
                </b>
                {" · "}
                Sales:{" "}
                <b>
                  Rs{" "}
                  {sales.toLocaleString()}
                </b>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap:
                    "wrap",
                }}
              >
                <Link
                  href={`/editor/${store.slug}`}
                  style={button}
                >
                  Editor
                </Link>

                <Link
                  href={`/s/${store.slug}`}
                  target="_blank"
                  style={secondary}
                >
                  Live Website
                </Link>
              </div>
            </div>
          );
        }
      )}

      {!stores?.length && (
        <div style={card}>
          <p>
            You have no
            websites yet.
          </p>

          <Link
            href="/creator/create"
            style={button}
          >
            Create Your First
            Website
          </Link>
        </div>
      )}
    </div>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div style={card}>
      <div
        style={{
          color: "#6b7280",
          fontSize: 13,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 25,
          fontWeight: 900,
          marginTop: 5,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  background: "#fff",
  border:
    "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 18,
  marginTop: 14,
};

const button: React.CSSProperties = {
  display: "inline-block",
  padding: "9px 13px",
  borderRadius: 8,
  background: "#16a34a",
  color: "#fff",
  fontWeight: 800,
};

const secondary: React.CSSProperties = {
  display: "inline-block",
  padding: "9px 13px",
  borderRadius: 8,
  background: "#e5e7eb",
  color: "#111827",
  fontWeight: 800,
};
