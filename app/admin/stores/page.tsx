import Link from "next/link";

import { getStores } from "@/lib/stores";

export default async function AdminStoresPage() {
  const stores =
    await getStores();

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 15,
          flexWrap: "wrap"
        }}
      >
        <div>
          <h1>
            Stores
          </h1>

          <p
            style={{
              color: "#6b7280"
            }}
          >
            All client websites.
          </p>
        </div>

        <Link
          href="/admin"
          style={{
            padding: "10px 15px",
            background: "#111827",
            color: "#fff",
            borderRadius: 8,
            fontWeight: 700
          }}
        >
          Dashboard
        </Link>
      </div>

      {stores.length === 0 ? (
        <div
          style={{
            marginTop: 25,
            padding: 30,
            background: "#fff",
            borderRadius: 14,
            textAlign: "center"
          }}
        >
          No stores created yet.
        </div>
      ) : (
        <div
          style={{
            marginTop: 25,
            display: "grid",
            gap: 15
          }}
        >
          {stores.map((store) => (
            <div
              key={store.id}
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
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 15,
                  flexWrap: "wrap"
                }}
              >
                <div>
                  <h2
                    style={{
                      marginTop: 0
                    }}
                  >
                    {store.store_name}
                  </h2>

                  <div
                    style={{
                      color: "#6b7280"
                    }}
                  >
                    /{store.slug}
                  </div>

                  {store.custom_domain && (
                    <div
                      style={{
                        marginTop: 5,
                        fontSize: 13
                      }}
                    >
                      {store.custom_domain}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap"
                  }}
                >
                  <Link
                    href={`/editor/${store.slug}`}
                    style={buttonStyle}
                  >
                    Editor
                  </Link>

                  <Link
                    href={`/s/${store.slug}`}
                    style={{
                      ...buttonStyle,
                      background: "#16a34a"
                    }}
                  >
                    Live Site
                  </Link>

                  <Link
                    href={`/admin/stores/${store.slug}`}
                    style={{
                      ...buttonStyle,
                      background: "#2563eb"
                    }}
                  >
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: "9px 13px",
  borderRadius: 8,
  background: "#111827",
  color: "#fff",
  fontWeight: 700,
  fontSize: 14
};
