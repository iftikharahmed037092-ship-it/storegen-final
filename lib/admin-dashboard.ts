import { supabase } from "@/lib/supabase";

export interface RecentOrder {
  id: string;
  store_id: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  status: string;
  created_at: string;
  store_name: string;
  store_slug: string;
}

export interface RecentStore {
  id: string;
  slug: string;
  store_name: string;
  is_active: boolean;
  created_at: string;
}

export interface AdminDashboardData {
  recentOrders: RecentOrder[];
  recentStores: RecentStore[];
}


export async function getAdminDashboardData(): Promise<AdminDashboardData> {

  const [
    ordersResult,
    storesResult
  ] = await Promise.all([

    supabase
      .from("orders")
      .select(`
        id,
        store_id,
        customer_name,
        customer_phone,
        total,
        status,
        created_at
      `)
      .order("created_at", {
        ascending: false
      })
      .limit(10),

    supabase
      .from("stores")
      .select(`
        id,
        slug,
        store_name,
        is_active,
        created_at
      `)
      .order("created_at", {
        ascending: false
      })
      .limit(8)

  ]);


  if (ordersResult.error) {
    throw new Error(
      ordersResult.error.message
    );
  }


  if (storesResult.error) {
    throw new Error(
      storesResult.error.message
    );
  }


  const stores =
    storesResult.data ?? [];

  const orders =
    ordersResult.data ?? [];


  const storeMap =
    new Map(
      stores.map(
        (store) => [
          store.id,
          store
        ]
      )
    );


  /*
   * We need store information
   * even when the store is not
   * inside the latest 8 stores.
   *
   * Fetch the required store IDs.
   */

  const orderStoreIds = [
    ...new Set(
      orders.map(
        (order) =>
          order.store_id
      )
    )
  ];


  let orderStores: {
    id: string;
    slug: string;
    store_name: string;
  }[] = [];


  if (
    orderStoreIds.length > 0
  ) {

    const {
      data,
      error
    } = await supabase
      .from("stores")
      .select(
        "id, slug, store_name"
      )
      .in(
        "id",
        orderStoreIds
      );


    if (error) {
      throw new Error(
        error.message
      );
    }


    orderStores =
      data ?? [];
  }


  const orderStoreMap =
    new Map(
      orderStores.map(
        (store) => [
          store.id,
          store
        ]
      )
    );


  const recentOrders: RecentOrder[] =
    orders.map(
      (order) => {

        const store =
          orderStoreMap.get(
            order.store_id
          );

        return {
          id: order.id,
          store_id:
            order.store_id,
          customer_name:
            order.customer_name,
          customer_phone:
            order.customer_phone,
          total:
            Number(order.total) || 0,
          status:
            order.status,
          created_at:
            order.created_at,
          store_name:
            store?.store_name ||
            "Unknown Store",
          store_slug:
            store?.slug || ""
        };
      }
    );


  return {
    recentOrders,
    recentStores:
      stores.map(
        (store) => ({
          id: store.id,
          slug: store.slug,
          store_name:
            store.store_name,
          is_active:
            store.is_active,
          created_at:
            store.created_at
        })
      )
  };
}
