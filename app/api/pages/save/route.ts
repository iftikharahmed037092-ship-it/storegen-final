import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const storeId = body.storeId || body.store_id;
    const pageData = body.pageData || body.page_data || body.content;

    const blocks = pageData?.content || pageData?.blocks || pageData || [];

    if (!storeId) {
      return NextResponse.json({ error: "storeId missing" }, { status: 400 });
    }

    const finalContent = Array.isArray(blocks) 
      ? { version: 1, content: blocks } 
      : blocks;

    const { error } = await supabase
      .from("pages")
      .upsert(
        {
          store_id: storeId,
          slug: "home",
          title: "Home",
          content: finalContent,
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
