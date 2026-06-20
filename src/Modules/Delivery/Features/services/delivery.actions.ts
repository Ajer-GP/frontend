"use server";

import { cookies } from "next/headers";
import { loginSchema } from "../Auth/schemas/delivery.validation";
export async function DeliveryLogin(prevState: any, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ZodErrors: parsed.error.flatten().fieldErrors };
  }

  const res = await fetch(`${process.env.API_BASE_URL}/delivery-reps/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const data = await res.json();

  if (!res.ok) return { message: data.message || "فشل تسجيل الدخول" };
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  // 1. Set access token — 15 min
  cookieStore.set("delivery_token", data.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // 3. User profile cookie — readable by JS for UI (not httpOnly)
  cookieStore.set("delivery", JSON.stringify(data.user), {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 15 days
  });

  return { success: true };
}

export async function getAllDeliveries() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("delivery_token")?.value;

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/delivery/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return { success: false, error: `HTTP error: ${res.status}` };
    }

    const data = await res.json();
    return { success: true, deliveryData: data };
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function getDeliveryById(id: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("delivery_token")?.value;
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/delivery/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      return { success: false, error: `HTTP error: ${res.status}` };
    }

    const data = await res.json();
    return { success: true, delivery: data.delivery };
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function startDelivery(deliveryId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("delivery_token")?.value;

  const res = await fetch(
    `${process.env.API_BASE_URL}/delivery/pick-up/on-the-way/${deliveryId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error.message ?? "فشل تحديث حالة التوصيل");
  }

  return await res.json();
}

export async function submitPickupForm(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("delivery_token")?.value;

  const id = formData.get("deliveryId") as string;

  // ابني الـ form data اللي هتتبعت للـ API
  const body = new FormData();

  const notes = formData.get("deliveryRepNotes");
  if (notes) body.append("deliveryRepNotes", notes as string);

  // كل الصور بـ key اسمه "images"
  const images = formData.getAll("images") as File[];
  for (const img of images) {
    body.append("images", img);
  }
  console.log(body);

  const res = await fetch(
    `${process.env.API_BASE_URL}/delivery/owner-pick-up-form/${id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // مش بنحط Content-Type — fetch بيحطها لوحده مع boundary لما في FormData
      },
      body,
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error.message ?? "فشل إرسال نموذج الاستلام");
  }

  return await res.json();
}
export async function submitReturnPickupForm(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("delivery_token")?.value;

  const id = formData.get("deliveryId") as string;

  const body = new FormData();

  const notes = formData.get("deliveryRepNotes");
  if (notes) body.append("deliveryRepNotes", notes as string);

  const checkedItems = formData.get("checkedItems");
  if (checkedItems) body.append("checkedItems", checkedItems as string);

  const images = formData.getAll("images") as File[];
  for (const img of images) {
    body.append("images", img);
  }

  const res = await fetch(
    `${process.env.API_BASE_URL}/delivery/pick-up-form/${id}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body,
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error.message ?? "فشل إرسال نموذج الاستلام");
  }

  return await res.json();
}
