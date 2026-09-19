import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest
) {
  try {
    const formData =
      await request.formData();

    const file =
      formData.get("file");

    const storeId =
      formData.get("storeId");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Image file is required"
        },
        {
          status: 400
        }
      );
    }

    if (
      typeof storeId !== "string" ||
      !storeId
    ) {
      return NextResponse.json(
        {
          error: "storeId is required"
        },
        {
          status: 400
        }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error:
            "Only image files are allowed"
        },
        {
          status: 400
        }
      );
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error:
            "Image must be 5MB or smaller"
        },
        {
          status: 400
        }
      );
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const safeExtension =
      /^[a-z0-9]+$/.test(extension)
        ? extension
        : "jpg";

    const fileName =
      `${crypto.randomUUID()}.${safeExtension}`;

    const filePath =
      `${storeId}/${fileName}`;

    const arrayBuffer =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(arrayBuffer);

    const { error } =
      await supabase.storage
        .from("product-images")
        .upload(
          filePath,
          buffer,
          {
            contentType:
              file.type,
            upsert: false
          }
        );

    if (error) {
      throw new Error(
        error.message
      );
    }

    const {
      data: publicUrlData
    } =
      supabase.storage
        .from("product-images")
        .getPublicUrl(
          filePath
        );

    return NextResponse.json({
      success: true,
      url:
        publicUrlData.publicUrl,
      path: filePath
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Image upload failed"
      },
      {
        status: 500
      }
    );
  }
}
