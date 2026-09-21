import Link from "next/link";

import {
  getAdminStats
} from "@/lib/admin";

import {
  getAdminDashboardData
} from "@/lib/admin-dashboard";

import AdminStats
  from "@/components/admin/AdminStats";

import AdminDashboard
  from "@/components/admin/AdminDashboard";


export default async function AdminPage() {

  const [
    stats,
    dashboardData
  ] = await Promise.all([
    getAdminStats(),
    getAdminDashboardData()
  ]);


  return (
    <div>

      <div
        style={{
          display: "flex",
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
              marginBottom: 5
            }}
          >
            Master Admin Dashboard
          </h1>

          <p
            style={{
              marginTop: 0,
              color: "#6b7280"
            }}
          >
            Central control panel for
            all client stores.
          </p>

        </div>


        <Link
          href="/admin/analytics"
          style={{
            padding:
              "10px 15px",
            borderRadius: 8,
            background:
              "#2563eb",
            color: "#fff",
            fontWeight: 800
          }}
        >
          Open Analytics
        </Link>

      </div>


      <div
        style={{
          marginTop: 25
        }}
      >

        <AdminStats
          stores={stats.stores}
          products={stats.products}
          orders={stats.orders}
          customers={stats.customers}
        />

      </div>


      <div
        style={{
          marginTop: 30
        }}
      >

        <AdminDashboard
          data={dashboardData}
        />

      </div>

    </div>
  );
}
