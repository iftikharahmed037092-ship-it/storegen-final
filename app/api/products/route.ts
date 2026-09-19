import { NextRequest, NextResponse } from "next/server";
import {
  createProduct,
  getProductsByStoreId
} from "@/lib/products";

export async function GET(
  request: NextRequest
) {
  try {
    const storeId =
      request.nextUrl.searchParams.get(
        "storeId"
      );

    if (!storeId) {
      return NextResponse.json(
        {
          error: "storeId is required."
        },
        {
          status: 400
        }
      );
    }

    const products =
      await getProductsByStoreId(
        storeId
      );

    return NextResponse.json({
      products
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load products."
      },
      {
        status: 500
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const {
      storeId,
      name,
      price,
      imageUrl
    } = body;

    if (
      typeof storeId !== "string" ||
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "storeId and name are required."
        },
        {
          status: 400
        }
      );
    }

    const numericPrice =
      Number(price);

    if (
      !Number.isFinite(
        numericPrice
      ) ||
      numericPrice < 0
    ) {
      return NextResponse.json(
        {
          error:
            "A valid price is required."
        },
        {
          status: 400
        }
      );
    }

    const product =
      await createProduct({
        store_id: storeId,
        name: name.trim(),
        price: Math.round(
          numericPrice
        ),
        image_url:
          typeof imageUrl ===
          "string"
            ? imageUrl.trim()
            : undefined
      });

    return NextResponse.json(
      {
        success: true,
        product
      },
      {
        status: 201
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create product."
      },
      {
        status: 500
      }
    );
  }
}
