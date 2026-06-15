"use server";

import {
  ActionResult,
  GetProductsParams,
  Product,
  ProductResponse,
  ProductsResponse,
} from "../types/products.typs";

// ─── helpers ──────────────────────────────────────────────────────────────────

function buildQuery(params: GetProductsParams): string {
  const query = new URLSearchParams();

  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.period) query.set("period", params.period);
  if (params.minPrice !== undefined)
    query.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined)
    query.set("maxPrice", String(params.maxPrice));
  if (params.condition) query.set("condition", params.condition);
  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);

  return query.toString() ? `?${query.toString()}` : "";
}

// ─── Get paginated / filtered products ────────────────────────────────────────

export async function getProductsAction(
  params: GetProductsParams = {},
): Promise<ActionResult<ProductsResponse>> {
  try {
    const qs = buildQuery({ page: 1, limit: 12, ...params });

    const res = await fetch(`${process.env.API_BASE_URL}/products${qs}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: err?.message || " .فشل تحميل المنتجات",
      };
    }

    const data: ProductsResponse = await res.json();
    // console.log(data);

    return { success: true, data };
  } catch {
    return { success: false, error: "تعذر الاتصال بالخادم، حاول مجدداً" };
  }
}

// ─── Get single product by ID ─────────────────────────────────────────────────

export async function getProductByIdAction(
  id: string,
): Promise<ActionResult<ProductResponse>> {
  if (!id) {
    return { success: false, error: "معرّف المنتج مطلوب" };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/products/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error:
          res.status === 404
            ? "المنتج غير موجود"
            : err?.message || "فشل تحميل المنتج",
      };
    }

    const data: ProductResponse = await res.json();
    console.log(data);

    return { success: true, data };
  } catch {
    return { success: false, error: "تعذر الاتصال بالخادم، حاول مجدداً" };
  }
}
