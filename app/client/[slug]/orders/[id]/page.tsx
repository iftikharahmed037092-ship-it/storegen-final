import Link from "next/link";
import { notFound } from "next/navigation";

import { getStoreBySlug } from "@/lib/stores";
import { getOrderWithItems } from "@/lib/orders";

import OrderStatusEditor from "@/components/admin/OrderStatusEditor";

interface Props {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

export const dynamic =
  "force-dynamic";

export default async function ClientOrderDetailPage({
  params
}: Props) {

  const {
    slug,
    id
  } = await params;

  const store =
    await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const result =
    await getOrderWithItems(id);

  if (
    !result ||
    result.order.store_id !==
      store.id
  ) {
    notFound();
  }

  const {
    order,
    items
  } = result;

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
            1000,
          margin:
            "0 auto"
        }}
      >

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
          ← Back to Orders
        </Link>


        <div
          style={{
            marginTop:
              15,
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

            <h1
              style={{
                margin:
                  "0 0 5px"
              }}
            >
              Order #
              {order.id.slice(
                0,
                8
              )}
            </h1>

            <p
              style={{
                margin: 0,
                color:
                  "#6b7280"
              }}
            >
              {new Date(
                order.created_at
              ).toLocaleString()}
            </p>

          </div>

          <Link
            href={`/s/${store.slug}/order/${order.id}`}
            target="_blank"
            style={{
              padding:
                "10px 14px",
              borderRadius:
                8,
              background:
                store.primary_color ||
                "#16a34a",
              color:
                "#ffffff",
              fontWeight:
                700
            }}
          >
            Customer View
          </Link>

        </div>


        <OrderStatusEditor
          orderId={
            order.id
          }
          initialStatus={
            order.status
          }
        />


        <div
          style={{
            marginTop:
              20,
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20
          }}
        >

          <section
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

            <h2>
              Customer
            </h2>

            <p>
              <strong>
                Name:
              </strong>{" "}
              {
                order.customer_name
              }
            </p>

            <p>
              <strong>
                Phone:
              </strong>{" "}
              {
                order.customer_phone
              }
            </p>

            <p>
              <strong>
                City:
              </strong>{" "}
              {
                order.customer_city
              }
            </p>

            <p>
              <strong>
                Address:
              </strong>{" "}
              {
                order.shipping_address
              }
            </p>

          </section>


          <section
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

            <h2>
              Payment
            </h2>

            <p>
              <strong>
                Method:
              </strong>{" "}
              Cash on Delivery
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}
              <span
                style={{
                  textTransform:
                    "capitalize"
                }}
              >
                {
                  order.status
                }
              </span>
            </p>

            <p>
              <strong>
                Total:
              </strong>{" "}
              Rs.{" "}
              {Number(
                order.total ||
                  0
              ).toLocaleString()}
            </p>

          </section>

        </div>


        <section
          style={{
            marginTop:
              20,
            background:
              "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              14,
            padding: 20
          }}
        >

          <h2>
            Order Items
          </h2>

          <div
            style={{
              display:
                "grid",
              gap: 12
            }}
          >

            {items.map(
              (item) => (
                <div
                  key={
                    item.id
                  }
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 15,
                    padding:
                      "12px 0",
                    borderBottom:
                      "1px solid #f3f4f6"
                  }}
                >

                  <div
                    style={{
                      width: 65,
                      height: 65,
                      borderRadius:
                        8,
                      overflow:
                        "hidden",
                      background:
                        "#f3f4f6",
                      flexShrink: 0
                    }}
                  >

                    {item.image_url ? (
                      <img
                        src={
                          item.image_url
                        }
                        alt={
                          item.product_name
                        }
                        style={{
                          width:
                            "100%",
                          height:
                            "100%",
                          objectFit:
                            "cover"
                        }}
                      />
                    ) : null}

                  </div>


                  <div
                    style={{
                      flex: 1
                    }}
                  >

                    <strong>
                      {
                        item.product_name
                      }
                    </strong>

                    <div
                      style={{
                        marginTop:
                          5,
                        color:
                          "#6b7280"
                      }}
                    >
                      Rs.{" "}
                      {Number(
                        item.price ||
                          0
                      ).toLocaleString()}
                      {" × "}
                      {
                        item.quantity
                      }
                    </div>

                  </div>


                  <strong>
                    Rs.{" "}
                    {Number(
                      item.subtotal ||
                        0
                    ).toLocaleString()}
                  </strong>

                </div>
              )
            )}

          </div>


          <div
            style={{
              marginTop:
                20,
              marginLeft:
                "auto",
              maxWidth:
                350,
              display:
                "grid",
              gap: 8
            }}
          >

            <Row
              label="Subtotal"
              value={`Rs. ${Number(
                order.subtotal ||
                  0
              ).toLocaleString()}`}
            />

            <Row
              label="Shipping"
              value={`Rs. ${Number(
                order.shipping_fee ||
                  0
              ).toLocaleString()}`}
            />

            <Row
              label="Total"
              value={`Rs. ${Number(
                order.total ||
                  0
              ).toLocaleString()}`}
              strong
            />

          </div>

        </section>

      </div>

    </main>
  );
}


function Row({
  label,
  value,
  strong
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      style={{
        display:
          "flex",
        justifyContent:
          "space-between",
        borderTop:
          strong
            ? "1px solid #e5e7eb"
            : undefined,
        paddingTop:
          strong ? 10 : 0,
        fontSize:
          strong ? 19 : 15
      }}
    >
      <strong>
        {label}
      </strong>

      <strong>
        {value}
      </strong>
    </div>
  );
}
