"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// import {
//   HomeIcon,
//   ClipboardDocumentListIcon,
//   CreditCardIcon,
//   TruckIcon,
//   ShieldCheckIcon,
//   ArchiveBoxIcon,
//   FlagIcon,
//   MagnifyingGlassIcon,
//   BellIcon,
//   Cog6ToothIcon,
// } from "@heroicons/react/24/outline";

const NAV_ITEMS = [
  { label: "الرئيسية", href: "/admin/main"},
  { label: "طلبات الإيجار", href: "/admin/main/rentals"},
  { label: "التحقق من المدفوعات", href: "/admin/main/payments"},
  { label: "إدارة التوصيل", href: "/admin/main/delivery" },
  { label: "إدارة التأمينات", href: "/admin/main/insurance"},
  { label: "المنتجات", href: "/admin/main/products"},
  { label: "البلاغات والنزاعات", href: "/admin/main/disputes" },
];

export default function InsuranceSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex w-[220px] flex-shrink-0 flex-col border-l border-[color:var(--color-border-default)] bg-white"
      dir="rtl"
    >
      {/* Top bar: date/time + icons */}
      <div className="flex items-center justify-between border-b border-[color:var(--color-border-default)] px-4 py-3">
        <div className="flex items-center gap-2">
          <button className="text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
           {/* <Cog6ToothIcon className="h-4 w-4" /> */}
          </button>
          <div className="relative">
            <button className="text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
              {/* <BellIcon className="h-4 w-4" /> */}
            </button>
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[color:var(--color-danger)] text-[9px] font-bold text-white">
              ٣
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-medium text-[color:var(--color-text-primary)]">
            الأثنين 14 يونيو 2026
          </p>
          <p className="text-[11px] text-[color:var(--color-text-tertiary)]">09:42 صباحاً</p>
        </div>
      </div>

      {/* Logo + Search */}
      <div className="border-b border-[color:var(--color-border-default)] px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          {/* Ajer logo text */}
          <span className="text-lg font-bold text-[color:var(--color-brand-dark)]">أجر</span>
          {/* Logo mark placeholder */}
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--color-brand-primary)]">
            <span className="text-sm font-bold text-white">A</span>
          </span>
        </div>
        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-surface-secondary)] px-3 py-2">
          {/* <MagnifyingGlassIcon className="h-3.5 w-3.5 flex-shrink-0 text-[color:var(--color-text-tertiary)]" /> */}
          <input
            type="text"
            placeholder="ابحث برقم الطلب، المنتج أو العميل..."
            dir="rtl"
            className="w-full border-none bg-transparent text-[11px] text-[color:var(--color-text-secondary)] placeholder-[color:var(--color-text-tertiary)] outline-none"
          />
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, href}) => {
            const isActive = pathname.startsWith(href) && (href !== "/admin/main" || pathname === "/admin/main");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-[color:var(--color-brand-light)] font-semibold text-[color:var(--color-brand-dark)]"
                      : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-secondary)] hover:text-[color:var(--color-text-primary)]"
                  }`}
                >
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: user avatar */}
      <div className="border-t border-[color:var(--color-border-default)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-brand-primary)] text-sm font-bold text-white">
            ر
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-[color:var(--color-text-primary)]">ريان قوده</p>
            <p className="text-[11px] text-[color:var(--color-text-tertiary)]">المدير</p>
          </div>
        </div>
      </div>
    </aside>
  );
}