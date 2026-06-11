"use server";
import { cookies } from "next/headers";

export async function addProduct(formData: FormData) {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${process.env.API_URL}/products`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.json();
}
