"use client";
import { useRouter } from "next/navigation";
import { startDelivery } from "@/Modules/Delivery/Features/services/delivery.actions";
import { useState } from "react";

type Props = {
  type: string;
  status: "assigned" | "on_the_way" | "picked_up";
  taskId: string;
};

const labelMap: Record<string, string> = {
  assigned: "بدء المهمة",
  on_the_way: "فحص المنتج",
  picked_up: "تأكيد OTP",
};

export default function InspectionButton({ type, status, taskId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const isO2R = type === "from_owner_to_renter";

    if (status === "assigned") {
      setLoading(true);
      try {
        await startDelivery(taskId);
        router.refresh(); // هيعيد fetch الـ page ويحدث الـ status
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (status === "on_the_way") {
      router.push(
        isO2R
          ? `/dashboard/${taskId}/ownerpickupinspection`
          : `/dashboard/${taskId}/returnpickupInspection`,
      );
    } else if (status === "picked_up") {
      router.push(
        isO2R
          ? `/dashboard/${taskId}/otp-renter`
          : `/dashboard/${taskId}/otp-owner`,
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="btn bg-white rounded-4xl w-full sm:w-auto whitespace-nowrap text-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "جارٍ..." : labelMap[status]}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
    </button>
  );
}
