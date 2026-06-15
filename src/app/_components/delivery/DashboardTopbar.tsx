// Server Component
import { cookies } from "next/headers";

interface DashboardTopbarProps {
  driverName: string;
  taskCount: number;
}

function getArabicDate(): string {
  return new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getArabicTime(): string {
  return new Date().toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardTopbar({
  driverName,
  taskCount,
}: DashboardTopbarProps) {
  const date = getArabicDate();
  const time = getArabicTime();

  return (
    <header
      className="h-16 bg-white border-b border-border-default flex items-center justify-between px-6"
      dir="rtl"
    >
      {/* Left side: greeting */}
      <div>
        <h1 className="text-h3 text-text-primary font-medium">
          مرحباً {driverName} 👋
        </h1>
        <p className="text-caption text-text-tertiary">
          لديك {taskCount} مهام توصيل نشطة اليوم
        </p>
      </div>

      {/* Right side: date + search + notifications */}
      <div className="flex items-center gap-4">
        {/* Date */}
        <div className="text-left hidden md:block">
          <p className="text-caption text-text-secondary">{date}</p>
          <p className="text-caption text-text-tertiary">{time} صباحاً</p>
        </div>

        {/* Search */}
        <div className="relative hidden lg:block">
          <input
            type="text"
            placeholder="ابحث برقم الطلب، المنتج أو العميل..."
            className="w-72 px-4 py-2 rounded-lg border border-border-default bg-surface-secondary text-body-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-mid focus:bg-white transition-colors"
            dir="rtl"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">
            🔍
          </span>
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg border border-border-default bg-white flex items-center justify-center hover:bg-surface-secondary transition-colors">
          <span className="text-base">🔔</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-white text-overline flex items-center justify-center">
            3
          </span>
        </button>

        {/* Settings */}
        <button className="w-9 h-9 rounded-lg border border-border-default bg-white flex items-center justify-center hover:bg-surface-secondary transition-colors">
          <span className="text-base">⚙️</span>
        </button>
      </div>
    </header>
  );
}
