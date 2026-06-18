import { FullFormData } from "@/app/_schemas/addProduct.schema";

export const CATEGORY_LABELS: Record<string, string> = {
  cameras: "كاميرات",
  laptops: "لابتوب",
  tablets: "تابلت",
  gaming: "بلايستيشن",
  audio: "سماعات",
  electronics: "الكترونيات",
  clothes: "ملابس",
  books: "كتب",
  drones: "درون",
  lighting: "إضاءة",
  "party tools": "أدوات حفلات",
  other: "أخرى",
};

export const CONDITION_LABELS: Record<string, string> = {
  excellent: "جديد",
  good: "كالجديد",
  fair: "ممتاز",
};

export const conditionMap: Record<string, string> = {
  excellent: "ممتاز",
  good: "جيد",
  fair: "مقبول",
};

export function labelCategory(category?: string) {
  if (!category) return "—";
  return CATEGORY_LABELS[category] ?? category;
}

export function labelCondition(condition?: string) {
  if (!condition) return "—";
  return CONDITION_LABELS[condition] ?? condition;
}

export function toPriceNumber(value: unknown): number | undefined {
  if (value == null || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(n) || n <= 0) return undefined;
  return n;
}

export function formatPrice(value: unknown) {
  const n = toPriceNumber(value);
  if (n == null) return null;
  return n.toLocaleString();
}

export function getPrimaryPrice(
  data: Pick<FullFormData, "pricePerHour" | "pricePerDay" | "pricePerWeek">,
) {
  const pricePerDay = toPriceNumber(data.pricePerDay);
  const pricePerHour = toPriceNumber(data.pricePerHour);
  const pricePerWeek = toPriceNumber(data.pricePerWeek);

  if (pricePerDay != null) {
    return { value: pricePerDay, period: "يوم" };
  }
  if (pricePerHour != null) {
    return { value: pricePerHour, period: "ساعة" };
  }
  if (pricePerWeek != null) {
    return { value: pricePerWeek, period: "أسبوع" };
  }
  return null;
}

export function getActivePrices(
  data: Pick<FullFormData, "pricePerHour" | "pricePerDay" | "pricePerWeek">,
) {
  return [
    { label: "بالساعة", value: toPriceNumber(data.pricePerHour) },
    { label: "باليوم", value: toPriceNumber(data.pricePerDay) },
    { label: "بالأسبوع", value: toPriceNumber(data.pricePerWeek) },
  ].filter((p): p is { label: string; value: number } => p.value != null);
}

export function formatLocation(location?: FullFormData["location"]) {
  if (!location?.street) return "—";
  return `${location.street}، مبنى ${location.buildingNum}، دور ${location.floorNum}، شقة ${location.houseNum} — ${location.landmark}`;
}
