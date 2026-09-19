export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod =
  | "cod";

export interface Order {
  id: string;
  store_id: string;

  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;

  payment_method: PaymentMethod;
  status: OrderStatus;

  subtotal: number;
  shipping_fee: number;
  total: number;

  whatsapp_sent: boolean;

  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;

  product_name: string;

  price: number;
  quantity: number;

  image_url: string | null;

  subtotal: number;
}

export interface OrderWithItems {
  order: Order;
  items: OrderItem[];
}
