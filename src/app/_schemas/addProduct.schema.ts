import { z } from "zod";

export const step1Schema = z.object({
  title: z
    .string()
    .min(3, "عنوان المنتج يجب أن يكون 3 أحرف على الأقل")
    .max(100, "عنوان المنتج يجب أن لا يتجاوز 100 حرف"),

  description: z
    .string()
    .min(10, "وصف المنتج يجب أن يكون 10 أحرف على الأقل")
    .trim()
    .max(500, ",وصف المنتج يجب أن لا يتجاوز 500 حرف"),

  category: z.string().min(1, "اختر الفئة الرئيسية"),
  name: z
    .string()
    .min(1, "اسم المنتج يجب أن يكون حرفين على الأقل")
    .trim()
    .max(100, "اسم المنتج يجب أن لا يتجاوز 100 حرف"),
  usage: z
    .string()
    .min(1, "وصف الاستخدام يجب أن يكون حرفين على الأقل")
    .trim()
    .max(500, "وصف الاستخدام يجب أن لا يتجاوز 500 حرف"),
  specs: z.array(z.object({ title: z.string(), value: z.string() })).optional(),
  accessories: z.array(z.object({ name: z.string() })).optional(),
  condition: z
    .union([
      z.enum(["excellent", "good", "fair"]),
      z.undefined(),
      z.literal(""),
    ])
    .refine((val) => val === "excellent" || val === "good" || val === "fair", {
      message: "اختر حالة المنتج",
    }) as z.ZodType<"excellent" | "good" | "fair">,
  conditionNotes: z.array(z.object({ text: z.string() })).optional(),
  notes: z.array(z.object({ text: z.string() })).optional(),
  handlingNotes: z.array(z.string()),
  location: z.object({
    street: z.string().min(1, "اسم الشارع مطلوب"),
    buildingNum: z.string().min(1, "رقم المبنى مطلوب"),
    floorNum: z.string().min(1, "رقم الدور مطلوب"),
    houseNum: z.string().min(1, "رقم المنزل مطلوب"),
    landmark: z.string().min(1, "أقرب علامة مميزة مطلوبة"),
  }),
  coverImage: z
    .any()
    .refine((val) => val instanceof File, { message: "أضف صورة الغلاف" }),
  images: z
    .array(z.any())
    .min(2, "أضف صورتين إضافيتين")
    .max(2, "يمكنك رفع صورتين إضافيتين فقط"),
});

export const step2Schema = z
  .object({
    checklist: z.array(z.string()).optional(),
    pricePerHour: z.number("السعر يجب أن يكون رقماً").min(0).optional(),

    pricePerDay: z.number("السعر يجب أن يكون رقماً").min(0).optional(),
    pricePerWeek: z.number("السعر يجب أن يكون رقماً").min(0).optional(),
    insuranceAmount: z
      .number("مبلغ التأمين يجب أن يكون رقماً")
      .positive("مبلغ التأمين يجب أن يكون أكبر من صفر")
      .min(1, "مبلغ التأمين مطلوب"),
  })
  .refine(
    (data) => data.pricePerHour || data.pricePerDay || data.pricePerWeek,
    { message: "اختر خيار تسعير واحد على الأقل", path: ["pricePerDay"] },
  );

export const fullSchema = step1Schema.merge(step2Schema);
export type FullFormData = z.infer<typeof fullSchema>;
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
