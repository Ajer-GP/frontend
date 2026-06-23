"use client";

import { useEffect, useState } from "react";

interface Props {
  onChange: (payload: {
    decision: "no_refund";
    deductionReason: string;
    adminNotes: string;
  }) => void;
}

export default function InsuranceRefused({ onChange }: Props) {
  const [reason, setReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    onChange({ decision: "no_refund", deductionReason: reason, adminNotes });
  }, [reason, adminNotes]);

  return (
    <div className="space-y-3 text-right">
      <div className="rounded-2xl border border-danger bg-danger-bg px-4 py-3">
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
          className="mt-2 w-full bg-white text-sm outline-none px-2 py-2 rounded-xl"
        />
      </div>

      <div>
        <label
          htmlFor="refused-notes"
          className="block text-[11px] font-medium">
          ملاحظات الأدمن (اختياري)
        </label>
        <input
          id="refused-notes"
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
