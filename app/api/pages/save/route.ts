import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // موبائل سے جو بھی آ رہا ہے، سب پکڑ لو
    const storeId = body.storeId || body.store_id;
    let blocks = body.pageData || body.page_data || body.content || body.blocks || body.data || [];

    // اگر pageData {content: [...]} کی شکل میں ہے
    if (blocks && typeof blocks === 'object' && !Array.isArray(blocks)) {
      if (Array.isArray(blocks.content)) blocks = blocks.content;
      else if (Array.isArray(blocks.blocks)) blocks = blocks.blocks;
    }

    if (!storeId) {
      return NextResponse.json({ error: "storeId missing" }, { status: 400 });
    }
    if (!Array.isArray(blocks) || blocks.length === 0) {
      return NextResponse.json({ error: "Empty blocks received" }, { status: 400 });
    }

    const finalContent = { version: 1, content: blocks };

    // دونوں کالم میں ایک ہی چیز سیو کریں گے تاکہ Editor کو مل جائے
    const { error } = await supabase
      .from("pages")
      .upsert({
        store_id: storeId,
        slug: "home",
        title: "Home",
        content: finalContent,
        page_data: finalContent, 
        blocks: blocks,
        data: blocks,
        updated_at: new Date().toISOString(),
      }, { onConflict: "store_id,slug" });

    if (error) throw error;

    return NextResponse.json({ success: true, savedCount: blocks.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
