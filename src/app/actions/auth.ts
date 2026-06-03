"use server";
import { loginService } from "@/Modules/User/Features/Auth/services/actions";
import { loginSchema } from "@/Modules/User/Features/Auth/schemas/auth.validation";

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
