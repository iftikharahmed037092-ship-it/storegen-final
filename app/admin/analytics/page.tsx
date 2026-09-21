import Link from "next/link";

import {
  getAdminAnalytics
} from "@/lib/admin-analytics";

import AdminAnalytics
  from "@/components/admin/AdminAnalytics";


export default async function AdminAnalyticsPage() {

  const analytics =
    await getAdminAnalytics();


  return (
    <div>

      <Link
        href="/admin"
        style={{
          color: "#2563eb",
          fontWeight: 700
        }}
      >
        ← Back to Dashboard
      </Link>


      <h1>
        Admin Analytics
      </h1>

      <p
        style={{
          color: "#6b7280"
        }}
      >
        Real order and revenue
        statistics across all stores.
      </p>


      <div
        style={{
          marginTop: 25
        }}
      >

        <AdminAnalytics
          data={analytics}
        />

      </div>

    </div>
  );
}
