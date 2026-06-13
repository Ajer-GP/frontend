"use server";
import { cookies } from "next/headers";

export async function addProduct(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const res = await fetch(`${process.env.API_URL}/products`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.json();
}
