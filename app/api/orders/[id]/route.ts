import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteProps
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Order ID is required."
        },
        {
          status: 400
        }
      );
    }


    const { data: order, error: orderError } =
      await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .maybeSingle();


    if (orderError) {
      throw new Error(
        orderError.message
      );
    }


    if (!order) {
      return NextResponse.json(
        {
          error: "Order not found."
        },
        {
          status: 404
        }
      );
    }


    const { data: items, error: itemsError } =
      await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", id)
        .order("id", {
          ascending: true
        });


    if (itemsError) {
      throw new Error(
        itemsError.message
      );
    }


    return NextResponse.json({
      order,
      items: items ?? []
    });

  } catch (error) {

    console.error(
      "Order fetch error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load order."
      },
      {
        status: 500
      }
    );
  }
}
