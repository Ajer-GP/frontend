"use server";
import { cookies } from "next/headers";

type Address = {
  street: string;
  floor: string;
  apartment: string;
  landmark: string;
  building: string;
};

export async function createStripeIntent(orderId: string, address: Address) {
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
      body: JSON.stringify({
        payment_method: "credit_card",
        location: address,
      }),
    },
  );

  const data = await res.json();
  // console.log(data);

  return data.data.clientSecret as string;
}
