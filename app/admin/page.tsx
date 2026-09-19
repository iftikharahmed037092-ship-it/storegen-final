import Link from "next/link";

import { getAdminStats } from "@/lib/admin";

import AdminStats from "@/components/admin/AdminStats";

export default async function AdminPage() {
  const stats =
    await getAdminStats();

  return (
    <div>
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 30
          }}
        >
          Master Admin Dashboard
        </h1>

        <p
          style={{
            marginTop: 8,
            color: "#6b7280"
          }}
        >
          Manage all client stores from
          one central dashboard.
        </p>
      </div>

      <AdminStats
        stores={stats.stores}
        products={stats.products}
        orders={stats.orders}
        customers={stats.customers}
      />

      <div
        style={{
          marginTop: 30,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 15
        }}
      >
        <AdminCard
          title="Manage Stores"
          description="Create and manage client websites."
          href="/admin/stores"
        />

        <AdminCard
          title="Manage Orders"
          description="View and manage all store orders."
          href="/admin/orders"
        />

        <AdminCard
          title="Manage Products"
          description="Manage products across all stores."
          href="/admin/products"
        />

        <AdminCard
          title="Customers"
          description="View customer activity and orders."
          href="/admin/customers"
        />
      </div>
    </div>
  );
}

function AdminCard({
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
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 20
      }}
    >
      <h2
        style={{
          marginTop: 0
        }}
      >
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
