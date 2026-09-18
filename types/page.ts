export type BlockType =
  | "Header"
  | "Hero"
  | "Products"
  | "Features"
  | "WhatsAppOrder"
  | "Contact"
  | "Footer";

export interface EditorBlock {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
}

export interface PageData {
  version: number;
  content: EditorBlock[];
}

export interface Page {
  id: string;
  store_id: string;
  page_data: PageData;
  updated_at: string;
}
