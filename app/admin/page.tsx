import { getStores } from "@/lib/stores";
import AdminClient from "./AdminClient";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const stores = await getStores();

  return (
    <div className="p-6">
      <AdminClient initialStores={stores} />
    </div>
  );
}
