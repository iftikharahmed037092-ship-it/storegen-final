import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

import type { OrderStatus } from "@/types/order";

const allowedStatuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled"
];

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const status =
      body?.status as OrderStatus;

    if (
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid order status."
        },
        {
          status: 400
        }
      );
    }

    const {
      data,
      error
    } = await supabase
      .from("orders")
      .update({
        status,
        updated_at:
          new Date().toISOString()
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message
        },
        {
          status: 400
        }
      );
    }

    return NextResponse.json({
      order: data
    });

  } catch (error) {
    console.error(
      "Order status update error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to update order."
      },
      {
        status: 500
      }
    );
  }
}
