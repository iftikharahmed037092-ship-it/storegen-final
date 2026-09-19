import Link from "next/link";

import { supabase } from "@/lib/supabase";

export default async function AdminProductsPage() {

  const {
    data: products,
    error
  } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      stock,
      published,
      store_id,
      stores (
        store_name,
        slug
      )
    `)
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

      <h1>
        All Products
      </h1>

      <p
        style={{
          color: "#6b7280"
        }}
      >
        Products from all client stores.
      </p>


      <div
        style={{
          marginTop: 25,
          display: "grid",
          gap: 12
        }}
      >

        {(products ?? []).map(
          (product) => {

            const store =
              Array.isArray(
                product.stores
              )
                ? product.stores[0]
                : product.stores;


            return (
              <div
                key={product.id}
                style={{
                  background: "#fff",
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 18
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: 15,
                    flexWrap:
                      "wrap"
                  }}
                >

                  <div>

                    <h3
                      style={{
                        marginTop: 0
                      }}
                    >
                      {product.name}
                    </h3>

                    <div
                      style={{
                        color:
                          "#6b7280"
                      }}
                    >
                      Store:{" "}
                      {store?.store_name ??
                        "Unknown"}
                    </div>

                  </div>


                  <div>
                    <strong>
                      Rs.{" "}
                      {product.price.toLocaleString()}
                    </strong>

                    <div
                      style={{
                        marginTop: 5,
                        fontSize: 13
                      }}
                    >
                      Stock:{" "}
                      {product.stock}
                    </div>
                  </div>


                  <div
                    style={{
                      fontWeight: 700,
                      color:
                        product.published
                          ? "#16a34a"
                          : "#dc2626"
                    }}
                  >
                    {product.published
                      ? "Published"
                      : "Unpublished"}
                  </div>


                  {store?.slug && (
                    <Link
                      href={`/admin/stores/${store.slug}/products`}
                      style={{
                        padding:
                          "8px 12px",
                        borderRadius: 8,
                        background:
                          "#111827",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 13
                      }}
                    >
                      Manage Store
                    </Link>
                  )}

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}
