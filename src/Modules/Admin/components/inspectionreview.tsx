// Server component - inspection review section, driven by real delivery + delivery form data

import {
  ARABIC_MONTHS,
  DeliveryBlock,
  DeliveryFormData,
  InspectionReviewProps,
} from "../types/rentals.types";

function formatArabicDate(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getDate()} ${ARABIC_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
function Tag({
  label,
  variant = "ok",
}: {
  label: string;
  variant?: "ok" | "danger" | "neutral";
}) {
  const styles = {
    ok: "bg-brand-light text-brand-primary",
    danger: "bg-danger-bg text-danger",
    neutral: "bg-surface-tertiary text-text-secondary",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-[11px] font-semibold whitespace-nowrap ${styles[variant]}`}>
      {label}
    </span>
  );
}
function CameraRow({ images }: { images: string[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 ">
      {images?.map((src) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 border border-gray-400 rounded-xl bg-surface-tertiary object-cover"
        />
      ))}
    </div>
  );
}

function getStatusBadge(form: DeliveryFormData | null): {
  label: string;
  variant: "ok" | "danger" | "neutral";
} {
  if (!form) return { label: "بانتظار النموذج", variant: "neutral" };
  if (form?.issues?.length > 0)
    return { label: "يوجد ملاحظات", variant: "danger" };
  const allItems = [...form?.checklist, ...form?.accessories];
  if (allItems.length > 0 && allItems.every((item) => item.checked)) {
    return { label: "حالة سليمة", variant: "ok" };
  }
  return { label: "قيد المراجعة", variant: "neutral" };
}

function InspectionCard({
  title,
  dateLabel,
  block,
  isStatic = false,
  missingItems,
  sourceItems, // ← add this: outbound items as the master list
}: {
  title: string;
  dateLabel: string;
  block: DeliveryBlock;
  isStatic?: boolean;
  missingItems?: Set<string>;
  sourceItems?: { label: string; checked: boolean }[]; // ← add this
}) {
  const { delivery, form } = block;
  const badge = isStatic
    ? { label: "حالة سليمة", variant: "ok" as const }
    : getStatusBadge(form);

  const date =
    formatArabicDate(delivery?.deliveredAt) ??
    formatArabicDate(delivery?.pickedUpAt) ??
    formatArabicDate(form?.createdAt) ??
    formatArabicDate(delivery?.assignedAt);

  // Use sourceItems (outbound) as master list if provided, else fall back to own form
  const masterItems = sourceItems ?? [
    ...(form?.checklist ?? []),
    ...(form?.accessories ?? []),
  ];

  // For inbound: look up real checked state by label from own form
  const inboundItemMap = new Map(
    [...(form?.checklist ?? []), ...(form?.accessories ?? [])].map((i) => [
      i.label,
      i.checked,
    ]),
  );

  return (
    <div className="rounded-xl border border-brand-primary bg-white p-3 sm:p-5">
      {/* Card header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="text-right min-w-0 flex-1">
          <p className="text-xs font-semibold text-text-primary leading-snug">
            {title}
          </p>
          <p className="text-[10px] sm:text-[11px] text-(--color-text-tertiary) mt-0.5 truncate">
            {dateLabel}
            {date ? ` · ${date}` : ""}
          </p>
        </div>
        <Tag label={badge.label} variant={badge.variant} />
      </div>

      {/* Photos */}
      <CameraRow images={form?.images ?? []} />

      {/* Checklist — always driven by masterItems */}
      {masterItems.length > 0 ? (
        <div className="mt-3 sm:mt-4 space-y-2">
          {masterItems.map((item, idx) => {
            // Outbound static row
            if (isStatic) {
              return (
                <div
                  key={`${item.label}-${idx}`}
                  className="flex items-center justify-between gap-2 min-w-0 rounded-xl bg-[#F9FBFD] px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 flex items-center justify-center rounded-full bg-brand-light w-5 h-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3 h-3 text-brand-primary">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    <span className="text-[11px] sm:text-xs text-text-secondary truncate flex-1">
                      {item.label}
                    </span>
                  </div>
                  <Tag label="مطابق" variant="ok" />
                </div>
              );
            }

            // Inbound real state row
            const isChecked = inboundItemMap.get(item.label) ?? false;
            const isMissing = missingItems?.has(item.label) && !isChecked;

            return (
              <div
                key={`${item.label}-${idx}`}
                className="flex items-center justify-between gap-2 min-w-0 rounded-xl bg-[#F9FBFD] px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`shrink-0 flex items-center justify-center rounded-full w-5 h-5 ${
                      isMissing
                        ? "bg-danger-bg"
                        : isChecked
                          ? "bg-brand-light"
                          : "bg-surface-tertiary"
                    }`}>
                    {isMissing ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3 h-3 text-danger">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`w-3 h-3 ${isChecked ? "text-brand-primary" : "text-text-secondary"}`}>
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`text-[11px] sm:text-xs truncate flex-1 ${
                      isMissing
                        ? "text-danger font-medium"
                        : "text-text-secondary"
                    }`}>
                    {item.label}
                  </span>
                </div>
                <Tag
                  label={
                    isMissing ? "مفقود" : isChecked ? "مطابق" : "غير مكتمل"
                  }
                  variant={isMissing ? "danger" : isChecked ? "ok" : "neutral"}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-(--color-text-tertiary)">
          لا توجد بيانات فحص بعد
        </p>
      )}

      {/* Notes */}
      <div className="mt-3 sm:mt-4 rounded-2xl bg-[#F9FBFD] p-2.5 sm:p-3">
        <p className="text-[10px] sm:text-[11px] font-black">ملاحظات</p>
        {form?.deliveryRepNotes ? (
          <p className="mt-1 text-[11px] sm:text-xs leading-5 text-text-secondary">
            {form.deliveryRepNotes}
          </p>
        ) : (
          <p className="mt-1 text-[11px] sm:text-xs leading-5 text-text-tertiary">
            لا توجد ملاحظات
          </p>
        )}
      </div>
    </div>
  );
}

export default function InspectionReview({
  outbound,
  inbound,
}: InspectionReviewProps) {
  // ← Use inbound as source of truth — outbound form has no checklist
  const sourceItems = [
    ...(inbound.form?.checklist ?? []),
    ...(inbound.form?.accessories ?? []),
  ];

  // getMissingItems now compares sourceItems against themselves (inbound real state)
  // so rewrite the logic inline here instead
  const missingItems = new Set(
    sourceItems.filter((item) => !item.checked).map((item) => item.label),
  );

  return (
    <section className="rounded-xl border border-border-default bg-white p-3 sm:p-5">
      <div className="mb-4 sm:mb-5 flex flex-wrap items-center gap-2">
        <svg
          className="h-4 w-4 shrink-0 text-brand-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        <span className="text-base sm:text-xl font-black leading-tight">
          مراجعة الفحص - مقارنة التسليم والارجاع
        </span>

        {missingItems.size > 0 && (
          <span className="inline-flex items-center rounded-full bg-danger-bg px-2.5 py-1 text-[11px] font-semibold text-danger sm:mr-auto">
            {missingItems.size} عنصر مفقود
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        {/* Owner/delivery side — static all-checked, driven by inbound's item list */}
        <InspectionCard
          title="حالة المنتج عند التسليم"
          dateLabel="فحص التسليم الأول"
          block={outbound}
          isStatic
          sourceItems={sourceItems}
        />
        {/* Return side — real state from inbound */}
        <InspectionCard
          title="حالة المنتج عند الارجاع"
          dateLabel="فحص الارجاع"
          block={inbound}
          missingItems={missingItems}
          sourceItems={sourceItems}
        />
      </div>
    </section>
  );
}
