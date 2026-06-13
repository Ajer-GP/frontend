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
};

export default function OrderSummaryCard({ product, dates, pricing }: Props) {
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
            <span className="text-body-sm text-text-secondary">
              {product.ownerName}
            </span>
            <span className="text-caption text-text-tertiary">المالك</span>
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
        <div>
          <p className="text-text-tertiary text-caption">تاريخ البداية</p>
          <p className="font-medium">{dates.start}</p>
        </div>
        <div>
          <p className="text-text-tertiary text-caption">تاريخ التسليم</p>
          <p className="font-medium">{dates.end}</p>
        </div>
        <div>
          <p className="text-text-tertiary text-caption">المدة</p>
          <p className="font-medium">{dates.days} أيام</p>
        </div>
        <div>
          <p className="text-text-tertiary text-caption">الحساب اليومي</p>
          <p className="font-medium">{dates.dailyRate.toFixed(2)} ج.م</p>
        </div>
      </div>

      {/* Pricing */}
      {pricing !== null && (
        <div
          dir="ltr"
          className="space-y-2 text-body-sm border-t border-border-default pt-3"
        >
          <Row label="سعر الإيجار" value={pricing?.rentalPrice ?? 0} tag="مدفوع" />
          <Row label="سعر التوصيل" value={pricing?.delivery ?? 0} tag="مدفوع" />
          <Row label="سعر التأمين" value={pricing?.insurance ?? 0} />
          <Row label="نسبة المنصة (٪7.5)" value={pricing?.platformFee ?? 0} />
          <div className="flex justify-between font-medium text-brand-primary pt-2 border-t border-border-default">
            <span>ج.م {pricing?.total ?? 0}</span>
            <span>الإجمالي</span>
          </div>
        </div>
      )}
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
      <span>{value ?? 0}</span>
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
