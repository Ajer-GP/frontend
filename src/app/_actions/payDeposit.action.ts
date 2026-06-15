"use server";
import { cookies } from "next/headers";

type Address = {
  street: string;
  floor: string;
  apartment: string;
  landmark: string;
  building: string;
};

export async function payDepositInstapay(
  orderId: string,
  formData: FormData,
  address: Address,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  // ضيف العنوان على الـ FormData الجاية
  formData.append("location", JSON.stringify(address));
  const res = await fetch(
    `${process.env.API_BASE_URL}/requests/deposit/${orderId}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    console.error("payDepositInstapay error:", errBody);
    throw new Error(errBody?.message || "فشل الدفع");
  }

  return res.json();
}
