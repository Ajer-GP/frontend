"use server";
import { cookies } from "next/headers";
import { loginSchema } from "../schemas/admin.validation";
import { redirect } from "next/navigation";

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
    maxAge: 60 * 15,
  });

  // 2. Extract refresh token from Set-Cookie header (backend sets it as httpOnly)
  //    Fall back to response body if backend also sends it there
  const setCookieHeader = res.headers.get("set-cookie");
  const refreshToken =
    setCookieHeader?.match(/refresh_token=([^;]+)/)?.[1] ?? data.refreshToken;

  if (refreshToken) {
    cookieStore.set("admin_refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 15, // 15 days
    });
  }

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
    console.log(res);
  } catch (err) {
    console.error("Logout API call failed:", err);
  }

  cookieStore.delete("admin_access_token");
  cookieStore.delete("admin_refresh_token");

  cookieStore.delete("admin");

  redirect("/auth/AdminLogin");
}
