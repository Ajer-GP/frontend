export const CONDITION_STYLES: Record<
  string,
  { label: string; text: string; bg: string }
> = {
  excellent: {
    label: "ممتاز",
    text: "text-brand-primary",
    bg: "bg-brand-light",
  },
  good: { label: "جيد", text: "text-warning", bg: "bg-accent-light" },
  fair: { label: "مقبول", text: "text-gray-600", bg: "bg-gray-200" },
};

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
