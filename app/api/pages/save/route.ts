import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { storeId, pageData } = await req.json();
    const blocks = pageData?.content || [];

    if (!storeId || !Array.isArray(blocks) || blocks.length === 0) {
      return NextResponse.json({ error: "Empty data" }, { status: 400 });
    }

    const { error } = await supabase
      .from("pages")
      .upsert(
        {
          store_id: storeId,
          slug: "home",
          title: "Home",
          content: { blocks: blocks },
          page_data: pageData,
          blocks: blocks,
          data: blocks,
          is_published: true,
          published: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "store_id,slug" }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
