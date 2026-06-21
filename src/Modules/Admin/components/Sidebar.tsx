import Image from "next/image";
import Link from "next/link";
import { getAdminData } from "../Features/Auth/services/actions";
const icons = {
  home: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect
        x="3"
        y="3"
        width="8"
        height="18"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="8"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  tasks: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-notes">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" />
      <path d="M9 7l6 0" />
      <path d="M9 11l6 0" />
      <path d="M9 15l4 0" />
    </svg>
  ),
  payments: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-wallet">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
      <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
    </svg>
  ),
  delivery: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-truck">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
    </svg>
  ),
  inspections: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      />
    </svg>
  ),
  pickup: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-cube">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M21 16.008v-8.018a1.98 1.98 0 0 0 -1 -1.717l-7 -4.008a2.016 2.016 0 0 0 -2 0l-7 4.008c-.619 .355 -1 1.01 -1 1.718v8.018c0 .709 .381 1.363 1 1.717l7 4.008a2.016 2.016 0 0 0 2 0l7 -4.008c.619 -.355 1 -1.01 1 -1.718" />
      <path d="M12 22v-10" />
      <path d="M12 12l8.73 -5.04" />
      <path d="M3.27 6.96l8.73 5.04" />
    </svg>
  ),

  disputes: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 9v4" />
      <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
      <path d="M12 16h.01" />
    </svg>
  ),
};
const navItems = [
  { label: "الرئيسية", href: "/admin/dashboard", icon: "home" },
  { label: "طلبات الإيجار", href: "/admin/rentals", icon: "tasks" },
  {
    label: "التحقق من المدفوعات",
    href: "/admin/main/payments",
    icon: "payments",
  },
  { label: "إدارة التوصيل", href: "/admin/main/delivery", icon: "delivery" },
  {
    label: "إدارة التأمينات",
    href: "/admin/main/insurance",
    icon: "inspections",
  },
  { label: "المنتجات", href: "/admin/main/products", icon: "pickup" },
  {
    label: "البلاغات والنزاعات",
    href: "/admin/main/disputes",
    icon: "disputes",
  },
];

export default async function Sidebar() {
  const adminData = await getAdminData();
  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:flex fixed top-0 right-0 h-screen w-64 bg-white border-l border-border-default flex-col z-40"
        dir="rtl">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border-default">
          <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="ajer"
              width={100}
              height={100}
            />{" "}
          </div>
          <div>
            <p className="text-h3 text-text-primary font-medium">أجر</p>
            <p className="text-caption text-text-tertiary">لوحة تحكم المندوب</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item, i) => {
              return (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm transition-colors 
                         font-medium
                       text-text-secondary hover:bg-surface-secondary hover:text-text-primary">
                    <span className="w-5 h-5 flex items-center justify-center shrink-0 text-brand-primary">
                      {icons[item.icon as keyof typeof icons]}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-default">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary text-caption font-medium">
              {adminData?.fullName[0]}
            </div>
            <div>
              <p className="text-caption text-text-primary font-medium">
                {adminData?.fullName}
              </p>
              <p className="text-overline text-text-tertiary"> ادمن</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom tab bar ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border-default z-40 safe-area-inset-bottom"
        dir="rtl">
        <ul className="flex items-center justify-around px-2 py-2">
          {navItems.map((item, i) => {
            return (
              <li key={i}>
                <Link
                  href={item.href}
                  className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-colors min-w-13 text-text-tertiary hover:text-text-secondary">
                  <span className="w-5 h-5 flex items-center justify-center text-brand-primary">
                    {icons[item.icon as keyof typeof icons]}
                  </span>
                  <span className="text-[10px] leading-tight text-center">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
