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
        { error: "Store ID is required." },
        { status: 400 }
      );
    }

    if (!body.customer) {
      return NextResponse.json(
        { error: "Customer information is required." },
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

    if (
      body.paymentMethod !== "cod"
    ) {
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
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const productIds = body.items.map(
      (item) => item.productId
    );

    const { data: products, error: productsError } =
      await supabase
        .from("products")
        .select(
          "id, store_id, name, price, stock, published, image_url"
        )
        .eq("store_id", body.storeId)
        .in("id", productIds);

    if (productsError) {
      throw new Error(productsError.message);
    }

    if (!products || products.length !== productIds.length) {
      return NextResponse.json(
        {
          error:
            "One or more products are no longer available."
        },
        { status: 400 }
      );
    }

    let subtotal = 0;

    const orderItems = [];

    for (const requestedItem of body.items) {
      const quantity = Number(
        requestedItem.quantity
      );

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid product quantity."
          },
          { status: 400 }
        );
      }

      const product = products.find(
        (item) =>
          item.id === requestedItem.productId
      );

      if (!product) {
        return NextResponse.json(
          {
            error:
              "Product not found."
          },
          { status: 400 }
        );
      }

      if (!product.published) {
        return NextResponse.json(
          {
            error:
              `${product.name} is not available.`
          },
          { status: 400 }
        );
      }

      if (product.stock < quantity) {
        return NextResponse.json(
          {
            error:
              `${product.name} does not have enough stock.`
          },
          { status: 400 }
        );
      }

      const itemSubtotal =
        product.price * quantity;

      subtotal += itemSubtotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity,
        image_url: product.image_url,
        subtotal: itemSubtotal
      });
    }

    const shippingFee = 0;
    const total = subtotal + shippingFee;

    const { data: order, error: orderError } =
      await supabase
        .from("orders")
        .insert({
          store_id: body.storeId,

          customer_name:
            body.customer.name.trim(),

          customer_phone:
            body.customer.phone.trim(),

          customer_address:
            body.customer.address.trim(),

          customer_city:
            body.customer.city.trim(),

          payment_method: "cod",
          status: "pending",

          subtotal,
          shipping_fee: shippingFee,
          total,

          whatsapp_sent: false
        })
        .select("id")
        .single();

    if (orderError) {
      throw new Error(orderError.message);
    }

    const itemsWithOrderId =
      orderItems.map((item) => ({
        ...item,
        order_id: order.id
      }));

    const { error: itemsError } =
      await supabase
        .from("order_items")
        .insert(itemsWithOrderId);

    if (itemsError) {
      await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      throw new Error(itemsError.message);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      subtotal,
      shippingFee,
      total
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
