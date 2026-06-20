"use client";

import { useState } from "react";

const INSURANCE_TOTAL = 1000;

export default function InsurancePartialDeduction() {
  const [deductionValue, setDeductionValue] = useState<string>("");
  const [deductionReason, setDeductionReason] = useState("");

  const deduction = parseFloat(deductionValue) || 0;
  const refund = Math.max(0, INSURANCE_TOTAL - deduction);

  return (
    <div className="space-y-3 text-right">
      {/* قيمة الخصم input */}
      <div className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-surface-secondary)] px-4 py-3">
        <label
          htmlFor="deduction-value"
          className="block text-[11px] font-medium text-[color:var(--color-text-tertiary)]"
        >
          قيمة الخصم (ج)
        </label>
        <input
          id="deduction-value"
          type="number"
          min={0}
          max={INSURANCE_TOTAL}
          value={deductionValue}
          onChange={(e) => setDeductionValue(e.target.value)}
          placeholder="250"
          dir="rtl"
          className="mt-1 w-full border-none bg-transparent text-sm font-semibold text-[color:var(--color-text-primary)] placeholder-[color:var(--color-text-tertiary)] outline-none"
        />
      </div>

      {/* سبب الخصم input */}
      <div className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-surface-secondary)] px-4 py-3">
        <label
          htmlFor="deduction-reason"
          className="block text-[11px] font-medium text-[color:var(--color-text-tertiary)]"
        >
          سبب الخصم
        </label>
        <input
          id="deduction-reason"
          type="text"
          value={deductionReason}
          onChange={(e) => setDeductionReason(e.target.value)}
          placeholder="تلف في المنتج"
          dir="rtl"
          className="mt-1 w-full border-none bg-transparent text-sm text-[color:var(--color-text-primary)] placeholder-[color:var(--color-text-tertiary)] outline-none"
        />
      </div>

      {/* Breakdown rows — قيمة التأمين الأصلية / قيمة الخصم / المبلغ المسترد */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between rounded-xl bg-[color:var(--color-surface-secondary)] px-4 py-2.5">
          <span className="text-sm font-semibold text-[color:var(--color-text-primary)]">
            {INSURANCE_TOTAL} ج.م
          </span>
          <span className="text-xs text-[color:var(--color-text-tertiary)]">قيمة التأمين الأصلية</span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[color:var(--color-surface-secondary)] px-4 py-2.5">
          <span className="text-sm font-semibold text-[color:var(--color-danger)]">
            {deduction > 0 ? `${deduction} ج.م -` : "— ج.م"}
          </span>
          <span className="text-xs text-[color:var(--color-text-tertiary)]">قيمة الخصم</span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[color:var(--color-surface-secondary)] px-4 py-2.5">
          <span className="text-sm font-semibold text-[color:var(--color-brand-primary)]">
            {refund} ج.م
          </span>
          <span className="text-xs text-[color:var(--color-text-tertiary)]">المبلغ المسترد للمستأجر</span>
        </div>
      </div>
    </div>
  );
}