"use server";
import { cookies } from "next/headers";
import { loginSchema } from "../schemas/admin.validation";
import { redirect } from "next/navigation";
import { access } from "fs";

export async function AdminLoginService(prevState: any, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ZodErrors: parsed.error.flatten().fieldErrors };
  }

  const res = await fetch(`${process.env.API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const data = await res.json();

  if (!res.ok) return { message: data.error.message || "فشل تسجيل الدخول" };

  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  // 1. Set access token — 15 min
  cookieStore.set("admin_access_token", data.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // 3. User profile cookie — readable by JS for UI (not httpOnly)
  cookieStore.set("admin", JSON.stringify(data.admin), {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 15, // 15 days
  });

  return { success: true };
}
export async function AdminLogoutSerivce() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("admin_access_token")?.value;
  const refreshToken = cookieStore.get("admin_refresh_token")?.value;
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/admin/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (err) {
    console.error("Logout API call failed:", err);
  }

  cookieStore.delete("admin_access_token");
  cookieStore.delete("admin_refresh_token");

  cookieStore.delete("admin");

  redirect("/auth/AdminLogin");
}

export async function getDashboard() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("admin_access_token")?.value;

  if (!accessToken) {
    return { success: false, message: "غير مصرح" };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/admin/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();
    if (!res.ok) return { message: data.error?.message || "فشل جلب البيانات" };

    return data;
  } catch {
    return { success: false, message: "تعذر الاتصال بالخادم" };
  }
}

export async function getRentals(page: number = 1, status?: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("admin_access_token")?.value;

  if (!accessToken) {
    return { success: false, message: "غير مصرح" };
  }

  try {
    const url = new URL(`${process.env.API_BASE_URL}/admin/rentals`);
    url.searchParams.set("page", String(page));
    if (status && status !== "all") url.searchParams.set("status", status);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) return { message: data.error?.message || "فشل جلب البيانات" };

    return data;
  } catch {
    return { success: false, message: "تعذر الاتصال بالخادم" };
  }
}

export async function getAdminData() {
  const cookieStore = await cookies();
  const adminRaw = cookieStore.get("admin")?.value;
  if (!adminRaw) return null;
  try {
    return JSON.parse(adminRaw);
  } catch {
    return null;
  }
}

export async function getInsuranceDetails(rentalId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("admin_access_token")?.value;
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/admin/rentals/${rentalId}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch insurance details:", err);
    return null;
  }
}

export async function getPayment(id: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("admin_access_token")?.value;
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/admin/payments/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await res.json();

    if (!res.ok) return { message: data.error?.message };
    return data;
  } catch (err) {
    console.error("Failed to fetch:", err);
    return null;
  }
}

export async function InsuranceDecision(id: string, decision: object) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("admin_access_token")?.value;
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/admin/rentals/${id}/insurance-return`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(decision),
      },
    );

    const data = await res.json();
    console.log(data, res.status);
    if (!res.ok) return { error: data.error?.message };
    return data;
  } catch (err) {
    console.error("Failed to fetch:", err);
    return null;
  }
}
