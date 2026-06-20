import InsuranceDecisionPanel from "@/Modules/Admin/components/InsuranceDecisionPanel";
import InsuranceSidebar from "@/Modules/Admin/components/insurancesidebar";
import InspectionReview from "@/Modules/Admin/components/inspectionreview";

const API_BASE_URL = "http://localhost:5000/api";

// ── Types matching the backend response ──
interface AddressLike {
  street?: string;
  building?: string;
  floor?: string;
  home?: string;
  mark?: string;
}

interface PersonInfo {
  _id: string;
  fullName: string;
  phoneNumber: string;
  address?: AddressLike | string | null;
}

interface ProductInfo {
  _id: string;
  title: string;
  category: string;
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerWeek?: number;
  insurancePrice?: number;
}

interface RentalRequestInfo {
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

interface InsuranceDetailsResponse {
  rentalRequest: RentalRequestInfo;
  owner: PersonInfo | null;
  renter: PersonInfo | null;
  product: ProductInfo | null;
  deliveries: {
    fromOwnerToRenter: DeliveryBlock;
    fromRenterToOwner: DeliveryBlock;
  };
}

// TEMP: hand-set bearer token while auth wiring isn't connected yet.
// Put it in .env.local as ADMIN_TEMP_BEARER_TOKEN=<token> — replace this
// with real session/cookie-based auth once that's in place.
const TEMP_BEARER_TOKEN = "";

// ── Data fetching ──
async function getInsuranceDetails(rentalId: string): Promise<InsuranceDetailsResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/rentals/${rentalId}`, {
      cache: "no-store",
      headers: {
        ...(TEMP_BEARER_TOKEN ? { Authorization: `Bearer ${TEMP_BEARER_TOKEN}` } : {}),
      },
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data ?? null;
  } catch (err) {
    console.error("Failed to fetch insurance details:", err);
    return null;
  }
}

// ── Helpers ──
function formatAddress(address?: AddressLike | string | null): string {
  if (!address) return "—";
  if (typeof address === "string") return address;
  const parts = [address.street, address.building, address.floor, address.home, address.mark].filter(Boolean);
  return parts.length ? parts.join("، ") : "—";
}

function formatRentalDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return "—";
  const days = Math.max(1, Math.round(Math.abs(end - start) / (1000 * 60 * 60 * 24)));
  return `${days} ${days === 1 ? "يوم" : "أيام"}`;
}

const CATEGORY_LABELS: Record<string, string> = {
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

export default async function InsurancePage({
  params,
}: {
  params: Promise<{ rentalId: string }>;
}) {
  const { rentalId } = await params;
  const data = await getInsuranceDetails(rentalId);


  if (!data) {
    return (
      <div className="flex min-h-screen bg-[#F8F9FA]" dir="rtl">
        <InsuranceSidebar />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-sm text-[color:var(--color-text-tertiary)]">
            تعذر العثور على بيانات هذا التأمين
          </p>
        </main>
      </div>
    );
  }

  const { rentalRequest, owner, renter, product, deliveries } = data;
  const shortId = rentalRequest._id.slice(-6).toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]" dir="rtl">
      {/* ── Sidebar ── */}
      <InsuranceSidebar />

      {/* ── Main scroll area ── */}
      <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
        <div className="flex flex-col gap-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[color:var(--color-text-tertiary)]">
            <span>الرئيسية</span>
            <span>&gt;</span>
            <span>إدارة التأمينات</span>
            <span>&gt;</span>
            <span className="font-medium text-[color:var(--color-text-primary)]">{shortId}</span>
          </nav>

          {/* Page title */}
          <h1 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
            تفاصيل تأمين {shortId}
          </h1>

          {/* ── Row 1: Info cards ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* معلومات المالك */}
            <div className="rounded-[20px] border border-[color:var(--color-border-default)] bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[color:var(--color-text-tertiary)]">معلومات المالك</p>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--color-brand-light)]">
                  <svg className="h-3.5 w-3.5 text-[color:var(--color-brand-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-[color:var(--color-text-tertiary)]">الاسم</p>
                  <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{owner?.fullName ?? "—"}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-[color:var(--color-text-tertiary)]">الهاتف</p>
                  <p className="text-sm text-[color:var(--color-text-secondary)]">{owner?.phoneNumber ?? "—"}</p>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <p className="flex-shrink-0 text-[11px] text-[color:var(--color-text-tertiary)]">العنوان</p>
                  <p className="text-sm text-[color:var(--color-text-secondary)]">{formatAddress(owner?.address)}</p>
                </div>
              </div>
            </div>

            {/* معلومات المستأجر */}
            <div className="rounded-[20px] border border-[color:var(--color-border-default)] bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[color:var(--color-text-tertiary)]">معلومات المستأجر</p>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--color-surface-tertiary)]">
                  <svg className="h-3.5 w-3.5 text-[color:var(--color-text-secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-[color:var(--color-text-tertiary)]">الاسم</p>
                  <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{renter?.fullName ?? "—"}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-[color:var(--color-text-tertiary)]">الهاتف</p>
                  <p className="text-sm text-[color:var(--color-text-secondary)]">{renter?.phoneNumber ?? "—"}</p>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <p className="flex-shrink-0 text-[11px] text-[color:var(--color-text-tertiary)]">العنوان</p>
                  <p className="text-sm text-[color:var(--color-text-secondary)]">{formatAddress(renter?.address)}</p>
                </div>
              </div>
            </div>

            {/* معلومات المنتج */}
            <div className="rounded-[20px] border border-[color:var(--color-border-default)] bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[color:var(--color-text-tertiary)]">معلومات المنتج</p>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--color-brand-light)]">
                  <svg className="h-3.5 w-3.5 text-[color:var(--color-brand-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-[color:var(--color-text-tertiary)]">المنتج</p>
                  <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{product?.title ?? "—"}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-[color:var(--color-text-tertiary)]">الفئة</p>
                  <p className="text-sm text-[color:var(--color-text-secondary)]">
                    {product?.category ? (CATEGORY_LABELS[product.category] ?? product.category) : "—"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-[color:var(--color-text-tertiary)]">مدة الإيجار</p>
                  <p className="text-sm text-[color:var(--color-text-secondary)]">
                    {formatRentalDuration(rentalRequest.startDate, rentalRequest.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 2: مراجعة الفحص ── */}
          <InspectionReview
            outbound={deliveries.fromOwnerToRenter}
            inbound={deliveries.fromRenterToOwner}
          />

          {/* ── Row 3: لوحة قرارات التأمين ── */}
          <InsuranceDecisionPanel />
        </div>
      </main>
    </div>
  );
}