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

export type ProductImage = {
  url: string;
  publicId: string;
};

export type Owner = {
  _id: string;
  fullName: string;
  isVerified: boolean;
  isActive: boolean;
  rating: number | null;
};

export type Spec = {
  title: string;
  value: string;
};

export type Product = {
  _id: string;
  title: string;
  name: string;
  description: string;
  category: string;
  condition: "new" | "like_new" | "good" | "fair" | "poor";
  specs: Spec[];
  accessories: string[];
  checklist: string[];
  handlingNotes: string;
  usage: string;
  coverImage: ProductImage;
  images: ProductImage[];
  pricePerHour: number;
  pricePerDay: number;
  pricePerWeek: number;
  insuranceAmount: number;
  location: string;
  owner: Owner;
  rating: number | null;
  successfulRentals: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  search?: string;
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type ProductResponse = {
  status: string;
  product: Product;
};
