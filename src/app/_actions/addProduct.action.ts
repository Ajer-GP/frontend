"use server";
import { cookies } from "next/headers";

type AddProductResult =
  | { success: true; data: unknown }
  | { success: false; error: string; details?: { field: string; message: string }[] };

export async function addProduct(formData: FormData): Promise<AddProductResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!token) {
    return { success: false, error: "يجب تسجيل الدخول أولاً" };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/products/`, {
      method: "POST",
      headers: {
        Cookie: `refresh_token=${refreshToken ?? ""}`,
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data?.error?.message || data?.message || "فشل نشر المنتج",
        details: data?.error?.details,
      };
    }

    return { success: true, data };
  } catch {
    return { success: false, error: "تعذر الاتصال بالخادم، حاول مجدداً" };
  }
}
