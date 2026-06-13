"use server";
import { cookies } from "next/headers";

export async function createStripeIntent(orderId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const res = await fetch(
    `${process.env.API_BASE_URL}/requests/deposit/${orderId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payment_method: "credit_card" }),
    },
  );

  const data = await res.json();
  return data.clientSecret as string; // الـ backend يرجع clientSecret
}
