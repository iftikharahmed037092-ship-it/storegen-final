import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { storeId, pageData } = await req.json();
    if (!storeId || !pageData?.content) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }
    
    const blocksArray = pageData.content;
    if (!Array.isArray(blocksArray) || blocksArray.length === 0) {
      return NextResponse.json({ error: "Cannot save empty design" }, { status: 400 });
    }

    const supabase = supabaseAdmin();

    // Save in all columns to fix old structure
    const payload = {
      store_id: storeId,
      slug: "home",
      title: "Home",
      content: { blocks: blocksArray },
      blocks: blocksArray,
      data: blocksArray,
      is_published: true,
      published: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("pages")
      .upsert(payload, { onConflict: "store_id,slug" });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
