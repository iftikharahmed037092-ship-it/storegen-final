import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/stores";
import ProductManager from "@/components/admin/ProductManager";

interface ProductsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StoreProductsPage({
  params
}: ProductsPageProps) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  return (
    <div
      style={{
        marginBottom: 20
      }}
    >
      <Link
        href={`/admin/stores/${store.slug}`}
        style={{
          color: "#2563eb",
          fontWeight: 700
        }}
      >
        ← Back to Store
      </Link>

      <h1>{store.store_name} - Products</h1>

      <ProductManager
        storeId={store.id}
        storeName={store.store_name || store.name}
      />
    </div>
  );
}
