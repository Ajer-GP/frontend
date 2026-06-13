"use server";
import { cookies } from "next/headers";

export async function payDepositInstapay(orderId: string, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(
    `${process.env.API_BASE_URL}/requests/deposit/${orderId}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );

  if (!res.ok) throw new Error("فشل الدفع");
  return res.json();
}
