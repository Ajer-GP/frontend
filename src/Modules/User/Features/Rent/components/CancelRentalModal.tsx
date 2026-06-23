// src/app/_components/orders/CancelRentalModal.tsx

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelRental } from "../services/Rent.actions";
import { toast } from "sonner";

interface Props {
  rentalId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CancelRentalModal({
  rentalId,
  isOpen,
  onClose,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelRental(rentalId);

      if (result.success) {
        toast.success("تم إلغاء الطلب بنجاح", {
          description: "يمكنك متابعة طلباتك الأخرى من هنا",
          duration: 4000,
        });
        onClose();
        router.push("/products/orders");
      } else {
        toast.error(result.message || "فشل الإلغاء");
      }
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        dir="rtl"
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-5 z-10"
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">
            تأكيد إلغاء الطلب
          </h2>
          <p className="text-sm text-text-secondary">
            هل أنت متأكد أنك تريد إلغاء طلب الإيجار؟ لا يمكن التراجع عن هذا
            الإجراء.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 border border-border-default text-text-secondary rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            لأ، رجّعني
          </button>
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="flex-1 bg-red-500 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-xs" />
                جاري الإلغاء...
              </>
            ) : (
              "نعم، إلغاء الطلب"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
