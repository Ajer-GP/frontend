export interface AddressLike {
  street?: string;
  building?: string;
  floor?: string;
  home?: string;
  mark?: string;
}

export interface PersonInfo {
  _id: string;
  fullName: string;
  phoneNumber: string;
  address?: AddressLike | string | null;
}

export interface ProductInfo {
  _id: string;
  title: string;
  category: string;
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerWeek?: number;
  insurancePrice?: number;
}

export interface RentalRequestInfo {
  _id: string;
  status: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  insuranceAmount: number;
  deposit: number;
  rentalFee: number;
  deliveryFee: number;
  commissionFee: number;
  insuranceDeductionAmount?: number;
  insuranceDeductionReason?: string | null;
  insuranceDecision?: string | null;
  location?: AddressLike | null;
}

export interface ChecklistItem {
  label: string;
  checked: boolean;
}

export interface DeliveryFormData {
  _id: string;
  checklist: ChecklistItem[];
  accessories: ChecklistItem[];
  issues: string[];
  images: string[];
  deliveryRepNotes: string;
  reviewStatus: "pending" | "no_claim" | "claim_raised";
  adminNotes: string | null;
  createdAt: string;
}

export interface DeliveryData {
  _id: string;
  status: string;
  assignedAt: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
}

export interface DeliveryBlock {
  delivery: DeliveryData | null;
  form: DeliveryFormData | null;
}

export interface InsuranceDetailsResponse {
  rentalRequest: RentalRequestInfo;
  owner: PersonInfo | null;
  renter: PersonInfo | null;
  product: ProductInfo | null;
  deliveries: {
    fromOwnerToRenter: DeliveryBlock;
    fromRenterToOwner: DeliveryBlock;
  };
}
export const CATEGORY_LABELS: Record<string, string> = {
  cameras: "كاميرات",
  laptops: "لابتوبات",
  tablets: "أجهزة لوحية",
  gaming: "ألعاب",
  audio: "صوتيات",
  electronics: "الإلكترونيات",
  clothes: "ملابس",
  books: "كتب",
  drones: "طائرات مسيّرة",
  lighting: "إضاءة",
  "party tools": "أدوات حفلات",
  other: "أخرى",
};

export const RentalStatus = [
  {
    status: "pending",
    label: "في الانتظار",
    color: "border-yellow-500 bg-yellow-50 text-yellow-700",
  },
  {
    status: "accepted",
    label: "مقبول",
    color: "border-blue-500 bg-blue-50 text-blue-700",
  },
  {
    status: "waiting_for_deposit",
    label: "في انتظار العربون",
    color: "border-orange-500 bg-orange-50 text-orange-700",
  },
  {
    status: "confirmed",
    label: "مؤكد",
    color: "border-green-500 bg-green-50 text-green-700",
  },
  {
    status: "rejected",
    label: "مرفوض",
    color: "border-red-500 bg-red-50 text-red-700",
  },
  {
    status: "cancelled",
    label: "ملغي",
    color: "border-red-400 bg-red-50 text-red-600",
  },
  {
    status: "delivering_to_renter",
    label: "جاري التوصيل للمستأجر",
    color: "border-sky-500 bg-sky-50 text-sky-700",
  },
  {
    status: "active",
    label: "نشط",
    color: "border-emerald-500 bg-emerald-50 text-emerald-700",
  },
  {
    status: "returning_to_owner",
    label: "جاري الإرجاع للمالك",
    color: "border-indigo-500 bg-indigo-50 text-indigo-700",
  },
  {
    status: "suspended",
    label: "موقوف",
    color: "border-rose-500 bg-rose-50 text-rose-700",
  },
  {
    status: "completed",
    label: "مكتمل",
    color: "border-gray-500 bg-gray-100 text-gray-700",
  },
];

export interface InspectionReviewProps {
  outbound: DeliveryBlock;
  inbound: DeliveryBlock;
}

export const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];
export type InsuranceTab = "full-refund" | "refused" | "partial";

export const TABS: Array<{
  key: InsuranceTab;
  label: string;
  sublabel: string;
  dotColor: string;
}> = [
  {
    key: "full-refund",
    label: "رد التأمين بالكامل",
    sublabel: "إعادة كامل المبلغ للمستأجر",
    dotColor: "bg-bran",
  },
  {
    key: "refused",
    label: "رفض الاسترداد",
    sublabel: "لن يُعاد أي مبلغ للمستأجر",
    dotColor: "bg-[color:var(--color-danger)]",
  },
  {
    key: "partial",
    label: "خصم جزء من التأمين",
    sublabel: "خصم جزء مقابل تلف",
    dotColor: "bg-[color:var(--color-accent-default)]",
  },
];

export const validDecisions = [
  { value: "full_refund", label: "رد التأمين بالكامل" },
  { value: "partial_refund", label: "خصم جزء من التأمين" },
  { value: "no_refund", label: "رفض الاسترداد" },
  { value: null, label: "لم يتم المراجعة بعد" },
];
