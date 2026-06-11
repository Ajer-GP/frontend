"use server";
import { cookies } from "next/headers";

export async function createStripeIntent(orderId: string) {
  const token = cookies().get("token")?.value;

  const res = await fetch(
    `${process.env.API_URL}/requests/deposit/${orderId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payment_method: "stripe" }),
    },
  );

  const data = await res.json();
  return data.clientSecret as string; // الـ backend يرجع clientSecret
}
