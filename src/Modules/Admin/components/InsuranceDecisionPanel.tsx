"use client";

import { useState } from "react";
import InsuranceFullRefund from "./InsuranceFullRefund";
import InsuranceRefused from "./InsuranceRefused";
import InsurancePartialDeduction from "./InsurancePartialDeduction";
import { InsuranceTab, TABS } from "../types/rentals.types";

export default function InsuranceDecisionPanel() {
  const [activeTab, setActiveTab] = useState<InsuranceTab>("full-refund");

  return (
    <div
      className="overflow-hidden rounded-3xl border border-border-default shadow-sm"
      dir="rtl">
      {/* ── Dark green header bar ── */}
      <div className="flex items-center justify-between bg-brand-dark px-4 py-3 sm:px-5 sm:py-4">
        <span className="text-sm font-semibold text-white">
          لوحة قرارات التأمين
        </span>
        <svg
          className="h-4 w-4 text-white/70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>

      <div className="bg-white p-4 sm:p-5">
        {/* ── Tab radio options — stack on mobile, row on sm+ ── */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 sm:divide-x sm:divide-x-reverse divide-border-default rounded-2xl border border-border-default overflow-hidden">
          {TABS.map((tab, idx) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col gap-1 px-4 py-3 text-right transition-colors
                  ${idx !== 0 ? "border-t sm:border-t-0 border-border-default" : ""}
                  ${isActive ? "bg-surface-secondary" : "bg-white hover:bg-surface-secondary/50"}`}>
                <div className="flex w-full items-center justify-between gap-2">
                  <span
                    className={`h-3 w-3 shrink-0 rounded-full border-2 ${
                      isActive
                        ? `border-transparent ${tab.dotColor}`
                        : "border-border-default bg-white"
                    }`}
                  />
                  <span
                    className={`text-xs font-semibold leading-snug ${
                      isActive ? "text-text-primary" : "text-text-secondary"
                    }`}>
                    {tab.label}
                  </span>
                </div>
                <p className="w-full text-right text-[11px] leading-snug text-text-tertiary">
                  {tab.sublabel}
                </p>
              </button>
            );
          })}
        </div>

        {/* ── Insurance amount display row ── */}
        <div className="mt-4 flex items-center justify-between rounded-2xl  px-4 py-3 sm:px-5 sm:py-4">
          <span className="text-xs text-text-tertiary">مبلغ التأمين</span>
          <span className="text-lg font-semibold text-black sm:text-xl">
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
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="rounded-full border border-border-default bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#F8F9FA]">
            احفظ كمسودة
          </button>
          <button
            type="button"
            className="rounded-full bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark">
            تأكيد القرار
          </button>
        </div>
      </div>
    </div>
  );
}
