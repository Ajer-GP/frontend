import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getTokenOrRefresh(): Promise<string> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  // ✅ access token موجود — ارجعيه
  if (accessToken) return accessToken;

  const refreshToken = cookieStore.get("refresh_token")?.value;

  // ❌ مفيش refresh — روحي login
  if (!refreshToken) redirect("/auth/login");

  // 🔄 استدعي الـ internal refresh route
  try {
    const headerStore = await headers();
    const host = headerStore.get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

    const res = await fetch(`${protocol}://${host}/api/auth/refresh`, {
      method: "POST",
      headers: {
        // مهم — بعتي الـ cookies عشان الـ route تقرأ refresh_token
        Cookie: `refresh_token=${refreshToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) redirect("/auth/login");

    const data = await res.json();
    const newToken: string = data.accessToken;

    if (!newToken) redirect("/auth/login");

    // ⚠️ الـ cookies (access_token الجديد) اتسيتت في الـ response من الـ route
    // بس في Server Component مش هتتطبق على الـ request الحالي
    // فبنرجع الـ token من الـ response body عشان نستخدمه في نفس الـ request

    return newToken;
  } catch {
    redirect("/auth/login");
  }
}
