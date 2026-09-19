import { NextRequest, NextResponse } from "next/server";
import { createProduct, getProductsByStoreId } from "@/lib/products";

export async function GET(request: NextRequest) {
  try {
    const storeId = request.nextUrl.searchParams.get("storeId");
    if (!storeId) return NextResponse.json({ error: "storeId is required" }, { status: 400 });
    const products = await getProductsByStoreId(storeId);
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.store_id) return NextResponse.json({ error: "store_id is required" }, { status: 400 });
    if (!body.name?.trim()) return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) return NextResponse.json({ error: "Invalid price" }, { status: 400 });

    const product = await createProduct({
      store_id: body.store_id,
      name: body.name.trim(),
      price,
      old_price: body.old_price === "" ? null : Number(body.old_price || 0),
      image_url: body.image_url || null,
      description: body.description || null,
      stock: Number(body.stock || 0),
      sku: body.sku || null,
      published: typeof body.published === "boolean" ? body.published : true
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create product" }, { status: 500 });
  }
}
