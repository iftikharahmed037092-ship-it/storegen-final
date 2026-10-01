import { getAdminAnalytics } from "@/lib/admin-analytics";
import AdminAnalytics from "@/components/admin/AdminAnalytics";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

export default async function AdminAnalyticsPage() {
  const analytics =
    await getAdminAnalytics();

  return (
    <AdminAnalytics
      data={analytics}
    />
  );
}
