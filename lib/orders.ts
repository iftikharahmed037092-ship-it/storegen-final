import { supabase } from "./supabase";

import type {
  Order,
  OrderItem,
  OrderWithItems
} from "@/types/order";

export async function getOrderById(
  orderId: string
): Promise<Order | null> {
  const {
    data,
    error
  } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


export async function getOrderItems(
  orderId: string
): Promise<OrderItem[]> {
  const {
    data,
    error
  } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("id", {
      ascending: true
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}


export async function getOrderWithItems(
  orderId: string
): Promise<OrderWithItems | null> {

  const order =
    await getOrderById(orderId);

  if (!order) {
    return null;
  }

  const items =
    await getOrderItems(orderId);

  return {
    order,
    items
  };
}


export async function getCustomerOrders(
  storeId: string,
  phone: string
): Promise<Order[]> {

  const {
    data,
    error
  } = await supabase
    .from("orders")
    .select("*")
    .eq("store_id", storeId)
    .eq("customer_phone", phone)
    .order("created_at", {
      ascending: false
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
