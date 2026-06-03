"use server";
import { z } from "zod";
import { loginService } from "@/Services/auth-service";
const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح").toLowerCase(),
  password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
});
export async function handleSubmit(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!validatedFields.success) {
    return {
      ...prevState,
      ZodErrors: validatedFields.error.flatten().fieldErrors,
      message: "الرجاء التحقق من البيانات وإعادة المحاولة",
    };
  }

  const responseData = await loginService(validatedFields.data);
  if (responseData?.error) {
    return {
      ...prevState,
      ZodErrors: null,
      message:
        responseData.error ||
        "الإيميل أو الباسورد خطأ , الرجاء المحاولة مرة أخرى",
    };
  }

  return {
    data: responseData,
    ZodErrors: null,
    message: null,
  };
}
