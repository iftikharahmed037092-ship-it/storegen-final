import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getStoreBySlug } from "@/lib/stores";
import { getOrderWithItems } from "@/lib/orders";

import StoreHeader from "@/components/storefront/StoreHeader";

import OrderStatusTracker from "@/components/storefront/OrderStatusTracker";

interface OrderPageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

export default async function OrderPage({
  params
}: OrderPageProps) {

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
    result.order.store_id !== store.id
  ) {
    notFound();
  }


  const {
    order,
    items
  } = result;


  return (
    <>
      <StoreHeader
        storeName={
          store.store_name
        }
        storeSlug={
          store.slug
        }
        logoUrl={
          store.logo_url
        }
        primaryColor={
          store.primary_color
        }
      />


      <main
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding:
            "30px 20px"
        }}
      >

        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            gap: 15,
            alignItems:
              "center",
            flexWrap:
              "wrap"
          }}
        >

          <div>
            <h1
              style={{
                margin: 0
              }}
            >
              Order Details
            </h1>

            <p
              style={{
                color:
                  "#6b7280",
                wordBreak:
                  "break-all"
              }}
            >
              Order ID: {order.id}
            </p>
          </div>

          <Link
            href={`/s/${store.slug}`}
            style={{
              padding:
                "10px 16px",
              borderRadius: 9,
              background:
                store.primary_color,
              color: "#fff",
              fontWeight: 700
            }}
          >
            Continue Shopping
          </Link>

        </div>


        <OrderStatusTracker
          status={
            order.status
          }
        />


        <section
          style={{
            marginTop: 25,
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20
          }}
        >

          <div
            style={{
              background:
                "#fff",
              border:
                "1px solid #e5e7eb",
              borderRadius: 14,
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
              {order.customer_name}
            </p>

            <p>
              <strong>
                Phone:
              </strong>{" "}
              {order.customer_phone}
            </p>

            <p>
              <strong>
                City:
              </strong>{" "}
              {order.customer_city}
            </p>

            <p>
              <strong>
                Address:
              </strong>{" "}
              {order.customer_address}
            </p>

          </div>


          <div
            style={{
              background:
                "#fff",
              border:
                "1px solid #e5e7eb",
              borderRadius: 14,
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
              {order.status}
            </p>

            <p>
              <strong>
                Order Date:
              </strong>{" "}
              {new Date(
                order.created_at
              ).toLocaleString()}
            </p>

          </div>

        </section>


        <section
          style={{
            marginTop: 20,
            background:
              "#fff",
            border:
              "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 20
          }}
        >

          <h2>
            Products
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
                  key={item.id}
                  style={{
                    display:
                      "flex",
                    gap: 15,
                    alignItems:
                      "center",
                    padding:
                      "12px 0",
                    borderBottom:
                      "1px solid #f3f4f6"
                  }}
                >

                  <div
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 9,
                      overflow:
                        "hidden",
                      background:
                        "#f3f4f6",
                      flexShrink: 0
                    }}
                  >

                    {item.image_url ? (
                      <Image
                        src={
                          item.image_url
                        }
                        alt={
                          item.product_name
                        }
                        width={70}
                        height={70}
                        style={{
                          width:
                            "100%",
                          height:
                            "100%",
                          objectFit:
                            "cover"
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height:
                            "100%",
                          display:
                            "grid",
                          placeItems:
                            "center",
                          fontSize: 11,
                          color:
                            "#9ca3af"
                        }}
                      >
                        No Image
                      </div>
                    )}

                  </div>


                  <div
                    style={{
                      flex: 1
                    }}
                  >

                    <div
                      style={{
                        fontWeight:
                          800
                      }}
                    >
                      {
                        item.product_name
                      }
                    </div>

                    <div
                      style={{
                        marginTop: 5,
                        color:
                          "#6b7280",
                        fontSize: 13
                      }}
                    >
                      Rs.{" "}
                      {item.price.toLocaleString()}
                      {" × "}
                      {item.quantity}
                    </div>

                  </div>


                  <strong>
                    Rs.{" "}
                    {item.subtotal.toLocaleString()}
                  </strong>

                </div>
              )
            )}

          </div>


          <div
            style={{
              marginTop: 20,
              display:
                "grid",
              gap: 8,
              maxWidth: 350,
              marginLeft:
                "auto"
            }}
          >

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between"
              }}
            >
              <span>
                Subtotal
              </span>

              <strong>
                Rs.{" "}
                {order.subtotal.toLocaleString()}
              </strong>
            </div>


            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between"
              }}
            >
              <span>
                Shipping
              </span>

              <strong>
                Rs.{" "}
                {order.shipping_fee.toLocaleString()}
              </strong>
            </div>


            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                borderTop:
                  "1px solid #e5e7eb",
                paddingTop: 10,
                fontSize: 19
              }}
            >
              <strong>
                Total
              </strong>

              <strong
                style={{
                  color:
                    store.primary_color
                }}
              >
                Rs.{" "}
                {order.total.toLocaleString()}
              </strong>
            </div>

          </div>

        </section>

      </main>
    </>
  );
}
