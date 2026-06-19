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
  if (!res.ok) return { message: data.error.message || "فشل تسجيل الدخول" };
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

  return { success: true, deliveryPerson: data };
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
      next: { revalidate: 60 },
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

export async function confirmOTPRenter(OTP: number, id: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("delivery_token")?.value;

  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/delivery/${id}/confirm-renter-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ otpCode: OTP }),
      },
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      return {
        success: false,
        error: errData?.message || `HTTP error: ${res.status}`,
      };
    }

    const data = await res.json();
    return { success: true, delivery: data.delivery };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "حدث خطأ غير متوقع",
    };
  }
}

export async function confirmOTPOwner(OTP: number, id: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("delivery_token")?.value;

  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/delivery/${id}/confirm-owner-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ otpCode: OTP }),
      },
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      return {
        success: false,
        error: errData?.message || `HTTP error: ${res.status}`,
      };
    }

    const data = await res.json();
    return { success: true, delivery: data.delivery };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "حدث خطأ غير متوقع",
    };
  }
}
