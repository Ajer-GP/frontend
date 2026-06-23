import {
  getInsuranceDetails,
  getPayment,
} from "@/Modules/Admin/Features/Auth/services/actions";
import InstaPay from "@/Modules/Admin/components/InstaPay";
import InsuranceDecisionPanel from "@/Modules/Admin/components/InsuranceDecisionPanel";
import InspectionReview from "@/Modules/Admin/components/inspectionreview";
import { CATEGORY_LABELS } from "@/Modules/Admin/types/rentals.types";
import { formatRentalDuration, formatAddress } from "@/utils/Insurances";
import Link from "next/link";

export default async function InsurancePage({
  params,
}: {
  params: Promise<{ rentalId: string }>;
}) {
  const { rentalId } = await params;
  const data = await getInsuranceDetails(rentalId);
  const { rentalRequest, owner, renter, product, deliveries } = data.data;
  const instaPay = await getPayment(rentalId);

  const shortId = rentalRequest._id.slice(-6).toUpperCase();

  return (
    <div className="min-h-screen " dir="rtl">
      <main className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Breadcrumb */}
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <Link href="/admin/dashboard">الرئيسية</Link>
              </li>
              <li>
                <Link href="/insurance"> إدارة التأمينات</Link>
              </li>
            </ul>
          </div>

          {/* Page title */}
          <h1 className="text-xl font-semibold  sm:text-2xl">
            تفاصيل تأمين {shortId}
          </h1>

          {/* ── Row 1: Info cards ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* معلومات المالك */}
            <div className="rounded-[20px] border border-gray-300 bg-white p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-brand-light rounded-full p-1.5 shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4 text-brand-primary">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </span>
                <p className="text-xs font-semibold ">معلومات المالك</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="shrink-0 text-[11px] text-gray-500">الاسم</p>
                  <p className="text-sm font-black ">
                    {owner?.fullName ?? "—"}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="shrink-0 text-[11px] text-gray-500">الهاتف</p>
                  <p className="text-sm font-black">
                    {owner?.phoneNumber ?? "—"}
                  </p>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <p className="shrink-0 text-[11px] text-gray-500">العنوان</p>
                  <p className="text-sm font-black text-left">
                    {formatAddress(owner?.address)}
                  </p>
                </div>
              </div>
            </div>

            {/* معلومات المستأجر */}
            <div className="rounded-[20px] border border-gray-300 bg-white p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-brand-light rounded-full p-1.5 shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-building-store text-brand-primary size-4">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 21l18 0" />
                    <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />
                    <path d="M5 21l0 -10.15" />
                    <path d="M19 21l0 -10.15" />
                    <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
                  </svg>
                </span>
                <p className="text-xs font-semibold ">معلومات المستأجر</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="shrink-0 text-[11px] text-gray-500">الاسم</p>
                  <p className="text-sm font-black">
                    {renter?.fullName ?? "—"}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="shrink-0 text-[11px] text-gray-500">الهاتف</p>
                  <p className="text-sm font-black">
                    {renter?.phoneNumber ?? "—"}
                  </p>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <p className="shrink-0 text-[11px] text-gray-500">العنوان</p>
                  <p className="text-sm font-black">
                    {formatAddress(renter?.address)}
                  </p>
                </div>
              </div>
            </div>

            {/* معلومات المنتج */}
            <div className="rounded-[20px] border border-gray-300 bg-white p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-brand-light rounded-full p-1.5 shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-package text-brand-primary size-4">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
                    <path d="M12 12l8 -4.5" />
                    <path d="M12 12l0 9" />
                    <path d="M12 12l-8 -4.5" />
                    <path d="M16 5.25l-8 4.5" />
                  </svg>
                </span>
                <p className="text-xs font-semibold ">معلومات المنتج</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="shrink-0 text-[11px] text-gray-500">المنتج</p>
                  <p className="text-sm font-black">{product?.title ?? "—"}</p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="shrink-0 text-[11px] text-gray-500">الفئة</p>
                  <p className="text-sm font-black">
                    {product?.category
                      ? (CATEGORY_LABELS[product.category] ?? product.category)
                      : "—"}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="shrink-0 text-[11px] ">مدة الإيجار</p>
                  <p className="text-sm font-black">
                    {formatRentalDuration(
                      rentalRequest.startDate,
                      rentalRequest.endDate,
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* معلومات الدفع */}
            <div className="rounded-[20px] border border-gray-300 bg-white p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-brand-light rounded-full p-1.5 shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-primary">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
                    <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
                  </svg>
                </span>
                <p className="text-xs font-semibold ">معلومات الدفع</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="shrink-0 text-[11px] text-gray-500">اجمالي</p>
                  <p className="text-sm font-black">
                    {rentalRequest?.rentalFee} ج.م
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="shrink-0 text-[11px] text-gray-500">
                    مبلغ التأمين
                  </p>
                  <p className="text-sm font-black">
                    {rentalRequest?.insuranceAmount} ج.م
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="shrink-0 text-[11px] text-gray-500">
                    طريقة الدفع
                  </p>
                  <p className="text-sm font-black">
                    {rentalRequest?.paymentMethod === "instapay"
                      ? "انستا باي"
                      : "فيزا"}
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
          {rentalRequest?.paymentMethod === "instapay" ? (
            <InstaPay instaPay={instaPay} />
          ) : (
            <></>
          )}

          {/* ── Row 3: لوحة قرارات التأمين ── */}
          <InsuranceDecisionPanel rentalRequest={rentalRequest} />
        </div>
      </main>
    </div>
  );
}
