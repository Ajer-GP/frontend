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

export type Product = {
  _id: string;
  title: string;
  description: string;
  name: string;
  category: string;
  condition: "excellent" | "good" | "fair" | "poor";
  pricePerHour: number;
  pricePerDay: number;
  pricePerWeek: number;
  insuranceAmount: number;
  coverImage: {
    url: string;
    publicId: string;
  };
  rating: number | null;
  usingCondition?: string;
  handlingNotes?: string;
  images?: { url: string; publicId: string }[];
};

export type Pagination = {
  total: number;
  page: number;
  pages: number;
  limit: number;
};

// export type ProductsResponse = {
//   products: Product[];
//   pagination: Pagination;
// };

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

export type ProductResponse = {
  status: string;
  product: Product;
};
