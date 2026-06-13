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

    console.log("CreateRentRequest -> sending", { url, payload });

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
    console.log(
      "CreateRentRequest -> success",
      rentalRequest.rentalRequest.rentalRequest,
    );
    return { success: true, rentalRequest };
  } catch {
    return { success: false, error: "تعذر الاتصال بالخادم، حاول مجدداً" };
  }
}

export async function getOrderByIdAction(id: string): Promise<GetRentalResult> {
  if (!id) return { success: false, error: "معرّف الطلب مطلوب" };

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

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
