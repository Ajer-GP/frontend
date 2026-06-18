// confirmDeliveryArrival.action.ts
"use server";
import { cookies } from "next/headers";

export async function confirmDeliveryArrival(orderId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(
    `${process.env.API_BASE_URL}/requests/${orderId}/confirm-delivery-arrival`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.error.message || "فشل إرسال OTP");
  }

  return res.json();
}
