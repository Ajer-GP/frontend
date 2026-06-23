"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { logout } from "@/Modules/Delivery/Features/services/delivery.actions";

const icons = {
  home: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width="18"
      height="18"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  ),
  pickup: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
      <path d="M12 12l8 -4.5" />
      <path d="M12 12l0 9" />
      <path d="M12 12l-8 -4.5" />
      <path d="M16 5.25l-8 4.5" />
    </svg>
  ),
  delivery: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width="18"
      height="18"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
      />
    </svg>
  ),
  returns: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="scale-x-[-1]"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
      <path d="M20 4v5h-5" />
    </svg>
  ),
  inspections: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width="18"
      height="18"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
      />
    </svg>
  ),
};

const navItems = [
  { label: "الرئيسية", href: "/dashboard", icon: "home" },
  { label: "جميع المهام", href: "/tasks", icon: "tasks" },
  { label: "الاستلام", href: "/pickup", icon: "pickup" },
  { label: "التسليم", href: "/delivery", icon: "delivery" },
  { label: "المرتجعات", href: "/returns", icon: "returns" },
  { label: "الفحوصات", href: "/inspections", icon: "inspections" },
];

const navItemsFull = [
  { label: "الرئيسية", href: "/dashboard", icon: "home" },
  { label: "جميع المهام", href: "/tasks", icon: "tasks" },
  {
    label: "عمليات الاستلام من المالكين",
    href: "/pickup",
    icon: "pickup",
  },
  {
    label: "عمليات التسليم للمستأجرين",
    href: "/delivery",
    icon: "delivery",
  },
  {
    label: "المرتجعات من فترة الإيجار",
    href: "/returns",
    icon: "returns",
  },
  { label: "الفحوصات", href: "/inspections", icon: "inspections" },
];

interface DeliveryData {
  fullName: string;
  email: string;
  vehicleType: string;
  isOnline: boolean;
}

interface DashboardSidebarProps {
  deliveryData: DeliveryData | null;
}

// ── Helper: clears all auth cookies and redirects to delivery login ──
function clearCookies() {
  const cookieNames = ["delivery_token", "delivery"];
  cookieNames.forEach((name) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  });
}

export default function DashboardSidebar({
  deliveryData,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeHref = pathname ?? "/dashboard";

  // const handleLogout = () => {
  //   clearCookies();
  //   router.push("/auth/DeliveryLogin");
  // };

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:flex fixed top-0 right-0 h-screen w-64 bg-white border-l border-border-default flex-col z-40"
        dir="rtl"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border-default">
          <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">أ</span>
          </div>
          <div>
            <p className="text-h3 text-text-primary font-medium">أجر</p>
            <p className="text-caption text-text-tertiary">لوحة تحكم المندوب</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItemsFull.map((item, i) => {
              const isActive = activeHref === item.href;
              return (
                <li key={i}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm transition-colors ${
                      isActive
                        ? "bg-brand-light text-brand-primary font-medium"
                        : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                    }`}
                  >
                    <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-brand-primary">
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
        <div className="px-4 py-4 border-t border-border-default space-y-3">
          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary text-caption font-medium">
              {deliveryData?.fullName?.slice(0, 2) ?? "؟"}
            </div>
            <div>
              <p className="text-caption text-text-primary font-medium">
                {deliveryData?.fullName ?? "غير معروف"}
              </p>
              <p className="text-overline text-text-tertiary flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    deliveryData?.isOnline ? "bg-success" : "bg-text-tertiary"
                  }`}
                />
                {deliveryData?.isOnline ? "متصل" : "غير متصل"}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={() => logout()}
            className="btn btn-ghost btn-sm w-full justify-start gap-2 text-error hover:bg-error/10 px-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="w-4 h-4 flex-shrink-0"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width="18"
              height="18"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
              />
            </svg>
            <span className="text-caption">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom tab bar ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border-default z-40 safe-area-inset-bottom"
        dir="rtl"
      >
        <ul className="flex items-center justify-around px-2 py-2">
          {navItems.map((item, i) => {
            const isActive = activeHref === item.href;
            return (
              <li key={i}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-colors min-w-[52px] ${
                    isActive
                      ? "text-brand-primary"
                      : "text-text-tertiary hover:text-text-secondary"
                  }`}
                >
                  <span
                    className={`w-5 h-5 flex items-center justify-center ${isActive ? "text-brand-primary" : ""}`}
                  >
                    {icons[item.icon as keyof typeof icons]}
                  </span>
                  <span className="text-[10px] leading-tight text-center">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}

          {/* Mobile logout tab */}
          <li>
            <button
                         onClick={() => logout()}

              className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-colors min-w-[52px] text-error hover:text-error/70"
            >
              <span className="w-5 h-5 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="w-[18px] h-[18px]"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  width="18"
                  height="18"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                  />
                </svg>
              </span>
              <span className="text-[10px] leading-tight text-center">
                خروج
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
