// Full refund tab: design shows just the amount row then the action buttons.
// No additional inputs needed — the amount is already shown in the panel header row.
// This component renders the empty/confirm state between the amount row and buttons.

export default function InsuranceFullRefund() {
  return (
    <div className="rounded-2xl px-5 py-4 text-right">
      <p className="text-xs text-text-tertiary">
        سيتم إعادة كامل مبلغ التأمين للمستأجر دون أي خصومات.
      </p>
      <p className="mt-2 text-2xl font-semibold text-brand-dark">1000 ج.م</p>
      <p className="mt-1 text-xs text-text-tertiary">المبلغ المسترد للمستأجر</p>
    </div>
  );
}
