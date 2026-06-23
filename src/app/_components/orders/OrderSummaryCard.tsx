import Image from "next/image";

type Props = {
  product: {
    name: string;
    category: string;
    image: string;
    ownerName: string;
    ownerAvatar: string;
  };
  dates: {
    start: string;
    end: string;
    days: number;
    dailyRate: number;
  };
  pricing?: {
    rentalPrice: number;
    insurance: number;
    delivery: number;
    platformFee: number;
    total: number;
  } | null;
  type: "request" | "accepted" | "confirmed" | "completed";
};

export default function OrderSummaryCard({
  product,
  dates,
  pricing,
  type,
}: Props) {
  // confirmed له layout مختلف خالص
  if (type === "confirmed") {
    return (
      <div dir="ltr" className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {pricing && (
          <div
            dir="rtl"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h3 className="mb-6 text-center text-lg font-bold">تفاصيل الدفع</h3>
            <div className="space-y-4">
              <PricingRow label="سعر التأمين" value={pricing.insurance} />
              <PricingRow label="باقي الحساب" value={pricing.rentalPrice} />
              <PricingRow
                label="نسبة المنصة (7.5%)"
                value={pricing.platformFee}
              />
              <div className="flex items-center justify-between bg-[] py-2 px-2 rounded-lg pt-2">
                <span className="font-semibold text-emerald-600">الإجمالي</span>
                <span className="text-xl font-bold text-emerald-600">
                  {pricing.insurance +
                    pricing.platformFee +
                    pricing.rentalPrice}{" "}
                  ج.م
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-right text-lg font-bold">ملخص الطلب</h3>
          <div className="flex flex-col-reverse gap-6 md:flex-row md:justify-between">
            <div className="flex-1 text-right">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                {product.category}
              </span>
              <h2 className="mt-4 text-lg font-bold leading-relaxed">
                {product.name}
              </h2>
              <div className="mt-3 flex items-center justify-end gap-2">
                <div>
                  <p className="font-medium">{product.ownerName}</p>
                  <span className="text-sm text-gray-500">المالك</span>
                </div>
                <div className="h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={product.ownerAvatar}
                    alt={product.ownerName}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div
                dir="rtl"
                className="mt-8 grid grid-cols-4 gap-4 pt-6 text-center"
              >
                <DateCell label="تاريخ البداية" value={dates.start} />
                <DateCell label="تاريخ التسليم" value={dates.end} />
                <DateCell label="المدة" value={`${dates.days} أيام`} />
                <DateCell
                  label="الحساب اليومي"
                  value={`${dates.dailyRate} ج.م`}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-40 w-40 overflow-hidden rounded-2xl border border-gray-200 p-3">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={160}
                  height={160}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // request | accepted | completed — نفس الـ layout
  return (
    <div
      dir="rtl"
      className="border border-border-default rounded-xl p-4 bg-surface-primary space-y-4"
    >
      {/* Product */}
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <span className="text-caption text-text-tertiary bg-surface-secondary px-2 py-0.5 rounded">
            {product.category}
          </span>
          <p className="text-h3 mt-1">{product.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <Image
              src={product.ownerAvatar}
              alt=""
              width={20}
              height={20}
              className="rounded-full"
            />
            <div>
              <p className="text-body-sm text-text-secondary m-0 p-0">
                {product.ownerName}
              </p>
              <span className="text-caption text-text-tertiary">المالك</span>
            </div>
          </div>
        </div>
        <Image
          src={product.image}
          alt={product.name}
          width={80}
          height={80}
          className="rounded-lg object-cover"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-4 gap-2 text-center text-body-sm">
        {[
          { label: "تاريخ البداية", value: dates.start },
          { label: "تاريخ التسليم", value: dates.end },
          {
            label: "المدة",
            value: `${dates.days.toLocaleString("ar-EG")} أيام`,
          },
          {
            label: "الحساب اليومي",
            value: `${dates.dailyRate.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م`,
          },
        ].map((d) => (
          <div key={d.label}>
            <p className="text-text-tertiary text-caption">{d.label}</p>
            <p className="font-medium">{d.value}</p>
          </div>
        ))}
      </div>

      {/* Pricing */}
      {pricing && (
        <div
          dir="ltr"
          className="space-y-2 text-body-sm border-t border-border-default pt-3"
        >
          <Row label="سعر الإيجار" value={pricing.rentalPrice} />
          <Row label="سعر التوصيل" value={pricing.delivery} />
          <Row label="سعر التأمين" value={pricing.insurance} />
          <Row label="نسبة المنصة (٪7.5)" value={pricing.platformFee} />

          {/* completed → بيظهر "مدفوع بالكامل" badge */}
          {type === "completed" && (
            <div className="flex justify-end pt-1">
              <span className="text-caption bg-[#E8F0ED] text-[#1A6B4A] px-3 py-1 rounded-full font-medium">
                ✓ مدفوع بالكامل
              </span>
            </div>
          )}

          <div className="flex justify-between font-medium text-brand-primary pt-2 border-t border-border-default">
            <span>
              ج.م{" "}
              {pricing.total.toLocaleString("ar-EG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span>الإجمالي</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function DateCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-gray-200 pr-4 last:border-none">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 font-medium">{value}</p>
    </div>
  );
}

function PricingRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between px-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value} ج.م</span>
    </div>
  );
}

function Row({
  label,
  value,
  tag,
}: {
  label: string;
  value?: number;
  tag?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span>{value?.toLocaleString("ar-EG") ?? 0}</span>
      <div className="flex items-center gap-2">
        {tag && (
          <span className="text-caption bg-success-bg text-success px-2 py-0.5 rounded-full">
            {tag}
          </span>
        )}
        <span className="text-text-secondary">{label}</span>
      </div>
    </div>
  );
}
