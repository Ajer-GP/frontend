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
    ok: "bg-[color:var(--color-success-bg)] text-[color:var(--color-success)]",
    danger:
      "bg-[color:var(--color-danger-bg)] text-[color:var(--color-danger)]",
    neutral:
      "bg-[color:var(--color-surface-tertiary)] text-[color:var(--color-text-secondary)]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${styles[variant]}`}>
      {label}
    </span>
  );
}

function CameraRow({ images }: { images: string[] }) {
  if (!images.length) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-16 w-20 sm:h-18 sm:w-22 shrink-0 rounded-2xl bg-surface-tertiary"
          />
        ))}
      </div>
    );
  }
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {images.map((src) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className="h-16 w-20 sm:h-18 sm:w-22 shrink-0 rounded-2xl bg-surface-tertiary object-cover"
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
  if (form.issues.length > 0)
    return { label: "يوجد ملاحظات", variant: "danger" };
  const allItems = [...form.checklist, ...form.accessories];
  if (allItems.length > 0 && allItems.every((item) => item.checked)) {
    return { label: "حالة سليمة", variant: "ok" };
  }
  return { label: "قيد المراجعة", variant: "neutral" };
}

function InspectionCard({
  title,
  dateLabel,
  block,
}: {
  title: string;
  dateLabel: string;
  block: DeliveryBlock;
}) {
  const { delivery, form } = block;
  const badge = getStatusBadge(form);

  const date =
    formatArabicDate(delivery?.deliveredAt) ??
    formatArabicDate(delivery?.pickedUpAt) ??
    formatArabicDate(form?.createdAt) ??
    formatArabicDate(delivery?.assignedAt);

  const items = [...(form?.checklist ?? []), ...(form?.accessories ?? [])];
  const hasNotes =
    Boolean(form?.deliveryRepNotes) || Boolean(form?.issues?.length);

  return (
    <div className="rounded-[20px] border border-border-default bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="text-right min-w-0">
          <p className="text-xs font-semibold text-text-primary truncate">
            {title}
          </p>
          <p className="text-[11px] text-(--color-text-tertiary) mt-0.5">
            {dateLabel}
            {date ? ` · ${date}` : ""}
          </p>
        </div>
        <Tag label={badge.label} variant={badge.variant} />
      </div>

      <CameraRow images={form?.images ?? []} />

      {items.length > 0 ? (
        <div className="mt-4 space-y-2">
          {items.map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="flex items-center justify-between gap-2">
              <span className="text-xs text-text-secondary truncate">
                {item.label}
              </span>
              <Tag
                label={item.checked ? "مطابق" : "غير مكتمل"}
                variant={item.checked ? "ok" : "neutral"}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-xs text-(--color-text-tertiary)">
          لا توجد بيانات فحص بعد
        </p>
      )}

      <div className="mt-4 rounded-2xl bg-[#F8F9FA] p-3">
        <p className="text-[11px] font-semibold text-(--color-text-tertiary)">
          ملاحظات
        </p>
        {form?.deliveryRepNotes ? (
          <p className="mt-1 text-xs leading-5 text-text-secondary">
            {form.deliveryRepNotes}
          </p>
        ) : null}
        {form?.issues && form.issues.length > 0 ? (
          <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs leading-5 text-danger">
            {form.issues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        ) : null}
        {!hasNotes ? (
          <p className="mt-1 text-xs leading-5 text-(--color-text-tertiary)">
            لا توجد ملاحظات
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function InspectionReview({
  outbound,
  inbound,
}: InspectionReviewProps) {
  return (
    <section className="rounded-3xl border border-border-default bg-white p-4 sm:p-5">
      {/* Header */}
      <div className="mb-4 sm:mb-5 flex items-center gap-2">
        <svg
          className="h-4 w-4 shrink-0 text-(--color-text-tertiary)"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        <span className="text-xs text-(--color-text-tertiary)">
          مراجعة الفحص - مقارنة التسليم والارجاع
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        <InspectionCard
          title="حالة المنتج عند التسليم"
          dateLabel="فحص التسليم الأول"
          block={outbound}
        />
        <InspectionCard
          title="حالة المنتج عند الارجاع"
          dateLabel="فحص الارجاع"
          block={inbound}
        />
      </div>
    </section>
  );
}
