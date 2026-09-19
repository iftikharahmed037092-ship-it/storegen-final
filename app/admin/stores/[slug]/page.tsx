import { notFound } from "next/navigation";
import Link from "next/link";
import { getStoreBySlug } from "@/lib/stores";
import ProductManager from "@/components/admin/ProductManager";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StoreProductsPage({
  params
}: Props) {
  const { slug } = await params;

  const store =
    await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px",
        maxWidth: "1100px",
        margin: "0 auto"
      }}
    >
      <div
        style={{
          marginBottom: "25px"
        }}
      >
        <Link
          href="/admin"
          style={{
            color: "#16a34a",
            fontWeight: 700
          }}
        >
          ← Back to Admin
        </Link>

        <h1>
          {store.store_name}
        </h1>

        <p>
          Manage this store's
          products.
        </p>
      </div>

      <ProductManager
        storeId={store.id}
        storeName={
          store.store_name
        }
      />
    </main>
  );
}
