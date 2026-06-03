"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "../schemas/auth.validation";

export async function loginService(userData: z.infer<typeof loginSchema>) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...userData,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        error:
          data.error ||
          data.message ||
          "الإيميل أو الباسورد خطأ , الرجاء المحاولة مرة أخرى",
      };
    }
    return data;
  } catch (err) {
    return err;
  }
}

export async function registerAction(data: z.infer<typeof signupSchema>) {
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "بيانات غير صحيحة" };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        password: parsed.data.password,
        phoneNumber: parsed.data.phoneNumber,
      }),
    });

    if (!res.ok) {
      const err = await res.json();

      return {
        success: false,
        error: err?.error?.message || "حدث خطأ أثناء إنشاء الحساب",
      };
    }

    // Store email in a cookie so verify-email page can use it
    const { cookies } = await import("next/headers");
    (await cookies()).set("pending_email", parsed.data.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });
    (await cookies()).set("otp_type", "register", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    });
  } catch {
    return { success: false, error: "تعذر الاتصال بالخادم، حاول مجدداً" };
  }

  redirect("/auth/register/verify-email");
}

export async function forgotPassword(
  data: z.infer<typeof forgotPasswordSchema>,
) {
  const parsed = forgotPasswordSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "البريد الإلكتروني غير صحيح",
    };
  }

  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/auth/forget-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: parsed.data.email,
        }),
      },
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: result?.message || "حدث خطأ",
      };
    }

    const { cookies } = await import("next/headers");

    (await cookies()).set("pending_email", parsed.data.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    });
    (await cookies()).set("otp_type", "reset-password", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    });
  } catch {
    return {
      success: false,
      error: "تعذر الاتصال بالخادم",
    };
  }

  redirect("/auth/forgot-password/verify-email");
}

export async function resetPassword(data: z.infer<typeof resetPasswordSchema>) {
  const parsed = resetPasswordSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "بيانات غير صحيحة",
    };
  }

  const cookieStore = await cookies();
  const email = cookieStore.get("pending_email")?.value;

  if (!email) {
    return {
      success: false,
      error: "انتهت الجلسة، أعد طلب رمز التحقق",
    };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp_code: parsed.data.otp_code,
        new_password: parsed.data.new_password,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: result?.message || "فشل تغيير كلمة المرور",
      };
    }

    cookieStore.delete("pending_email");
  } catch {
    return {
      success: false,
      error: "تعذر الاتصال بالخادم",
    };
  }

  redirect("/auth/login");
}

export async function resendOtpAction() {
  const cookieStore = await cookies();
  const email = cookieStore.get("pending_email")?.value;

  if (!email) {
    return { success: false, error: "انتهت الجلسة، يرجى التسجيل مجدداً" };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/api/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const err = await res.json();
      return {
        success: false,
        error: err?.message || "حدث خطأ أثناء إعادة الإرسال",
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "تعذر الاتصال بالخادم، حاول مجدداً" };
  }
}
export async function verifyOtpAction(otp: string) {
  const cookieStore = await cookies();
  const email = cookieStore.get("pending_email")?.value;

  if (!email) {
    return { success: false, error: "انتهت الجلسة، يرجى التسجيل مجدداً" };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!res.ok) {
      const err = await res.json();
      return {
        success: false,
        error: err?.message || "رمز التحقق غير صحيح أو منتهي الصلاحية",
      };
    }

    // Clean up the cookie after successful verification
    cookieStore.delete("pending_email");
  } catch {
    return { success: false, error: "تعذر الاتصال بالخادم، حاول مجدداً" };
  }

  redirect("/auth/login");
}
