"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RentalStatus } from "../types/rentals.types";

export default function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("status") ?? "all";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", e.target.value);
    params.set("page", "1"); // reset to page 1 on filter change
    router.push(`?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="select select-bordered select-sm border-gray-300 rounded-xl text-gray-600 focus:outline-none focus:border-brand-primary">
      <option value="all">كل الحالات</option>
      {RentalStatus.map((s) => (
        <option key={s.status} value={s.status}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
