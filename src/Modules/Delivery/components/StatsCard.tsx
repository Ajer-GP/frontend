"use client";
import { useEffect, useState } from "react";
import { setDeliveryRepOnline } from "@/Modules/Delivery/Features/services/delivery.actions";
import { useRouter } from "next/navigation";

interface StatsCardProps {
  driverName: string;
  currentTasks: number;
  completedToday: number;
  totalTasks: number;
  initialOnline?: boolean;
}

export default function StatsCard({
  driverName,
  currentTasks,
  completedToday,
  totalTasks,
  initialOnline,
}: StatsCardProps) {
  const [isOnline, setIsOnline] = useState(initialOnline);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    try {
      await setDeliveryRepOnline(!isOnline);
      setIsOnline(!isOnline);
      router.refresh(); // ← يعيد fetch الـ server data
    } catch (err) {
      console.error(err);
      setIsOnline(isOnline); // rollback لو فشل
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setIsOnline(initialOnline);
  }, [initialOnline]);
  return (
    <div className="rounded-xl mb-2 bg-gradient-to-l from-brand-mid to-brand-primary p-5 text-white">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-h2 font-medium"> مرحباً {driverName}</h2>
          <p className="text-caption text-white/70 mt-0.5">
            لديك {currentTasks} مهام توصيل نشطة اليوم
          </p>
        </div>

        {/* Online toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-caption text-white/80">
            {isOnline ? "متصل" : "غير متصل"}
          </span>
          <button
            onClick={handleToggle}
            disabled={loading}
            aria-label={isOnline ? "إيقاف الاتصال" : "تفعيل الاتصال"}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 disabled:opacity-50
              ${isOnline ? "bg-white/40" : "bg-white/20"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200
                ${isOnline ? "right-1" : "right-6"}`}
            />
          </button>
        </div>
      </div>

      {/* Status line */}
      <div className="flex items-center gap-1.5 mb-4">
        <span
          className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400" : "bg-red-400"}`}
        />
        <span className="text-caption text-white/80">
          {isOnline
            ? "• متاح لاستقبال المهام · ستصلك مهام جديدة تلقائياً حسب الموقع والأولوية"
            : "• غير متاح حالياً · لن تصلك مهام جديدة"}
        </span>
      </div>

      {/* Stats grid */}
      <div dir="ltr" className="grid grid-cols-3 gap-3">
        {[
          { num: currentTasks, label: "المهام الحالية" },
          { num: completedToday, label: "المكتملة اليوم" },
          { num: totalTasks, label: "إجمالي المهام" },
        ].map(({ num, label }) => (
          <div
            key={label}
            className="bg-white/15 rounded-lg px-3 py-3 text-center"
          >
            <p className="text-h1 font-medium">{num}</p>
            <p className="text-caption text-white/70 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
