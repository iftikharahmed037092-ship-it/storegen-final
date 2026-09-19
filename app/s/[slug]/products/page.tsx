import {
  notFound
} from "next/navigation";

import {
  getStoreBySlug
} from "@/lib/stores";

import {
  getPublishedProductsByStoreId
} from "@/lib/products";

import {
  CartProvider
} from "@/components/storefront/CartProvider";

import StoreHeader
  from "@/components/storefront/StoreHeader";

import ProductGrid
  from "@/components/storefront/ProductGrid";

interface Props {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function ProductsPage({
  params,
  searchParams
}: Props) {
  const {
    slug
  } = await params;

  const {
    search
  } = await searchParams;

  const store =
    await getStoreBySlug(
      slug
    );

  if (!store) {
    notFound();
  }

  let products =
    await getPublishedProductsByStoreId(
      store.id
    );

  const searchValue =
    search?.trim()
      .toLowerCase();

  if (searchValue) {
    products =
      products.filter(
        product =>
          product.name
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          product.description
            ?.toLowerCase()
            .includes(
              searchValue
            )
      );
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
        <h1>
          {searchValue
            ? `Search: ${search}`
            : "All Products"}
        </h1>

        <ProductGrid
          products={
            products
          }
          storeSlug={
            store.slug
          }
        />
      </main>
    </CartProvider>
  );
}
