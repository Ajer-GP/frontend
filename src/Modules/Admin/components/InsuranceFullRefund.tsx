import { useEffect, useState } from "react";

interface Props {
  rentalRequest: { rentalRequest: { insuranceAmount: number } };
  onChange: (payload: { decision: "full_refund"; adminNotes: string }) => void;
}

export default function InsuranceFullRefund({
  rentalRequest,
  onChange,
}: Props) {
  const info = rentalRequest.rentalRequest.insuranceAmount;
  const [adminNotes, setAdminNotes] = useState("");

  // Notify parent whenever notes change
  useEffect(() => {
    onChange({ decision: "full_refund", adminNotes });
  }, [adminNotes]);

  return (
    <div className="rounded-2xl px-5 py-4 text-right">
      <p className="text-xs text-text-tertiary">
        سيتم إعادة كامل مبلغ التأمين للمستأجر دون أي خصومات.
      </p>
      <p className="mt-2 text-2xl font-semibold text-brand-dark">{info} ج.م</p>
      <p className="mt-1 text-xs text-text-tertiary">المبلغ المسترد للمستأجر</p>

      <div className="mt-3">
        <label
          htmlFor="full-refund-notes"
          className="block text-[11px] font-medium">
          ملاحظات الأدمن (اختياري)
        </label>
        <input
          id="full-refund-notes"
          type="text"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="..."
          dir="rtl"
          className="mt-1 w-full border border-gray-300 rounded-xl px-2 py-2 bg-white text-sm outline-none"
        />
      </div>
    </div>
  );
}
