import { z } from "zod";

export const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(5)
    .max(50)
    .regex(
      /^(?:[A-Za-z]+(?:\s+[A-Za-z]+)+|[\u0600-\u06FF]+(?:\s+[\u0600-\u06FF]+)+)$/,
      "الاسم يجب أن يتكون من اسمين على الأقل وأن يكون بالكامل باللغة العربية أو بالكامل باللغة الإنجليزية",
    ),

  email: z.string().email("البريد الإلكتروني غير صحيح").toLowerCase(),

  password: z
    .string()
    .min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف")
    .max(70, "كلمة المرور طويلة جدًا")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,70}$/,
      "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل ورقم واحد على الأقل ورمز خاص واحد على الأقل",
    ),

  phoneNumber: z
    .string()
    .regex(
      /^01[0125]\d{8}$/,
      "رقم الهاتف يجب أن يكون رقم هاتف مصري صحيح مكونًا من 11 رقمًا",
    ),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح").toLowerCase(),

  otp: z.string().regex(/^\d{6}$/, "رمز التحقق يجب أن يكون 6 أرقام فقط"),
});

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح").toLowerCase(),
  password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح").toLowerCase(),
});

export const resetPasswordSchema = z.object({
  otp_code: z.string().regex(/^\d{6}$/, "رمز التحقق يجب أن يكون 6 أرقام فقط"),

  new_password: z
    .string()
    .min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف")
    .max(70, "كلمة المرور طويلة جدًا")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,70}$/,
      "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل ورقم واحد على الأقل ورمز خاص واحد على الأقل",
    ),
});
