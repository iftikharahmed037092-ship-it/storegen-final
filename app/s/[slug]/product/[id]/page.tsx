import {
  notFound
} from "next/navigation";

import {
  getStoreBySlug
} from "@/lib/stores";

import {
  getProductById
} from "@/lib/products";

import {
  CartProvider
} from "@/components/storefront/CartProvider";

import StoreHeader
  from "@/components/storefront/StoreHeader";

import ProductDetails
  from "@/components/storefront/ProductDetails";

interface Props {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

export default async function ProductPage({
  params
}: Props) {
  const {
    slug,
    id
  } = await params;

  const store =
    await getStoreBySlug(
      slug
    );

  if (!store) {
    notFound();
  }

  const product =
    await getProductById(
      id
    );

  if (
    !product ||
    product.store_id !==
      store.id ||
    !product.published
  ) {
    notFound();
  }

  return (
    <CartProvider
      storeId={
        store.id
      }
    >
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

      <main
        style={{
          maxWidth:
            1200,
          margin:
            "0 auto",
          padding:
            "40px 16px"
        }}
      >
        <ProductDetails
          product={
            product
          }
          storeSlug={
            store.slug
          }
        />
      </main>
    </CartProvider>
  );
}
