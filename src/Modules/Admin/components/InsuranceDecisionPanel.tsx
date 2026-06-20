"use client";

import { useState } from "react";
import InsuranceFullRefund from "./InsuranceFullRefund";
import InsuranceRefused from "./InsuranceRefused";
import InsurancePartialDeduction from "./InsurancePartialDeduction";

type InsuranceTab = "full-refund" | "refused" | "partial";

const TABS: Array<{
  key: InsuranceTab;
  label: string;
  sublabel: string;
  dotColor: string;
}> = [
  {
    key: "full-refund",
    label: "رد التأمين بالكامل",
    sublabel: "إعادة كامل المبلغ للمستأجر",
    dotColor: "bg-[color:var(--color-brand-primary)]",
  },
  {
    key: "refused",
    label: "رفض الاسترداد",
    sublabel: "لن يُعاد أي مبلغ للمستأجر",
    dotColor: "bg-[color:var(--color-danger)]",
  },
  {
    key: "partial",
    label: "خصم جزء من التأمين",
    sublabel: "خصم جزء مقابل تلف",
    dotColor: "bg-[color:var(--color-accent-default)]",
  },
];

export default function InsuranceDecisionPanel() {
  const [activeTab, setActiveTab] = useState<InsuranceTab>("full-refund");

  return (
    <div
      className="overflow-hidden rounded-[28px] border border-[color:var(--color-border-default)] shadow-sm"
      dir="rtl"
    >
      {/* ── Dark green header bar ── */}
      <div className="flex items-center justify-between bg-[color:var(--color-brand-dark)] px-5 py-4">
        <span className="text-sm font-semibold text-white">لوحة قرارات التأمين</span>
        {/* shield / info icon */}
        <svg
          className="h-4 w-4 text-white/70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>

      <div className="bg-white p-5">
        {/* ── Tab radio options ── */}
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[color:var(--color-border-default)] rounded-2xl border border-[color:var(--color-border-default)]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col items-end gap-1.5 px-4 py-3 text-right transition-colors first:rounded-r-2xl last:rounded-l-2xl
                  ${isActive ? "bg-[color:var(--color-surface-secondary)]" : "hover:bg-[color:var(--color-surface-secondary)]/50"}`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className={`mt-0.5 h-3 w-3 flex-shrink-0 rounded-full border-2 ${isActive ? `border-transparent ${tab.dotColor}` : "border-[color:var(--color-border-default)] bg-white"}`} />
                  <span className={`text-xs font-semibold leading-snug ${isActive ? "text-[color:var(--color-text-primary)]" : "text-[color:var(--color-text-secondary)]"}`}>
                    {tab.label}
                  </span>
                </div>
                <p className="w-full text-right text-[11px] leading-snug text-[color:var(--color-text-tertiary)]">
                  {tab.sublabel}
                </p>
              </button>
            );
          })}
        </div>

        {/* ── Insurance amount display row ── */}
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-[color:var(--color-surface-secondary)] px-5 py-4">
          <span className="text-xs text-[color:var(--color-text-tertiary)]">مبلغ التأمين</span>
          <span className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            1000 ج.م
          </span>
        </div>

        {/* ── Dynamic content per tab ── */}
        <div className="mt-4">
          {activeTab === "full-refund" && <InsuranceFullRefund />}
          {activeTab === "refused" && <InsuranceRefused />}
          {activeTab === "partial" && <InsurancePartialDeduction />}
        </div>

        {/* ── Action buttons ── */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="rounded-full border border-[color:var(--color-border-default)] bg-white px-4 py-3 text-sm font-semibold text-[color:var(--color-text-primary)] transition hover:bg-[color:var(--color-surface-secondary)]"
          >
            احفظ كمسودة
          </button>
          <button
            type="button"
            className="rounded-full bg-[color:var(--color-brand-primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--color-brand-dark)]"
          >
            تأكيد القرار
          </button>
        </div>
      </div>
    </div>
  );
}