"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      params.set("q", val.trim());
    } else {
      params.delete("q");
    }
    router.replace(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="relative hidden lg:block">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="ابحث برقم الطلب، المنتج أو العميل..."
        className="w-72 px-4 py-2 rounded-lg border border-border-default bg-surface-secondary text-body-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-mid focus:bg-white transition-colors"
        dir="rtl"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">
        🔍
      </span>
    </div>
  );
}
