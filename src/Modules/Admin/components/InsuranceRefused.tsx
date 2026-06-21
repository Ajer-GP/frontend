"use client";

import { useState } from "react";

export default function InsuranceRefused() {
  const [reason, setReason] = useState("");

  return (
    <div className="space-y-3 text-right">
      {/* سبب الرفض input — pink/danger tinted background matching the design */}
      <div className="rounded-2xl border border-danger-bg bg-danger-bg px-4 py-3">
        <label
          htmlFor="refusal-reason"
          className="block text-[11px] font-medium text-danger">
          سبب الرفض
        </label>
        <input
          id="refusal-reason"
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="تلف في المنتج"
          dir="rtl"
          className="mt-1 w-full border-none bg-transparent text-sm text-text-primary placeholder-(--color-text-tertiary) outline-none"
        />
      </div>
    </div>
  );
}
