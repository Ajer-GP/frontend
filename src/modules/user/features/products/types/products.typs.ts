export type ProductCondition = "excellent" | "good" | "fair";
export type ProductPeriod = "hour" | "day" | "week" | "month";

export type ProductCategory =
  | "cameras"
  | "laptops"
  | "tablets"
  | "gaming"
  | "audio"
  | "electronics"
  | "clothes"
  | "books"
  | "drones"
  | "lighting"
  | "party tools"
  | "other";

export interface Product {
  _id: string;
  title: string;
  description: string;
  pricePerDay: number;
  pricePerWeek?: number;
  insuranceAmount?: number;
  condition: ProductCondition;
  category: ProductCategory;
  coverImage: {
    url: string;
    publicId: string;
  };
  rating: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  result: {
    products: Product[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  period?: ProductPeriod;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  category?: string;
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
