// PaymentWrapper.tsx  "use client"
"use client";
import { useState } from "react";

import { confirmDeliveryArrival } from "@/app/_actions/confirmDeliveryArrival.action";
import Paymentremanining from "./Paymentremaning";

export default function PaymentWrapper({
  orderId,
  amount,
}: {
  orderId: string;
  amount: number;
}) {
  const [paid, setPaid] = useState(false);

  const handleSuccess = async () => {
    try {
      const data = await confirmDeliveryArrival(orderId);
    } catch (err) {
      console.error("confirm delivery error:", err);
    } finally {
      setPaid(true);
    }
  };

  if (paid) {
    return (
      <div
        dir="rtl"
        className="border border-success rounded-xl p-6 text-center space-y-2 bg-success-light">
        <p className="text-2xl">✅</p>
        <p className="text-h3 text-success font-semibold">تم الدفع بنجاح</p>
        <p className="text-body-sm text-text-secondary">
          تم إرسال كود OTP إلى الديليفري للتأكيد عند الاستلام
        </p>
      </div>
    );
  }

  return (
    <Paymentremanining
      orderId={orderId}
      amount={amount}
      onSuccess={handleSuccess}
    />
  );
}
