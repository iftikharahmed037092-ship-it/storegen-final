import { supabase } from "@/lib/supabase";

export interface StoreAnalytics {
  storeId: string;
  storeName: string;
  slug: string;
  orders: number;
  deliveredOrders: number;
  pendingOrders: number;
  revenue: number;
}


export interface AdminAnalytics {
  totalOrders: number;
  totalRevenue: number;
  deliveredRevenue: number;
  pendingRevenue: number;
  deliveredOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  stores: StoreAnalytics[];
}


export async function getAdminAnalytics(): Promise<AdminAnalytics> {

  const [
    storesResult,
    ordersResult
  ] = await Promise.all([
    supabase
      .from("stores")
      .select(
        "id, store_name, slug"
      ),

    supabase
      .from("orders")
      .select(
        "id, store_id, total, status"
      )
  ]);


  if (storesResult.error) {
    throw new Error(
      storesResult.error.message
    );
  }


  if (ordersResult.error) {
    throw new Error(
      ordersResult.error.message
    );
  }


  const stores =
    storesResult.data ?? [];

  const orders =
    ordersResult.data ?? [];


  let totalRevenue = 0;
  let deliveredRevenue = 0;
  let pendingRevenue = 0;

  let deliveredOrders = 0;
  let pendingOrders = 0;
  let cancelledOrders = 0;


  for (const order of orders) {

    const total =
      Number(order.total) || 0;

    if (
      order.status !==
      "cancelled"
    ) {
      totalRevenue += total;
    }


    if (
      order.status ===
      "delivered"
    ) {
      deliveredOrders++;
      deliveredRevenue += total;
    }


    if (
      order.status ===
      "pending"
    ) {
      pendingOrders++;
      pendingRevenue += total;
    }


    if (
      order.status ===
      "cancelled"
    ) {
      cancelledOrders++;
    }
  }


  const storeAnalytics: StoreAnalytics[] =
    stores.map((store) => {

      const storeOrders =
        orders.filter(
          (order) =>
            order.store_id ===
            store.id
        );


      let revenue = 0;

      let delivered = 0;

      let pending = 0;


      for (
        const order of storeOrders
      ) {

        if (
          order.status !==
          "cancelled"
        ) {
          revenue +=
            Number(order.total) || 0;
        }


        if (
          order.status ===
          "delivered"
        ) {
          delivered++;
        }


        if (
          order.status ===
          "pending"
        ) {
          pending++;
        }
      }


      return {
        storeId: store.id,
        storeName:
          store.store_name,
        slug:
          store.slug,
        orders:
          storeOrders.length,
        deliveredOrders:
          delivered,
        pendingOrders:
          pending,
        revenue
      };
    });


  storeAnalytics.sort(
    (a, b) =>
      b.revenue -
      a.revenue
  );


  return {
    totalOrders:
      orders.length,

    totalRevenue,

    deliveredRevenue,

    pendingRevenue,

    deliveredOrders,

    pendingOrders,

    cancelledOrders,

    stores:
      storeAnalytics
  };
}
