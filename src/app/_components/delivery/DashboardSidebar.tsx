// Server Component — no "use client" needed
import Link from "next/link";

const navItems = [
  { label: "الرئيسية", href: "/dashboard", icon: "⊞" },
  { label: "جميع المهام", href: "/dashboard/tasks", icon: "≡" },
  {
    label: "عمليات الاستلام من المالكين",
    href: "/dashboard/pickup",
    icon: "↓",
  },
  {
    label: "عمليات التسليم للمستأجرين",
    href: "/dashboard/delivery",
    icon: "↑",
  },
  { label: "المرتجعات من فترة الإيجار", href: "/dashboard/returns", icon: "↩" },
  { label: "الفحوصات", href: "/dashboard/inspections", icon: "✓" },
];

interface DashboardSidebarProps {
  activeHref?: string;
}

export default function DashboardSidebar({
  activeHref = "/dashboard",
}: DashboardSidebarProps) {
  return (
    <aside
      className="fixed top-0 right-0 h-screen w-64 bg-white border-l border-border-default flex flex-col z-40"
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
          {navItems.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm transition-colors ${
                    isActive
                      ? "bg-brand-light text-brand-primary font-medium"
                      : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                  }`}
                >
                  <span className="text-base w-5 text-center">{item.icon}</span>
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
            أح
          </div>
          <div>
            <p className="text-caption text-text-primary font-medium">
              أحمد ماهر
            </p>
            <p className="text-overline text-text-tertiary">مندوب توصيل</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
