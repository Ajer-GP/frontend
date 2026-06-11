"use server";
import { cookies } from "next/headers";

export async function payDepositInstapay(orderId: string, formData: FormData) {
  const token = cookies().get("token")?.value;

  const res = await fetch(
    `${process.env.API_URL}/requests/deposit/${orderId}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData, // payment_method + screenshot
    },
  );

  if (!res.ok) throw new Error("فشل الدفع");
  return res.json();
}
