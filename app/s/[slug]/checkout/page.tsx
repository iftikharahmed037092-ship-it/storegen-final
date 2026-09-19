import { notFound } from "next/navigation";

import { getStoreBySlug } from "@/lib/stores";

import StoreHeader from "@/components/storefront/StoreHeader";

import CartProvider from "@/components/storefront/CartProvider";

import CheckoutForm from "@/components/storefront/CheckoutForm";

interface CheckoutPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CheckoutPage({
  params
}: CheckoutPageProps) {
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

      <CheckoutForm
        storeId={store.id}
        storeSlug={store.slug}
        primaryColor={store.primary_color}
      />
    </CartProvider>
  );
}
