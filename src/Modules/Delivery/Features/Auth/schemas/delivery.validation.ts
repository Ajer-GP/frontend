import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("البريد الإلكتروني غير صحيح").toLowerCase(),
  password: z.string().trim().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
});
