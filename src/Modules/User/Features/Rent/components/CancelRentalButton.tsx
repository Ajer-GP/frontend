// src/app/_components/orders/CancelRentalButton.tsx

"use client";

import { useState } from "react";
import CancelRentalModal from "./CancelRentalModal";

export default function CancelRentalButton({ rentalId }: { rentalId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full cursor-pointer border border-red-500 text-red-500 rounded-lg py-2.5 text-body-sm hover:bg-red-50 transition-colors"
      >
        إلغاء طلبك
      </button>

      <CancelRentalModal
        rentalId={rentalId}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
