import { supabase } from "./supabase";
import type { Page, PageData, EditorBlock } from "@/types/page";

function extractBlocks(value: any): EditorBlock[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value.content)) {
    return value.content;
  }

  if (Array.isArray(value.blocks)) {
    return value.blocks;
  }

  if (value.page_data) {
    return extractBlocks(value.page_data);
  }

  return [];
}

export async function getPageByStoreId(
  storeId: string
): Promise<Page | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("store_id", storeId)
    .eq("slug", "home")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  /*
   * Final source of truth = page_data
   *
   * لیکن پرانے records میں design content/blocks/data میں ہو سکتا ہے۔
   * اس لیے read کے وقت migration-compatible fallback رکھا گیا ہے۔
   */

  const pageDataBlocks = extractBlocks(data.page_data);

  let blocks = pageDataBlocks;

  if (blocks.length === 0) {
    blocks = extractBlocks(data.content);
  }

  if (blocks.length === 0) {
    blocks = extractBlocks(data.blocks);
  }

  if (blocks.length === 0) {
    blocks = extractBlocks(data.data);
  }

  return {
    ...data,
    page_data: {
      version: 1,
      content: blocks,
    },
  } as Page;
}

export async function savePage(
  storeId: string,
  pageData: PageData
): Promise<Page> {
  const blocks = pageData?.content || [];

  if (!Array.isArray(blocks) || blocks.length === 0) {
    throw new Error("Empty blocks");
  }

  const finalPageData: PageData = {
    version: 1,
    content: blocks,
  };

  const { data, error } = await supabase
    .from("pages")
    .upsert(
      {
        store_id: storeId,
        slug: "home",
        title: "Home",

        // FINAL EDITOR DATA
        page_data: finalPageData,

        // Keep legacy columns synchronized for compatibility
        content: finalPageData,
        blocks: blocks,
        data: blocks,

        published: true,
        is_published: true,

        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "store_id,slug",
      }
    )
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...data,
    page_data: finalPageData,
  } as Page;
}
