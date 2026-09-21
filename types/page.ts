export type BlockType =
  | "Header"
  | "Hero"
  | "Products"
  | "Features"
  | "WhatsAppOrder"
  | "Contact"
  | "Footer";

export type DeviceType =
  | "desktop"
  | "tablet"
  | "mobile";

export interface BlockStyle {
  backgroundColor?: string;
  textColor?: string;

  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;

  marginTop?: number;
  marginBottom?: number;

  maxWidth?: number;

  textAlign?:
    | "left"
    | "center"
    | "right";
}

export interface EditorBlock {
  id: string;
  type: BlockType;

  props: Record<
    string,
    unknown
  >;

  style?: BlockStyle;

  hidden?: boolean;
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
