export type Category =
  | "cable"
  | "valve"
  | "pipe"
  | "metal"
  | "other";

export type ProductUnit = "м" | "шт" | "кг" | "м²" | "т" | "л";

export type ProductSource = "stock" | "factory";

export interface TechSpec {
  label: string;
  value: string;
}

export interface Supplier {
  name: string;
  verified: boolean;
  innChecked: boolean;
  yearsOnMarket: number;
}

export interface Product {
  id: number;
  name: string;
  manufacturer: string;
  category: Category;
  unit: ProductUnit;
  quantity: number;
  quantityDescription: string;
  packaging?: string;
  location: string;
  region: string;
  marketPrice: number;
  liquidationPrice: number;
  reserved: boolean;
  reservedByMe?: boolean;
  reserveId?: string;
  hasCertificate: boolean;
  shipping: string;
  verifiedAt: string;
  techSpecs: TechSpec[];
  source: ProductSource;
  supplier: Supplier;
  minOrder?: number;
  leadTime?: string;
}

export interface Region {
  id: string;
  label: string;
}
