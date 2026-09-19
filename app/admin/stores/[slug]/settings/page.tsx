import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getStoreBySlug
} from "@/lib/stores";

import StoreSettings
  from "@/components/admin/StoreSettings";


interface StoreSettingsPageProps {
  params: Promise<{
    slug: string;
  }>;
}


export default async function StoreSettingsPage({
  params
}: StoreSettingsPageProps) {

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
        href={`/admin/stores/${store.slug}`}
        style={{
          color: "#2563eb",
          fontWeight: 700
        }}
      >
        ← Back to Store
      </Link>


      <h1>
        Store Settings
      </h1>

      <p
        style={{
          color: "#6b7280"
        }}
      >
        Manage settings for{" "}
        <strong>
          {store.store_name}
        </strong>
      </p>


      <div
        style={{
          marginTop: 25,
          maxWidth: 800,
          background: "#fff",
          border:
            "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 25
        }}
      >

        <StoreSettings
          store={store}
        />

      </div>

    </div>
  );
}
