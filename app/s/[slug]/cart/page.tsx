import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/stores";
import { CartProvider } from "@/components/storefront/CartProvider";
import StoreHeader from "@/components/storefront/StoreHeader";
import CartContent from "@/components/storefront/CartContent";

export default async function CartPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();
  return (
    <CartProvider storeId={store.id}>
      <StoreHeader storeName={store.store_name} storeSlug={store.slug} logoUrl={store.logo_url} primaryColor={store.primary_color} />
      <CartContent slug={store.slug} />
    </CartProvider>
  );
}
