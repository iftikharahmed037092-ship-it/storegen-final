import Link from "next/link";
import { notFound } from "next/navigation";

import { getStoreBySlug } from "@/lib/stores";

interface StoreManagePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StoreManagePage({
  params
}: StoreManagePageProps) {

  const { slug } =
    await params;

  const store =
    await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/stores"
        style={{
          color: "#2563eb",
          fontWeight: 700
        }}
      >
        ← Back to Stores
      </Link>

      <h1
        style={{
          marginBottom: 5
        }}
      >
        {store.store_name}
      </h1>

      <p
        style={{
          color: "#6b7280"
        }}
      >
        Manage this client store.
      </p>

      <div
        style={{
          marginTop: 25,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 15
        }}
      >
        <ManageCard
          title="Products"
          description="Add, edit and manage products."
          href={`/admin/stores/${store.slug}/products`}
        />

        <ManageCard
          title="Orders"
          description="View this store's orders."
          href={`/admin/stores/${store.slug}/orders`}
        />

        <ManageCard
          title="Editor"
          description="Open the private visual editor."
          href={`/editor/${store.slug}`}
        />

        <ManageCard
          title="Live Website"
          description="Open the customer storefront."
          href={`/s/${store.slug}`}
        />
      </div>
    </div>
  );
}

function ManageCard({
  title,
  description,
  href
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        background: "#fff",
        border:
          "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 20
      }}
    >
      <h2>
        {title}
      </h2>

      <p
        style={{
          color: "#6b7280",
          lineHeight: 1.6
        }}
      >
        {description}
      </p>

      <strong>
        Open →
      </strong>
    </Link>
  );
}
