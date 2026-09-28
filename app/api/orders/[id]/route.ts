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


/*
 * GET
 *
 * Order Success page اور دوسرے customer pages
 * اس endpoint سے order details لے سکتے ہیں۔
 */

export async function GET(
  request: Request,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

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

    const {
      data: order,
      error
    } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

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

    return NextResponse.json({
      order
    });

  } catch (error) {
    console.error(
      "Order GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to get order."
      },
      {
        status: 500
      }
    );
  }
}


/*
 * PATCH
 *
 * Admin order status update
 */

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
