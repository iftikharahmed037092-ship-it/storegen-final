import { NextRequest, NextResponse } from "next/server";
import { savePage } from "@/lib/pages";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const storeId = body?.storeId;
    const pageData = body?.pageData;

    if (
      typeof storeId !== "string" ||
      !pageData ||
      typeof pageData !== "object"
    ) {
      return NextResponse.json(
        {
          error:
            "storeId and pageData are required."
        },
        { status: 400 }
      );
    }

    const page = await savePage(
      storeId,
      pageData
    );

    return NextResponse.json({
      success: true,
      page
    });
  } catch (error) {
    console.error(
      "SAVE_PAGE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save page."
      },
      { status: 500 }
    );
  }
}
