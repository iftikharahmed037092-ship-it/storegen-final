import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface OrderRequestItem {
  productId: string;
  quantity: number;
}

interface OrderRequest {
  storeId: string;

  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };

  paymentMethod: "cod";

  channel?: "website" | "whatsapp";

  items: OrderRequestItem[];
}

function normalizeWhatsAppNumber(phone: string) {
  let number = phone.replace(/\D/g, "");

  if (number.startsWith("00")) {
    number = number.slice(2);
  }

  if (number.startsWith("0")) {
    number = "92" + number.slice(1);
  }

  return number;
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as OrderRequest;

    const channel =
      body.channel === "whatsapp"
        ? "whatsapp"
        : "website";

    if (!body.storeId) {
      return NextResponse.json(
        {
          error: "Store ID is required."
        },
        { status: 400 }
      );
    }

    if (!body.customer) {
      return NextResponse.json(
        {
          error:
            "Customer information is required."
        },
        { status: 400 }
      );
    }

    if (
      !body.customer.name?.trim() ||
      !body.customer.phone?.trim() ||
      !body.customer.address?.trim() ||
      !body.customer.city?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Name, phone, address and city are required."
        },
        { status: 400 }
      );
    }

    if (body.paymentMethod !== "cod") {
      return NextResponse.json(
        {
          error:
            "Only Cash on Delivery is currently available."
        },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Your cart is empty."
        },
        { status: 400 }
      );
    }

    // WhatsApp order کے لیے store کا WhatsApp نمبر ضروری ہے
    let storeWhatsapp: string | null = null;
    let storeName = "";

    if (channel === "whatsapp") {
      const {
        data: store,
        error: storeError
      } = await supabase
        .from("stores")
        .select(
          "store_name, whatsapp_number, is_active"
        )
        .eq("id", body.storeId)
        .maybeSingle();

      if (storeError) {
        return NextResponse.json(
          {
            error: storeError.message
          },
          { status: 400 }
        );
      }

      if (!store || !store.is_active) {
        return NextResponse.json(
          {
            error: "Store is not available."
          },
          { status: 400 }
        );
      }

      storeWhatsapp =
        store.whatsapp_number;

      storeName =
        store.store_name || "Store";

      if (!storeWhatsapp?.trim()) {
        return NextResponse.json(
          {
            error:
              "This store has not configured a WhatsApp number yet."
          },
          { status: 400 }
        );
      }
    }

    /*
     * IMPORTANT:
     * Price, stock, product and total
     * database RPC سے verify ہوتے ہیں۔
     */
    const {
      data: orderId,
      error: rpcError
    } = await supabase.rpc(
      "create_cod_order",
      {
        p_store_id:
          body.storeId,

        p_customer_name:
          body.customer.name.trim(),

        p_customer_phone:
          body.customer.phone.trim(),

        p_customer_address:
          body.customer.address.trim(),

        p_customer_city:
          body.customer.city.trim(),

        p_items:
          body.items,

        p_shipping_fee: 0
      }
    );

    if (rpcError) {
      console.error(
        "Order RPC error:",
        rpcError
      );

      return NextResponse.json(
        {
          error: rpcError.message
        },
        { status: 400 }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        {
          error:
            "Order was not created."
        },
        { status: 500 }
      );
    }

    /*
     * Order کا source save کریں۔
     */
    const {
      data: updatedOrder,
      error: updateError
    } = await supabase
      .from("orders")
      .update({
        order_channel: channel,

        whatsapp_sent:
          channel === "whatsapp",

        updated_at:
          new Date().toISOString()
      })
      .eq("id", orderId)
      .select("*")
      .single();

    if (updateError) {
      console.error(
        "Order channel update error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            updateError.message
        },
        { status: 400 }
      );
    }

    /*
     * Website order:
     * normal success response
     */
    if (channel === "website") {
      return NextResponse.json({
        success: true,
        orderId,
        order: updatedOrder
      });
    }

    /*
     * WhatsApp order:
     * Database میں save ہونے کے بعد
     * مکمل WhatsApp message تیار کریں۔
     */

    const {
      data: items,
      error: itemsError
    } = await supabase
      .from("order_items")
      .select(
        "product_name, quantity, price, subtotal"
      )
      .eq("order_id", orderId)
      .order("created_at", {
        ascending: true
      });

    if (itemsError) {
      return NextResponse.json(
        {
          error: itemsError.message
        },
        { status: 400 }
      );
    }

    const itemLines =
      (items ?? [])
        .map(
          (item, index) =>
            `${index + 1}. ${item.product_name}
Qty: ${item.quantity}
Price: Rs. ${Number(
              item.price || 0
            ).toLocaleString()}
Subtotal: Rs. ${Number(
              item.subtotal || 0
            ).toLocaleString()}`
        )
        .join("\n\n");

    const cleanWhatsapp =
      normalizeWhatsAppNumber(
        storeWhatsapp!
      );

    const message = `
🛍️ NEW ORDER

Store:
${storeName}

Order ID:
${orderId}

Customer:
${body.customer.name.trim()}

Phone:
${body.customer.phone.trim()}

Address:
${body.customer.address.trim()}

City:
${body.customer.city.trim()}

Products:

${itemLines}

Subtotal:
Rs. ${Number(
      updatedOrder.subtotal || 0
    ).toLocaleString()}

Shipping:
Rs. ${Number(
      updatedOrder.shipping_fee || 0
    ).toLocaleString()}

TOTAL:
Rs. ${Number(
      updatedOrder.total || 0
    ).toLocaleString()}

Payment:
Cash on Delivery

Order Source:
WhatsApp

Please confirm this order.
`.trim();

    const whatsappUrl =
      `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        message
      )}`;

    return NextResponse.json({
      success: true,
      orderId,
      order: updatedOrder,
      whatsappUrl
    });
  } catch (error) {
    console.error(
      "Order creation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create order."
      },
      { status: 500 }
    );
  }
}
