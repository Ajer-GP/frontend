"use client";

import { useEffect, useState } from "react";

interface Props {
  rentalRequest: { rentalRequest: { insuranceAmount: number } };
  onChange: (payload: {
    decision: "partial_refund";
    deductionAmount: number;
    deductionReason: string;
    adminNotes: string;
  }) => void;
}

export default function InsurancePartialDeduction({
  rentalRequest,
  onChange,
}: Props) {
  const info = rentalRequest.rentalRequest.insuranceAmount;
  const [deductionValue, setDeductionValue] = useState("");
  const [deductionReason, setDeductionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const deduction = parseFloat(deductionValue) || 0;
  const refund = Math.max(0, info - deduction);

  useEffect(() => {
    onChange({
      decision: "partial_refund",
      deductionAmount: deduction,
      deductionReason,
      adminNotes,
    });
  }, [deduction, deductionReason, adminNotes]);

  return (
    <div className="space-y-3 text-right bg-[#FFFBEC] rounded-xl px-4 py-4 border border-[#FCE2AD]">
      {/* same JSX as before, just destructured props instead of rentalRequest.rentalRequest.rentalRequest */}
      <div>
        <label
          htmlFor="deduction-value"
          className="block text-[11px] font-black">
          قيمة الخصم (ج.م)
        </label>
        <input
          id="deduction-value"
          type="number"
          min={0}
          max={info}
          value={deductionValue}
          onChange={(e) => setDeductionValue(e.target.value)}
          placeholder="250"
          dir="rtl"
          className="mt-1 w-full border border-gray-300 rounded-xl px-2 py-2 bg-white text-sm font-semibold outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="deduction-reason"
          className="block text-[11px] font-medium">
          سبب الخصم
        </label>
        <input
          id="deduction-reason"
          type="text"
          value={deductionReason}
          onChange={(e) => setDeductionReason(e.target.value)}
          placeholder="تلف في المنتج"
          dir="rtl"
          className="mt-1 w-full border border-gray-300 rounded-xl px-2 py-2 bg-white text-sm outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="partial-notes"
          className="block text-[11px] font-medium">
          ملاحظات الأدمن (اختياري)
        </label>
        <input
          id="partial-notes"
          type="text"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="..."
          dir="rtl"
          className="mt-1 w-full border border-gray-300 rounded-xl px-2 py-2 bg-white text-sm outline-none"
        />
      </div>
      <div className="space-y-1.5 border border-gray-300 rounded-2xl bg-white">
        <div className="flex items-center justify-between rounded-xl px-2 py-2">
          <span className="text-xs text-text-tertiary">
            قيمة التأمين الأصلية
          </span>
          <span className="text-sm font-semibold text-text-primary">
            {info} ج.م
          </span>
        </div>
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-xs text-text-tertiary">قيمة الخصم</span>
          <span className="text-sm font-semibold text-danger">
            {deduction > 0 ? `- ${deduction} ج.م` : "- ج.م"}
          </span>
        </div>
        <div className="flex items-center justify-between px-2 py-2 border-t border-gray-300">
          <span className="text-xs text-text-tertiary">
            المبلغ المسترد للمستأجر
          </span>
          <span className="text-sm font-semibold text-brand-primary">
            {refund} ج.م
          </span>
        </div>
      </div>
    </div>
  );
}
