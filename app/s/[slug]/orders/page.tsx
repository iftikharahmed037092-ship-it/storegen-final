import { notFound } from "next/navigation";

import { getStoreBySlug } from "@/lib/stores";

import StoreHeader from "@/components/storefront/StoreHeader";

import OrderLookup from "@/components/storefront/OrderLookup";

interface OrdersPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OrdersPage({
  params
}: OrdersPageProps) {

  const { slug } =
    await params;


  const store =
    await getStoreBySlug(slug);


  if (!store) {
    notFound();
  }


  return (
    <>
      <StoreHeader
        storeName={
          store.store_name
        }
        storeSlug={
          store.slug
        }
        logoUrl={
          store.logo_url
        }
        primaryColor={
          store.primary_color
        }
      />

      <OrderLookup
        storeSlug={
          store.slug
        }
      />
    </>
  );
}
