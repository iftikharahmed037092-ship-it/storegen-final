import Link from "next/link";
import { notFound } from "next/navigation";

import { getStoreBySlug } from "@/lib/stores";
import { getCategoriesByStoreId } from "@/lib/categories";
import { getProductsByStoreId } from "@/lib/products";

interface SuccessPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function GeneratorSuccessPage({
  params
}: SuccessPageProps) {
  const { slug } = await params;

  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const [categories, products] = await Promise.all([
    getCategoriesByStoreId(store.id),
    getProductsByStoreId(store.id)
  ]);

  const activeCategories = categories.filter(
    (category) => category.is_active
  );

  const publishedProducts = products.filter(
    (product) => product.published
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7f6",
        padding: "30px 18px 60px"
      }}
    >
      <div
        style={{
          maxWidth: 1050,
          margin: "0 auto"
        }}
      >
        {/* Top */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 18,
            padding: "28px",
            border: "1px solid #e5e7eb",
            marginBottom: 20
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 12px",
              borderRadius: 999,
              background: "#dcfce7",
              color: "#166534",
              fontSize: 13,
              fontWeight: 800,
              marginBottom: 14
            }}
          >
            ✓ Website Generated Successfully
          </div>

          <h1
            style={{
              margin: "0 0 8px",
              fontSize: 32,
              lineHeight: 1.2,
              color: "#111827"
            }}
          >
            {store.store_name}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: 15
            }}
          >
            Your client website has been created and is ready to manage.
          </p>
        </div>

        {/* Summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
            marginBottom: 20
          }}
        >
          <SummaryCard
            title="Store Status"
            value={store.is_active ? "Active" : "Inactive"}
          />

          <SummaryCard
            title="Business Type"
            value={formatLabel(store.business_type)}
          />

          <SummaryCard
            title="Template"
            value={formatLabel(store.template_type)}
          />

          <SummaryCard
            title="Categories"
            value={String(activeCategories.length)}
          />

          <SummaryCard
            title="Demo Products"
            value={String(publishedProducts.length)}
          />
        </div>

        {/* Main actions */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: 18,
            padding: 24,
            border: "1px solid #e5e7eb",
            marginBottom: 20
          }}
        >
          <h2
            style={{
              margin: "0 0 18px",
              fontSize: 21,
              color: "#111827"
            }}
          >
            Manage Client Website
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 12
            }}
          >
            <ActionLink
              href={`/editor/${store.slug}`}
              title="Open Visual Editor"
              description="Customize the website design"
              primary
            />

            <ActionLink
              href={`/s/${store.slug}`}
              title="Open Live Website"
              description="View the client storefront"
            />

            <ActionLink
              href={`/admin/stores/${store.slug}/products`}
              title="Manage Products"
              description="Add, edit and manage products"
            />

            <ActionLink
              href={`/admin/stores/${store.slug}/orders`}
              title="Manage Orders"
              description="View and manage customer orders"
            />

            <ActionLink
              href={`/admin/stores/${store.slug}/settings`}
              title="Store Settings"
              description="Edit store information"
            />

            <ActionLink
              href={`/admin/stores/${store.slug}`}
              title="Store Dashboard"
              description="Open complete store management"
            />
          </div>
        </section>

        {/* Generated data */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: 18,
            padding: 24,
            border: "1px solid #e5e7eb",
            marginBottom: 20
          }}
        >
          <h2
            style={{
              margin: "0 0 18px",
              fontSize: 21,
              color: "#111827"
            }}
          >
            Generated Website Data
          </h2>

          <div
            style={{
              display: "grid",
              gap: 10
            }}
          >
            <InfoRow label="Store Name" value={store.store_name} />

            <InfoRow label="Store Slug" value={store.slug} />

            <InfoRow
              label="Business Type"
              value={formatLabel(store.business_type)}
            />

            <InfoRow
              label="Template"
              value={formatLabel(store.template_type)}
            />

            <InfoRow
              label="Categories Created"
              value={`${categories.length}`}
            />

            <InfoRow
              label="Products Created"
              value={`${products.length}`}
            />

            <InfoRow
              label="Shipping Fee"
              value={`Rs. ${store.shipping_fee}`}
            />

            <InfoRow
              label="WhatsApp"
              value={store.whatsapp_number || "Not configured"}
            />
          </div>
        </section>

        {/* Back */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10
          }}
        >
          <Link
            href="/admin/generator"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 18px",
              borderRadius: 10,
              background: "#111827",
              color: "#ffffff",
              fontWeight: 800
            }}
          >
            + Create Another Website
          </Link>

          <Link
            href="/admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 18px",
              borderRadius: 10,
              background: "#ffffff",
              color: "#111827",
              border: "1px solid #d1d5db",
              fontWeight: 800
            }}
          >
            Back to Admin
          </Link>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({
  title,
  value
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 15,
        padding: 20,
        border: "1px solid #e5e7eb"
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: "#6b7280",
          marginBottom: 7,
          fontWeight: 700
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 20,
          color: "#111827",
          fontWeight: 900
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ActionLink({
  href,
  title,
  description,
  primary = false
}: {
  href: string;
  title: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: 18,
        borderRadius: 14,
        background: primary ? "#16a34a" : "#f9fafb",
        color: primary ? "#ffffff" : "#111827",
        border: primary
          ? "1px solid #16a34a"
          : "1px solid #e5e7eb",
        transition: "0.2s"
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 900,
          marginBottom: 6
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 13,
          lineHeight: 1.5,
          opacity: primary ? 0.9 : 0.65
        }}
      >
        {description}
      </div>
    </Link>
  );
}

function InfoRow({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 15,
        padding: "12px 14px",
        borderRadius: 10,
        background: "#f9fafb",
        border: "1px solid #f0f1f2"
      }}
    >
      <span
        style={{
          color: "#6b7280",
          fontSize: 14,
          fontWeight: 700
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#111827",
          fontSize: 14,
          fontWeight: 800,
          textAlign: "right",
          wordBreak: "break-word"
        }}
      >
        {value}
      </span>
    </div>
  );
}

function formatLabel(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
