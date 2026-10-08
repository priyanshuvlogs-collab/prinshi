export type Category = "Tee" | "Hoodie" | "Knit" | "Jogger";
export type PrintType = "Puff" | "Screen" | "Embroidery" | "Wash";
export type Placement = "Front" | "Back" | "Front and back";
export type StockState = "in_stock" | "sold_out" | "coming_soon";
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export const CATEGORIES: Category[] = ["Tee", "Hoodie", "Knit", "Jogger"];
export const PRINT_TYPES: PrintType[] = ["Puff", "Screen", "Embroidery", "Wash"];
export const PLACEMENTS: Placement[] = ["Front", "Back", "Front and back"];
export const STOCK_STATES: StockState[] = ["in_stock", "sold_out", "coming_soon"];
export const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

export interface SizeRow {
  size: Size;
  chest_cm: number;
  length_cm: number;
  shoulder_cm: number;
}

export interface DropImage {
  src: string;
  alt: string;
  /** Mockups must be labelled as mockups, never shown as product photos. */
  mockup?: boolean;
}

export interface Drop {
  id: string;
  slug: string;
  name: string;
  category: Category;
  colour: string;
  /** Short design description shown on the card and product page. */
  design: string;
  print_type: PrintType | null;
  placement: Placement | null;
  fabric: string | null; // e.g. "100% cotton, 400 GSM"
  gsm: number | null;
  fit: string | null; // e.g. "Oversized, drop shoulder"
  care: string | null;
  made_in: string; // "Ludhiana, India"
  price_inr: number | null;
  price_cad: number | null;
  stock_state: StockState;
  sizes: Size[];
  size_chart: SizeRow[];
  model_height_cm: number | null;
  model_size: Size | null;
  expected_month: string | null; // only for coming_soon
  images: DropImage[];
  /** True while the entry is sample content. Shown with a visible banner. */
  sample: boolean;
  created_at: string;
  updated_at: string;
}

export interface Signup {
  id: string;
  email: string;
  whatsapp: string | null;
  product_id: string;
  size: Size;
  country: "IN" | "CA";
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  consent_email: boolean;
  consent_email_at: string | null;
  consent_whatsapp: boolean;
  consent_whatsapp_at: string | null;
  /** Double opt-in: set when the confirm link is opened. */
  email_confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
}

export interface Poll {
  id: string;
  title: string;
  options: { id: string; label: string; image: string | null }[]; // up to 3
  closes_at: string;
  created_at: string;
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  email: string;
  created_at: string;
}

export interface DropCounts {
  product_id: string;
  signups: number;
  confirmed: number;
}
