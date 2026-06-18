// getPaymentStatus.action.ts
"use server";
import { cookies } from "next/headers";

export async function getPaymentStatus(orderId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(
    `${process.env.API_BASE_URL}/requests/${orderId}/payment-status`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.error.message || "فشل جلب حالة الدفع");
  }

  return res.json();
}
