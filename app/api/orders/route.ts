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

  items: OrderRequestItem[];
}

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as OrderRequest;

    if (!body.storeId) {
      return NextResponse.json(
        {
          error: "Store ID is required."
        },
        {
          status: 400
        }
      );
    }

    if (!body.customer) {
      return NextResponse.json(
        {
          error:
            "Customer information is required."
        },
        {
          status: 400
        }
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
        {
          status: 400
        }
      );
    }

    if (
      body.paymentMethod !== "cod"
    ) {
      return NextResponse.json(
        {
          error:
            "Only Cash on Delivery is currently available."
        },
        {
          status: 400
        }
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
        {
          status: 400
        }
      );
    }


    /*
     * IMPORTANT
     *
     * Client سے price نہیں لی جا رہی۔
     *
     * Database RPC خود:
     *
     * Product
     * Price
     * Published status
     * Stock
     *
     * verify کرے گا۔
     */


    const { data, error } =
      await supabase.rpc(
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


    if (error) {
      console.error(
        "Order RPC error:",
        error
      );

      return NextResponse.json(
        {
          error:
            error.message
        },
        {
          status: 400
        }
      );
    }


    return NextResponse.json({
      success: true,
      orderId: data
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
      {
        status: 500
      }
    );
  }
}
