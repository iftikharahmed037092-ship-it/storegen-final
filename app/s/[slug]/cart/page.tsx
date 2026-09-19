import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/stores";
import StoreHeader from "@/components/storefront/StoreHeader";
import CartProvider from "@/components/storefront/CartProvider";
import CartContent from "@/components/storefront/CartContent";

interface CartPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CartPage({
  params
}: CartPageProps) {
  const { slug } = await params;

  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  return (
    <CartProvider storeId={store.id}>
      <StoreHeader
        storeName={store.store_name}
        storeSlug={store.slug}
        logoUrl={store.logo_url}
        primaryColor={store.primary_color}
      />

      <CartContent
        storeSlug={store.slug}
        primaryColor={store.primary_color}
      />
    </CartProvider>
  );
}
