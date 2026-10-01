import { notFound, redirect } from "next/navigation";

import { getStoreByCustomDomain } from "@/lib/domain-routing";

interface CustomDomainPageProps {
  params: Promise<{
    path?: string[];
  }>;

  searchParams: Promise<{
    __domain?: string;
  }>;
}

export default async function CustomDomainPage({
  params,
  searchParams
}: CustomDomainPageProps) {
  const { path = [] } = await params;
  const { __domain } = await searchParams;

  if (!__domain) {
    notFound();
  }

  const store =
    await getStoreByCustomDomain(__domain);

  if (!store) {
    notFound();
  }

  /*
   * Homepage
   */
  if (path.length === 0) {
    redirect(`/s/${store.slug}`);
  }

  /*
   * Products
   */
  if (
    path.length === 1 &&
    path[0] === "products"
  ) {
    redirect(`/s/${store.slug}/products`);
  }

  /*
   * Cart
   */
  if (
    path.length === 1 &&
    path[0] === "cart"
  ) {
    redirect(`/s/${store.slug}/cart`);
  }

  /*
   * Product detail
   *
   * /product/PRODUCT_ID
   */
  if (
    path.length === 2 &&
    path[0] === "product"
  ) {
    redirect(
      `/s/${store.slug}/product/${path[1]}`
    );
  }

  /*
   * Orders
   *
   * /orders
   */
  if (
    path.length === 1 &&
    path[0] === "orders"
  ) {
    redirect(`/s/${store.slug}/orders`);
  }

  /*
   * Customer order
   *
   * /order/ORDER_ID
   */
  if (
    path.length === 2 &&
    path[0] === "order"
  ) {
    redirect(
      `/s/${store.slug}/order/${path[1]}`
    );
  }

  notFound();
}
