import { NextResponse } from "next/server";

import { getStoreBySlug } from "@/lib/stores";
import { getCustomerOrders } from "@/lib/orders";

export async function GET(
  request: Request
) {

  try {

    const url =
      new URL(request.url);


    const storeSlug =
      url.searchParams.get(
        "storeSlug"
      );

    const phone =
      url.searchParams.get(
        "phone"
      );


    if (!storeSlug) {
      return NextResponse.json(
        {
          error:
            "Store slug is required."
        },
        {
          status: 400
        }
      );
    }


    if (!phone?.trim()) {
      return NextResponse.json(
        {
          error:
            "Phone number is required."
        },
        {
          status: 400
        }
      );
    }


    const store =
      await getStoreBySlug(
        storeSlug
      );


    if (!store) {
      return NextResponse.json(
        {
          error:
            "Store not found."
        },
        {
          status: 404
        }
      );
    }


    const orders =
      await getCustomerOrders(
        store.id,
        phone.trim()
      );


    return NextResponse.json({
      orders
    });

  } catch (error) {

    console.error(
      "Order lookup error:",
      error
    );


    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to find orders."
      },
      {
        status: 500
      }
    );
  }
}
