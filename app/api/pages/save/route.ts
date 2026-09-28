import { NextResponse } from "next/server";
import { savePage } from "@/lib/pages";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const storeId = String(
      body.storeId ??
      body.store_id ??
      ""
    ).trim();

    if (!storeId) {
      return NextResponse.json(
        {
          error: "storeId is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Editor normally sends:
     *
     * {
     *   storeId,
     *   pageData: {
     *     version: 1,
     *     content: [...]
     *   }
     * }
     */

    let pageData =
      body.pageData ??
      body.page_data ??
      null;

    /*
     * Legacy/mobile compatibility
     */

    if (!pageData) {
      if (Array.isArray(body.content)) {
        pageData = {
          version: 1,
          content: body.content,
        };
      } else if (Array.isArray(body.blocks)) {
        pageData = {
          version: 1,
          content: body.blocks,
        };
      } else if (Array.isArray(body.data)) {
        pageData = {
          version: 1,
          content: body.data,
        };
      }
    }

    /*
     * اگر pageData direct array آ جائے
     */

    if (Array.isArray(pageData)) {
      pageData = {
        version: 1,
        content: pageData,
      };
    }

    /*
     * اگر nested format ہو
     */

    if (
      pageData &&
      typeof pageData === "object" &&
      !Array.isArray(pageData)
    ) {
      if (
        !Array.isArray(pageData.content) &&
        Array.isArray(pageData.blocks)
      ) {
        pageData = {
          version: 1,
          content: pageData.blocks,
        };
      }
    }

    const blocks =
      pageData?.content;

    if (
      !Array.isArray(blocks) ||
      blocks.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "No editor blocks were received.",
        },
        {
          status: 400,
        }
      );
    }

    const savedPage = await savePage(
      storeId,
      {
        version: 1,
        content: blocks,
      }
    );

    return NextResponse.json({
      success: true,
      savedCount: blocks.length,
      pageId: savedPage.id,
      pageData: savedPage.page_data,
    });
  } catch (error) {
    console.error(
      "PAGE_SAVE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save page.",
      },
      {
        status: 500,
      }
    );
  }
}
