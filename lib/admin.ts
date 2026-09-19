import { supabase } from "./supabase";

export async function getAdminStats() {
  const [
    storesResult,
    productsResult,
    ordersResult,
    customersResult
  ] = await Promise.all([
    supabase
      .from("stores")
      .select("id", {
        count: "exact",
        head: true
      }),

    supabase
      .from("products")
      .select("id", {
        count: "exact",
        head: true
      }),

    supabase
      .from("orders")
      .select("id", {
        count: "exact",
        head: true
      }),

    supabase
      .from("orders")
      .select("customer_phone")
  ]);

  if (storesResult.error) {
    throw new Error(
      storesResult.error.message
    );
  }

  if (productsResult.error) {
    throw new Error(
      productsResult.error.message
    );
  }

  if (ordersResult.error) {
    throw new Error(
      ordersResult.error.message
    );
  }

  if (customersResult.error) {
    throw new Error(
      customersResult.error.message
    );
  }

  const phones =
    new Set(
      (customersResult.data ?? [])
        .map(
          (item) =>
            item.customer_phone
        )
        .filter(Boolean)
    );

  return {
    stores:
      storesResult.count ?? 0,

    products:
      productsResult.count ?? 0,

    orders:
      ordersResult.count ?? 0,

    customers:
      phones.size
  };
}
