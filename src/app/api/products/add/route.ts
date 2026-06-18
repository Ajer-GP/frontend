import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: { message: "يجب تسجيل الدخول أولاً" } },
      { status: 401 },
    );
  }

  try {
    const incomingFormData = await request.formData();
    const apiFormData = new FormData();

    for (const [key, value] of incomingFormData.entries()) {
      apiFormData.append(key, value);
    }

    const res = await fetch(`${process.env.API_BASE_URL}/products/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `refresh_token=${refreshToken ?? ""}`,
      },
      body: apiFormData,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("[products/add] backend error:", res.status, data);
    }

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: { message: "تعذر الاتصال بالخادم، حاول مجدداً" } },
      { status: 500 },
    );
  }
}
