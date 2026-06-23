"use server";
import { cookies } from "next/headers";

export async function createStripeIntentRemaining(orderId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(
    `${process.env.API_BASE_URL}/requests/${orderId}/pay-remaining`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentMethod: "credit_card",
      }),
    },
  );

  const data = await res.json();

  return data.clientSecret as string;
}
