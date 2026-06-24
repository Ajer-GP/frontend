"use server";
import { cookies } from "next/headers";
import { GetRentalResult } from "../types";

export async function CreateRentRequest(
  productId: string,
  startDate: string,
  endDate: string,
  totalAmount: number,
) {
  if (!productId) {
    return { success: false, error: "معرّف المنتج مطلوب" };
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return { success: false, error: "يجب تسجيل الدخول أولاً" };
  }
  try {
    const url = `${process.env.API_BASE_URL}/requests/`;
    const payload = {
      productId: productId,
      startDate: startDate,
      endDate: endDate,
      totalAmount: totalAmount,
    };

    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      console.error("CreateRentRequest -> response not ok", {
        status: res.status,
        body: err,
      });
      let parsed = {};
      try {
        parsed = JSON.parse(err || "{}");
      } catch {}
      return {
        success: false,
        error: (parsed as any)?.message || err || "unknown error",
        status: res.status,
      };
    }

    const rentalRequest = await res.json();

    return { success: true, rentalRequest };
  } catch {
    return { success: false, error: "تعذر الاتصال بالخادم، حاول مجدداً" };
  }
}

export async function getOrderByIdAction(id: string): Promise<GetRentalResult> {
  if (!id) return { success: false, error: "معرّف الطلب مطلوب" };

  try {
    const cookieStore = await cookies();
    let token = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!token) {
      if (!refreshToken) {
        return { success: false, error: "يجب تسجيل الدخول أولاً" };
      }

      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/me`, {
        cache: "no-store",
      });

      // اقرأ الـ token تاني بعد الـ refresh
      const updatedCookies = await cookies();
      token = updatedCookies.get("access_token")?.value;

      if (!token) {
        return { success: false, error: "يجب تسجيل الدخول أولاً" };
      }
    }
    const res = await fetch(`${process.env.API_BASE_URL}/requests/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        success: false,
        error: res.status === 404 ? "الطلب غير موجود" : "فشل تحميل الطلب",
        status: res.status,
      };
    }

    const data = await res.json();
    return { success: true, rental: data.rental };
  } catch {
    return { success: false, error: "تعذر الاتصال بالخادم" };
  }
}

// في Rent.actions.ts

export async function acceptRentalAction(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(`${process.env.API_BASE_URL}/requests/${id}/accept`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { success: false, error: err?.message || "فشل القبول" };
  }

  return { success: true };
}

export async function rejectRentalAction(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(`${process.env.API_BASE_URL}/requests/${id}/reject`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { success: false, error: err?.message || "فشل الرفض" };
  }

  return { success: true };
}

export async function cancelRental(rentalId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return { success: false, message: "غير مصرح لك" };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/requests/${rentalId}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res.json();
    // const text = await res.text();
    if (!res.ok) {
      return {
        success: false,
        message: data?.error.message || "فشل الإلغاء، حاول مرة أخرى",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("cancelRental error:", error);
    return { success: false, message: "خطأ في الاتصال بالسيرفر" };
  }
}
// reviews.actions.ts
export async function submitReviewAction({
  productId,
  rating,
  comment,
}: {
  productId: string;
  rating: number;
  comment?: string;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  // console.log(rating, comment, "f");

  if (!token) {
    return { success: false, error: "غير مصرح" };
  }
  const res = await fetch(
    `${process.env.API_BASE_URL}/requests/${productId}/reviews`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
        ...(comment?.trim() && { comment }),
      }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    return { success: false, error: data.error.message ?? "حدث خطأ" };
  }

  return { success: true };
}
