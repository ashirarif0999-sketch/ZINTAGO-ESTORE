import productData from './products.json';

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  helpful?: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string | string[];
  type: string;
  color: string;
  description: string;
  specs: Record<string, string>;
  material?: string;
  brand?: string;
  sku?: string;
  stockStatus?: string;
  stockQuantity?: number;
  dimensions?: Record<string, string>;
  weight?: string;
  deliveryTiming?: string;
  rating?: number;
  reviews?: number;
  reviewDetails?: Review[];
  companyInfo?: {
    description: string;
    founded: string;
    employees: string;
    certifications: string[];
    exportHistory: string;
  };
  orders?: number;
  freeShipping?: boolean;
  priceTiers?: { range: string; price: number }[];
  supplier?: { name: string; location: string; verified: boolean; shipping: string };
  detailsTable?: Record<string, string>;
  features?: string[];
  images?: string[];
}

export const PRODUCTS: Product[] = productData.products;
export const FEATURED_PRODUCTS = PRODUCTS.slice(0, 8);
