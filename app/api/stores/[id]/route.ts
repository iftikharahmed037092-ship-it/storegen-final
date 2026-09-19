import {
  NextResponse
} from "next/server";

import {
  deleteStore,
  updateStore
} from "@/lib/stores";


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

    const { id } =
      await params;

    const body =
      await request.json();

    if (
      body.store_name !==
      undefined &&
      !String(
        body.store_name
      ).trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Store name is required."
        },
        {
          status: 400
        }
      );
    }


    if (
      body.slug !==
      undefined &&
      !String(
        body.slug
      ).trim()
    ) {
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


    const shippingFee =
      body.shipping_fee ===
      undefined
        ? undefined
        : Number(
            body.shipping_fee
          );


    if (
      shippingFee !==
        undefined &&
      (!Number.isFinite(
        shippingFee
      ) ||
        shippingFee < 0)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid shipping fee."
        },
        {
          status: 400
        }
      );
    }


    const store =
      await updateStore(
        id,
        {
          store_name:
            body.store_name !==
            undefined
              ? String(
                  body.store_name
                ).trim()
              : undefined,

          slug:
            body.slug !==
            undefined
              ? String(
                  body.slug
                )
                  .trim()
                  .toLowerCase()
              : undefined,

          custom_domain:
            body.custom_domain ??
            undefined,

          logo_url:
            body.logo_url ??
            undefined,

          primary_color:
            body.primary_color ??
            undefined,

          whatsapp_number:
            body.whatsapp_number ??
            undefined,

          shipping_fee:
            shippingFee,

          is_active:
            body.is_active ??
            undefined
        }
      );


    return NextResponse.json({
      store
    });

  } catch (error) {

    console.error(
      "Store update error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update store."
      },
      {
        status: 500
      }
    );
  }
}


export async function DELETE(
  _request: Request,
  { params }: RouteProps
) {

  try {

    const { id } =
      await params;

    await deleteStore(id);

    return NextResponse.json({
      success: true
    });

  } catch (error) {

    console.error(
      "Store delete error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete store."
      },
      {
        status: 500
      }
    );
  }
}
