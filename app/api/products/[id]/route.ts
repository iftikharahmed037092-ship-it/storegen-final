import { NextRequest, NextResponse } from "next/server";
import { deleteProduct, updateProduct } from "@/lib/products";

interface RouteContext { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const product = await updateProduct(id, {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.price !== undefined && { price: Number(body.price) }),
      ...(body.old_price !== undefined && { old_price: body.old_price === null || body.old_price === "" ? null : Number(body.old_price) }),
      ...(body.image_url !== undefined && { image_url: body.image_url }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.stock !== undefined && { stock: Number(body.stock) }),
      ...(body.sku !== undefined && { sku: body.sku }),
      ...(body.published !== undefined && { published: Boolean(body.published) })
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete product" }, { status: 500 });
  }
}
