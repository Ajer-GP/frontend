"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setDateTime(new Date());
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = dateTime?.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    numberingSystem: "latn",
  });

  const formattedTime = dateTime?.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    numberingSystem: "latn",
  });

  return (
    <div className="navbar bg-white border-b border-gray-200 px-4 gap-3">
      {/* Search — left side */}
      <div className="flex-1 ">
        <label className="input border-0 flex items-center gap-2 w-full max-w-xs rounded-2xl bg-brand-light">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 text-gray-400 shrink-0">
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث برقم الطلب، المنتج، أو العميل..."
            className="grow text-right "
            dir="rtl"
          />
        </label>
      </div>

      {/* Date & Time — right side */}
      <div className="flex-none">
        {dateTime ? (
          <div className="flex flex-col items-end leading-tight" dir="rtl">
            <span className="text-sm font-semibold text-gray-700">
              {formattedDate}
            </span>
            <span className="text-xs text-gray-600 font-mono">
              {formattedTime}
            </span>
          </div>
        ) : (
          <div className="h-8 w-40 animate-pulse bg-gray-100 rounded-lg" />
        )}
      </div>
    </div>
  );
}
