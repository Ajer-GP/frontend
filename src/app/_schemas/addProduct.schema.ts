import { z } from "zod";

export const step1Schema = z.object({
  title: z.string().min(5, "العنوان قصير جداً"),
  description: z.string().min(20, "الوصف قصير جداً"),
  mainCategory: z.string().min(1, "اختر الفئة الرئيسية"),
  subCategory: z.string().min(1, "اختر الفئة الفرعية"),
  specs: z.array(z.object({ title: z.string(), value: z.string() })).optional(),
  accessories: z.array(z.object({ name: z.string() })).optional(),
  condition: z.enum(["new", "like_new", "good"]),
  conditionNote: z.string().optional(),
  handlingTips: z.array(z.string()).min(1, "اختر إرشاد واحد على الأقل"),
});

export const step2Schema = z.object({
  pricePerDay: z.number().min(1),
  insuranceAmount: z.number().min(0),
  deliveryPrice: z.number().min(0),
  address: z.object({
    street: z.string().min(1),
    buildingNum: z.string().optional(),
    floorNum: z.string().optional(),
    landmark: z.string().optional(),
  }),
  images: z.array(z.any()).min(1, "أضف صورة واحدة على الأقل"),
});

export const fullSchema = step1Schema.merge(step2Schema);
export type FullFormData = z.infer<typeof fullSchema>;
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
