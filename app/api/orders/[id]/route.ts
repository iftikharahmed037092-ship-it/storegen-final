import { NextResponse } from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import {
  canManageStore,
} from "@/lib/creator-auth";

import type {
  OrderStatus,
} from "@/types/order";

const allowedStatuses:
  OrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  { params }: RouteProps
) {
  const { id } =
    await params;

  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      {
        error:
          "Order not found.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    order: data,
  });
}

export async function PATCH(
  request: Request,
  { params }: RouteProps
) {
  try {
    const { id } =
      await params;

    const body =
      await request.json();

    const status =
      body?.status as OrderStatus;

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid order status.",
        },
        { status: 400 }
      );
    }

    const {
      data: existing,
    } =
      await supabaseAdmin
        .from("orders")
        .select(
          "id,store_id"
        )
        .eq("id", id)
        .maybeSingle();

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Order not found.",
        },
        { status: 404 }
      );
    }

    const access =
      await canManageStore(
        existing.store_id
      );

    if (!access.allowed) {
      return NextResponse.json(
        {
          error:
            "Forbidden",
        },
        { status: 403 }
      );
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from("orders")
        .update({
          status,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
      return NextResponse.json(
        {
          error:
            error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      order: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update order.",
      },
      { status: 500 }
    );
  }
}
