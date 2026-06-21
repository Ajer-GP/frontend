import { AddressLike } from "@/Modules/Admin/types/rentals.types";

export function formatAddress(address?: AddressLike | string | null): string {
  if (!address) return "—";
  if (typeof address === "string") return address;
  const parts = [
    address.street,
    address.building,
    address.floor,
    address.home,
    address.mark,
  ].filter(Boolean);
  return parts.length ? parts.join("، ") : "—";
}

export function formatRentalDuration(
  startDate: string,
  endDate: string,
): string {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return "—";
  const days = Math.max(
    1,
    Math.round(Math.abs(end - start) / (1000 * 60 * 60 * 24)),
  );
  return `${days} ${days === 1 ? "يوم" : "أيام"}`;
}
