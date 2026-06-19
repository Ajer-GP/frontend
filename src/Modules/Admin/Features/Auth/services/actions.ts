"use server";
import { cookies } from "next/headers";
import { loginSchema } from "../schemas/admin.validation";

export async function adminLogin(prevState: any, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ZodErrors: parsed.error.flatten().fieldErrors };
  }

  const res = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const data = await res.json();

  if (!res.ok) return { message: data.message || "فشل تسجيل الدخول" };

  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  // 1. Set access token — 15 min
  cookieStore.set("admin_token", data.accessToken, {
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
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 15, // 15 days
    });
  }

  // 3. User profile cookie — readable by JS for UI (not httpOnly)
  cookieStore.set("user", JSON.stringify(data.user), {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 15, // 15 days
  });

  return { success: true };
}
