"use client";

import { useState } from "react";

interface DashboardStatsProps {
  currentTasks: number;
  completedToday: number;
  totalTasks: number;
  driverName: string;
}

export default function DashboardStats({
  currentTasks,
  completedToday,
  totalTasks,
  driverName,
}: DashboardStatsProps) {
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div
      className={`rounded-2xl p-6 transition-colors ${
        isAvailable
          ? "bg-brand-primary text-white"
          : "bg-surface-tertiary text-text-secondary"
      }`}
      dir="rtl"
    >
      {/* Top row: status toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Toggle */}
          <button
            role="switch"
            aria-checked={isAvailable}
            onClick={() => setIsAvailable((prev) => !prev)}
            className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              isAvailable ? "bg-white/30" : "bg-border-default"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full shadow transition-all ${
                isAvailable ? "right-0.5 bg-white" : "right-6 bg-text-tertiary"
              }`}
            />
          </button>
          <span
            className={`text-body-sm font-medium ${
              isAvailable ? "text-white" : "text-text-secondary"
            }`}
          >
            {isAvailable ? "متاح لاستقبال المهام" : "غير متاح"}
          </span>
        </div>

        {/* Pulse icon */}
        {isAvailable && <span className="text-white/70 text-lg">〜</span>}
      </div>

      {/* Sub text */}
      {isAvailable && (
        <p className="text-caption text-white/70 mb-6">
          ستستقبل مهام جديدة تلقائياً حسب الموقع والأولوية
        </p>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 divide-x divide-x-reverse divide-white/20">
        <StatBlock
          value={currentTasks}
          label="المهام الحالية"
          isAvailable={isAvailable}
        />
        <StatBlock
          value={completedToday}
          label="المهام المكتملة اليوم"
          isAvailable={isAvailable}
        />
        <StatBlock
          value={totalTasks}
          label="إجمالي المهام"
          isAvailable={isAvailable}
        />
      </div>
    </div>
  );
}

function StatBlock({
  value,
  label,
  isAvailable,
}: {
  value: number;
  label: string;
  isAvailable: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 first:pr-0 last:pl-0">
      <span
        className={`text-display font-medium ${
          isAvailable ? "text-white" : "text-text-primary"
        }`}
      >
        {value}
      </span>
      <span
        className={`text-caption text-center ${
          isAvailable ? "text-white/70" : "text-text-tertiary"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
