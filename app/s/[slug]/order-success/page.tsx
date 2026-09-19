import Link from "next/link";
import { notFound } from "next/navigation";

import { getStoreBySlug } from "@/lib/stores";

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

  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
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
          maxWidth: 600,
          background: "#fff",
          borderRadius: 18,
          padding: 35,
          textAlign: "center",
          border: "1px solid #e5e7eb"
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            margin: "0 auto 20px",
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

        <h1>Order Placed Successfully!</h1>

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
          Your Cash on Delivery order has been
          received.
        </p>

        {id && (
          <div
            style={{
              marginTop: 20,
              padding: 14,
              borderRadius: 10,
              background: "#f9fafb",
              fontSize: 14
            }}
          >
            <strong>Order ID</strong>

            <div
              style={{
                marginTop: 6,
                wordBreak: "break-all",
                color: "#4b5563"
              }}
            >
              {id}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 25
          }}
        >
          <Link
            href={`/s/${store.slug}`}
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              background: store.primary_color,
              color: "#fff",
              fontWeight: 800
            }}
          >
            Continue Shopping
          </Link>

          <Link
            href={`/s/${store.slug}/products`}
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              border:
                "1px solid #d1d5db",
              background: "#fff",
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
