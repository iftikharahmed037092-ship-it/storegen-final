import { NextResponse } from "next/server";
import { createProduct, getProductsByStoreId } from "@/lib/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId") ?? searchParams.get("store_id");
    if (!storeId) {
      return NextResponse.json({ error: "storeId is required." }, { status: 400 });
    }
    const products = await getProductsByStoreId(storeId);
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load products." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const storeId = String(
      body.store_id ?? body.storeId ?? searchParams.get("storeId") ?? searchParams.get("store_id") ?? ""
    ).trim();
    const name = String(body.name ?? "").trim();
    const price = Number(body.price);

    if (!storeId) {
      return NextResponse.json({ error: "store_id is required." }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Price must be valid." }, { status: 400 });
    }

    const product = await createProduct({
      store_id: storeId,
      category_id: body.category_id ?? null,
      name,
      price,
      old_price: body.old_price ?? null,
      image_url: body.image_url ?? null,
      image_urls: Array.isArray(body.image_urls) ? body.image_urls : [],
      description: body.description ?? null,
      stock: Number(body.stock ?? 0),
      sku: body.sku ?? null,
      published: body.published ?? true
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create product." }, { status: 500 });
  }
}
