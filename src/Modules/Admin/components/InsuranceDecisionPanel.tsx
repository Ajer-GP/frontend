"use client";

import { ReactNode, useState } from "react";
import InsuranceFullRefund from "./InsuranceFullRefund";
import InsuranceRefused from "./InsuranceRefused";
import InsurancePartialDeduction from "./InsurancePartialDeduction";
import { InsuranceTab } from "../types/rentals.types";
import { InsuranceDecision } from "../Features/Auth/services/actions";
const TABS: Array<{
  key: InsuranceTab;
  label: string;
  sublabel: string;
  dotColor: string;
  icon: ReactNode;
}> = [
  {
    key: "full-refund",
    label: "رد التأمين بالكامل",
    sublabel: "إعادة كامل المبلغ للمستأجر",
    dotColor: "bg-brand-primary",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 bg-brand-light text-brand-primary w-10 h-10 px-2 py-2 rounded-xl">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    key: "refused",
    label: "رفض الاسترداد",
    sublabel: "لن يُعاد أي مبلغ للمستأجر",
    dotColor: "bg-danger",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 bg-danger-bg text-danger w-10 h-10 px-2 py-2 rounded-xl">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    key: "partial",
    label: "خصم جزء من التأمين",
    sublabel: "خصم جزء مقابل تلف",
    dotColor: "bg-[color:var(--color-accent-default)]",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 bg-[#FFF4D0] text-[#70451A] w-10 h-10 px-2 py-2 rounded-xl ">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
];

export default function InsuranceDecisionPanel(rentalRequest) {
  const [activeTab, setActiveTab] = useState<InsuranceTab>("full-refund");
  const [payload, setPayload] = useState<object>({
    decision: "full_refund",
    adminNotes: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );

  async function handleConfirm() {
    setLoading(true);
    setFeedback(null);
    const result = await InsuranceDecision(
      rentalRequest.rentalRequest._id,
      payload,
    );
    setLoading(false);

    if (!result || result.error) {
      setFeedback({ ok: false, msg: result?.error ?? "حدث خطأ" });
    } else {
      setFeedback({ ok: true, msg: "تم تأكيد القرار بنجاح" });
    }
  }
  return (
    <div
      className="overflow-hidden rounded-3xl border border-border-default shadow-sm"
      dir="rtl">
      {/* ── Dark green header bar ── */}
      <div className="flex items-center bg-brand-dark px-4 py-3 sm:px-5 sm:py-4 ">
        <span className="text-sm font-semibold text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 inline me-2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
          لوحة قرارات التأمين
        </span>
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
                 `}>
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex gap-3">
                    {" "}
                    <div> {tab.icon}</div>
                    <div className="flex flex-col ">
                      <span
                        className={`text-xs font-semibold leading-snug ${
                          isActive ? "text-text-primary" : "text-text-secondary"
                        }`}>
                        {tab.label}
                      </span>
                      <p className="w-full text-right text-[11px] leading-snug text-text-tertiary">
                        {tab.sublabel}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`h-3 w-3 shrink-0 rounded-full border-2 ${
                      isActive
                        ? `border-transparent ${tab.dotColor}`
                        : "border-border-default bg-white"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Insurance amount display row ── */}
        <div className="mt-4 flex gap-4 items-center bg-[#E6E6E6] rounded-2xl  px-4 py-3 sm:px-5 sm:py-4">
          <span className="text-lg font-semibold text-black sm:text-xl">
            {rentalRequest.rentalRequest.insuranceAmount} ج.م
          </span>
          <span className="text-lg text-gray-500">مبلغ التأمين</span>
        </div>

        {/* ── Dynamic content per tab ── */}
        <div className="mt-4">
          {activeTab === "full-refund" && (
            <InsuranceFullRefund
              rentalRequest={rentalRequest}
              onChange={setPayload}
            />
          )}
          {activeTab === "refused" && (
            <InsuranceRefused onChange={setPayload} />
          )}
          {activeTab === "partial" && (
            <InsurancePartialDeduction
              rentalRequest={rentalRequest}
              onChange={setPayload}
            />
          )}
        </div>

        {/* feedback message */}
        {feedback && (
          <p
            className={`mt-3 text-sm font-medium ${feedback.ok ? "text-brand-primary" : "text-danger"}`}>
            {feedback.msg}
          </p>
        )}

        {/* action buttons */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className="rounded-full bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">
            {loading ? "جاري الإرسال..." : "تأكيد القرار"}
          </button>
        </div>
      </div>
    </div>
  );
}
