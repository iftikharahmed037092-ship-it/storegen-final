import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getStoreBySlug } from "@/lib/stores";
import { getOrderWithItems } from "@/lib/orders";

import OrderStatusEditor from "@/components/admin/OrderStatusEditor";

interface AdminOrderPageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

export default async function AdminOrderPage({
  params
}: AdminOrderPageProps) {

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
    <div>

      <Link
        href={`/admin/stores/${store.slug}/orders`}
        style={{
          color: "#2563eb",
          fontWeight: 700
        }}
      >
        ← Back to Orders
      </Link>

      <div
        style={{
          marginTop: 15,
          display: "flex",
          justifyContent:
            "space-between",
          gap: 15,
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        <div>
          <h1
            style={{
              marginBottom: 5
            }}
          >
            Order #
            {order.id.slice(0, 8)}
          </h1>

          <div
            style={{
              color: "#6b7280"
            }}
          >
            Full ID: {order.id}
          </div>
        </div>

        <Link
          href={`/s/${store.slug}/order/${order.id}`}
          target="_blank"
          style={{
            padding:
              "10px 14px",
            borderRadius: 8,
            background:
              "#16a34a",
            color: "#fff",
            fontWeight: 700
          }}
        >
          Customer View
        </Link>
      </div>

      <OrderStatusEditor
        orderId={order.id}
        initialStatus={
          order.status
        }
      />

      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20
        }}
      >

        <section
          style={{
            background: "#fff",
            border:
              "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 20
          }}
        >
          <h2>
            Customer Information
          </h2>

          <p>
            <strong>Name:</strong>{" "}
            {order.customer_name}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {order.customer_phone}
          </p>

          <p>
            <strong>City:</strong>{" "}
            {order.customer_city}
          </p>

          <p>
            <strong>Address:</strong>{" "}
            {order.customer_address}
          </p>
        </section>

        <section
          style={{
            background: "#fff",
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
              Subtotal:
            </strong>{" "}
            Rs.{" "}
            {order.subtotal.toLocaleString()}
          </p>

          <p>
            <strong>
              Shipping:
            </strong>{" "}
            Rs.{" "}
            {order.shipping_fee.toLocaleString()}
          </p>

          <p
            style={{
              fontSize: 20
            }}
          >
            <strong>
              Total:
            </strong>{" "}
            Rs.{" "}
            {order.total.toLocaleString()}
          </p>
        </section>

      </div>

      <section
        style={{
          marginTop: 20,
          background: "#fff",
          border:
            "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 20
        }}
      >

        <h2>
          Order Items
        </h2>

        <div
          style={{
            display: "grid",
            gap: 12
          }}
        >

          {items.map(
            (item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
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
                    flexShrink: 0,
                    borderRadius: 8,
                    overflow:
                      "hidden",
                    background:
                      "#f3f4f6"
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
                      width={65}
                      height={65}
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
                      marginTop: 5,
                      color:
                        "#6b7280"
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
      </section>

    </div>
  );
}
