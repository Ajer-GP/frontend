// Server Component

interface OrderDetail {
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
}

interface FinancialSummary {
  insurance: number;
  balance: number;
  platformFee: number;
  platformFeePercent: number;
  total: number;
}

interface RightPanelProps {
  order: OrderDetail;
  financial: FinancialSummary;
}

export default function RightPanel({ order, financial }: RightPanelProps) {
  return (
    <aside className="w-72 flex-shrink-0 space-y-4" dir="rtl">
      {/* Action button */}
      <button className="w-full py-3 rounded-xl bg-brand-primary text-white text-body-sm font-medium flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors">
        <span>‹</span>
        <span>تأكيد الوصول</span>
      </button>

      {/* Current action card */}
      <div className="rounded-xl bg-brand-primary/10 border border-brand-primary/20 p-4">
        <p className="text-caption font-medium text-brand-dark mb-1">
          الإجراء المطلوب الآن
        </p>
        <p className="text-body-sm font-medium text-brand-primary">
          استلام المنتج من المالك
        </p>
        <p className="text-caption text-text-tertiary mt-1">
          توجه إلى عنوان المالك واستلم المنتج بعد الفحص
        </p>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-caption text-text-secondary">
            <span className="text-brand-primary">📅</span>
            <span>موعد الاستلام المحدد</span>
            <span className="mr-auto font-medium text-text-primary">
              {order.pickupDate} {order.pickupTime} م
            </span>
          </div>
          <div className="flex items-center gap-2 text-caption text-text-secondary">
            <span className="text-danger">🕐</span>
            <span>الموعد النهائي للتسليم للمستأجر</span>
            <span className="mr-auto font-medium text-text-primary">
              {order.returnDate} {order.returnTime} م
            </span>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="rounded-xl border border-border-default bg-white p-4">
        <p className="text-body-sm font-medium text-text-primary mb-3">
          ملخص مالي
        </p>
        <div className="space-y-2">
          <FinancialRow label="سعر التأمين" value={financial.insurance} />
          <FinancialRow label="باقي الحساب" value={financial.balance} />
          <FinancialRow
            label={`نسبة المنصة (%${financial.platformFeePercent})`}
            value={financial.platformFee}
          />
          <div className="pt-2 border-t border-border-default flex items-center justify-between">
            <span className="text-body-sm font-medium text-text-primary">
              الإجمالي
            </span>
            <span className="text-h2 font-medium text-brand-primary">
              {financial.total} ج.م
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function FinancialRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-caption text-text-secondary">{label}</span>
      <span className="text-caption font-medium text-text-primary">
        {value}
      </span>
    </div>
  );
}
