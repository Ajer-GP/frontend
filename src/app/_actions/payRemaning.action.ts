"use server";
import { cookies } from "next/headers";

export async function payRemaining(orderId: string, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(
    `${process.env.API_BASE_URL}/requests/${orderId}/pay-remaining`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    console.error("payRemaining error:", errBody);
    throw new Error(errBody?.error.message || "فشل الدفع");
  }

  return res.json();
}
