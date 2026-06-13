"use client";

import { useState } from "react";
import Link from "next/link";
import { Rental } from "../types";

// ── Constants ──────────────────────────────────────────────────────────────────

interface Props {
  initialOrders: Rental[];
  currentUserId: string; // عشان نعرف renter ولا owner
}

const TABS = [
  { value: "all", label: "الكل" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "accepted", label: "مقبول" },
  { value: "active", label: "نشط" },
  { value: "returned", label: "مكتمل" },
  { value: "rejected", label: "مرفوض" },
] as const;

const STATUS_LABEL: Record<Rental["status"], string> = {
  pending: "قيد الانتظار",
  accepted: "مقبول",
  confirmed: "مؤكد",
  active: "نشط",
  returned: "مكتمل",
  rejected: "مرفوض",
};

const STATUS_STYLE: Record<Rental["status"], string> = {
  pending: "bg-[#FAEEDA] text-[#854F0B]",
  accepted: "bg-[#E1F5EE] text-[#0F6E56]",
  confirmed: "bg-[#E6F1FB] text-[#185FA5]",
  active: "bg-[#EAF3DE] text-[#3B6D11]",
  returned: "bg-[#F1EFE8] text-[#5F5E5A]",
  rejected: "bg-[#FCEBEB] text-[#A32D2D]",
};

// status → sub-page
const STATUS_PAGE: Record<string, string> = {
  pending: "request-sent",
  accepted: "accepted",
  confirmed: "confirmed",
  active: "active",
  returned: "returned",
  rejected: "request-sent",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short",
  });
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function OrdersClient({ initialOrders, currentUserId }: Props) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filtered =
    activeTab === "all"
      ? initialOrders
      : initialOrders.filter((o) => o.status === activeTab);

  return (
    <div dir="rtl" className="min-h-screen bg-surface-primary">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[28px] font-medium text-text-primary">طلباتي</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            كل طلبات الإيجار الخاصة بك في مكان واحد
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border-default mb-5 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const count =
              tab.value === "all"
                ? initialOrders.length
                : initialOrders.filter((o) => o.status === tab.value).length;

            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`shrink-0 px-4 py-2.5 text-body-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === tab.value
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`mr-1.5 text-caption px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.value
                        ? "bg-brand-primary/10 text-brand-primary"
                        : "bg-surface-tertiary text-text-tertiary"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-secondary">
            <div className="size-14 rounded-full bg-surface-secondary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586"
                />
              </svg>
            </div>
            <p className="text-body-sm">لا توجد طلبات</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((order) => {
              const isRenter = order.renterId === currentUserId;
              const subPage = STATUS_PAGE[order.status] ?? "request-sent";

              return (
                <Link
                  key={order._id}
                  href={`/products/orders/${order._id}`}
                  className="group block bg-white rounded-2xl border border-border-default hover:border-brand-primary/40 hover:shadow-sm transition-all duration-200 p-4"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      {/* Order ID */}
                      <p className="text-caption text-text-tertiary mb-1 font-mono">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      {/* Dates */}
                      <div className="flex items-center gap-1.5 text-body-sm text-text-primary font-medium">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4 text-text-tertiary shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                          />
                        </svg>
                        {formatDate(order.startDate)} ←{" "}
                        {formatDate(order.endDate)}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span
                        className={`text-caption font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[order.status]}`}
                      >
                        {STATUS_LABEL[order.status]}
                      </span>
                      <span className="text-caption text-text-tertiary bg-surface-secondary px-2 py-0.5 rounded-full border border-border-default">
                        {isRenter ? "مستأجر" : "مالك"}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border-default mb-3" />

                  {/* Bottom row */}
                  <div className="flex items-center justify-between">
                    {/* Amounts */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-h3 font-medium text-text-primary">
                        {order.totalAmount.toLocaleString("ar-EG")} ج.م
                      </span>
                      <span className="text-caption text-text-tertiary">
                        تأمين: {order.insuranceAmount.toLocaleString("ar-EG")}{" "}
                        ج.م
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="size-8 rounded-xl border border-border-default flex items-center justify-center text-text-tertiary group-hover:border-brand-primary group-hover:text-brand-primary transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5 8.25 12l7.5-7.5"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
