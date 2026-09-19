import Link from "next/link";
import { notFound } from "next/navigation";

import { getStoreBySlug } from "@/lib/stores";

import WhatsAppOrderButton from "@/components/storefront/WhatsAppOrderButton";

interface OrderSuccessPageProps {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    id?: string;
  }>;
}

export default async function OrderSuccessPage({
  params,
  searchParams
}: OrderSuccessPageProps) {

  const { slug } = await params;
  const { id } = await searchParams;


  const store =
    await getStoreBySlug(slug);


  if (!store) {
    notFound();
  }


  let order = null;


  if (id) {

    const response =
      await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/orders/${id}`,
        {
          cache: "no-store"
        }
      )
      .catch(() => null);


    if (response?.ok) {
      const data =
        await response.json();

      order = data.order;
    }
  }


  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 20,
        background: "#f5f7f6"
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: 620,
          background: "#fff",
          borderRadius: 18,
          padding: 35,
          textAlign: "center",
          border:
            "1px solid #e5e7eb"
        }}
      >

        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            margin:
              "0 auto 20px",
            display: "grid",
            placeItems: "center",
            background: "#dcfce7",
            color: "#15803d",
            fontSize: 35,
            fontWeight: 900
          }}
        >
          ✓
        </div>


        <h1>
          Order Placed Successfully!
        </h1>


        <p
          style={{
            color: "#6b7280",
            lineHeight: 1.7
          }}
        >
          Thank you for shopping from{" "}
          <strong>
            {store.store_name}
          </strong>
          .
          <br />
          Your Cash on Delivery order
          has been received.
        </p>


        {order && (
          <div
            style={{
              marginTop: 20,
              textAlign: "left",
              padding: 18,
              borderRadius: 12,
              background: "#f9fafb",
              border:
                "1px solid #e5e7eb"
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 15,
                marginBottom: 10
              }}
            >
              <strong>
                Customer
              </strong>

              <span>
                {order.customer_name}
              </span>
            </div>


            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 15,
                marginBottom: 10
              }}
            >
              <strong>
                Phone
              </strong>

              <span>
                {order.customer_phone}
              </span>
            </div>


            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 15,
                marginBottom: 10
              }}
            >
              <strong>
                City
              </strong>

              <span>
                {order.customer_city}
              </span>
            </div>


            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 15,
                marginBottom: 10
              }}
            >
              <strong>
                Payment
              </strong>

              <span>
                Cash on Delivery
              </span>
            </div>


            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 15,
                paddingTop: 12,
                borderTop:
                  "1px solid #e5e7eb",
                fontSize: 18
              }}
            >
              <strong>
                Total
              </strong>

              <strong>
                Rs.{" "}
                {order.total.toLocaleString()}
              </strong>
            </div>

          </div>
        )}


        {id && (
          <div
            style={{
              marginTop: 15,
              padding: 12,
              borderRadius: 10,
              background: "#f9fafb",
              fontSize: 13,
              wordBreak:
                "break-all"
            }}
          >
            <strong>
              Order ID
            </strong>

            <div
              style={{
                marginTop: 5,
                color: "#6b7280"
              }}
            >
              {id}
            </div>
          </div>
        )}


        {order && (
          <WhatsAppOrderButton
            phone={
              store.whatsapp_number
            }
            orderId={order.id}
            storeName={
              store.store_name
            }
            total={order.total}
          />
        )}


        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 20
          }}
        >

          <Link
            href={`/s/${store.slug}`}
            style={{
              padding:
                "12px 20px",
              borderRadius: 10,
              background:
                store.primary_color,
              color: "#fff",
              fontWeight: 800
            }}
          >
            Continue Shopping
          </Link>


          <Link
            href={`/s/${store.slug}/products`}
            style={{
              padding:
                "12px 20px",
              border:
                "1px solid #d1d5db",
              background: "#fff",
              borderRadius: 10,
              fontWeight: 700
            }}
          >
            View Products
          </Link>

        </div>

      </div>

    </main>
  );
}
