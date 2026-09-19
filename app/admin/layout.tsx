import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({
  children
}: AdminLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6"
      }}
    >
      <header
        style={{
          background: "#111827",
          color: "#fff",
          padding: "14px 20px",
          position: "sticky",
          top: 0,
          zIndex: 100
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap"
          }}
        >
          <Link
            href="/admin"
            style={{
              fontSize: 20,
              fontWeight: 900
            }}
          >
            Master Admin
          </Link>

          <nav
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap"
            }}
          >
            <AdminLink
              href="/admin"
              label="Dashboard"
            />

            <AdminLink
              href="/admin/stores"
              label="Stores"
            />

            <AdminLink
              href="/admin/orders"
              label="Orders"
            />

            <AdminLink
              href="/admin/products"
              label="Products"
            />

            <AdminLink
              href="/admin/customers"
              label="Customers"
            />
          </nav>
        </div>
      </header>

      <main
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "25px 20px"
        }}
      >
        {children}
      </main>
    </div>
  );
}

function AdminLink({
  href,
  label
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      style={{
        padding: "8px 11px",
        borderRadius: 7,
        background: "#1f2937",
        fontSize: 14,
        fontWeight: 700
      }}
    >
      {label}
    </Link>
  );
}
