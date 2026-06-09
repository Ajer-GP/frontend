"use server";
import { cookies } from "next/headers";

export async function CreateRentRequest(
  productId,
  startDate,
  endDate,
  totalAmount,
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
        error: parsed?.message || err || "unknown error",
        status: res.status,
      };
    }

    const rentalRequest = await res.json();
    console.log("CreateRentRequest -> success", rentalRequest);
    return { success: true, rentalRequest };
  } catch {
    return { success: false, error: "تعذر الاتصال بالخادم، حاول مجدداً" };
  }
}
