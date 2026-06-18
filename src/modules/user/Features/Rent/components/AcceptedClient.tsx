"use client";
import { useState, useEffect } from "react";
import OrderStepper from "@/app/_components/orders/OrderStepper";
import OrderSummaryCard from "@/app/_components/orders/OrderSummaryCard";
import PaymentPage from "@/app/_components/orders/Payment";
import Image from "next/image";

interface Props {
  orderId: string;
  acceptedAt: string;
  status: string;
  product: {
    name: string;
    category: string;
    image: string;
    ownerName: string;
    ownerAvatar: string;
  };
  dates: {
    start: string;
    end: string;
    days: number;
    dailyRate: number;
  };
  deposit: number;
  deliveryFee: number;
  depositTotal: number;
}

export default function AcceptedClient({
  orderId,
  acceptedAt,
  product,
  dates,
  deposit,
  deliveryFee,
  depositTotal,
  status,
}: Props) {
  // الـ deadline = acceptedAt + 3 ساعات
  const deadline = new Date(acceptedAt).getTime() + 3 * 60 * 60 * 1000;

  const getRemaining = () =>
    Math.max(0, Math.floor((deadline - Date.now()) / 1000));

  const [seconds, setSeconds] = useState(getRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(getRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");

  const deadlineFormatted = new Date(deadline).toLocaleString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div dir="rtl" className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="text-center py-6 space-y-2">
        <div className="w-32 h-32 rounded-full bg-brand-light flex items-center justify-center mx-auto">
          <Image
            width={80}
            height={80}
            src="/images/tick-circle.png"
            alt="تم القبول"
          />
        </div>
        <h1 className="text-h1">تم قبول طلب إيجارك</h1>
        <p className="text-body-sm text-text-secondary">
          تم قبول طلبك من المالك أكمل عملية دفع العربون بالأسفل لضمان إكمال طلبك
        </p>
        <button className="border border-[#BA801A] text-[#BA801A] bg-[#FDF6E9] text-body-sm px-4 py-1.5 rounded-full">
          بانتظار دفع عربون الحجز
        </button>
      </div>

      {/* Stepper */}
      <div className="border border-border-default rounded-xl p-4">
        <p className="text-caption text-text-secondary mb-3">متابعة الطلب</p>
        <OrderStepper currentStep={3} />
      </div>

      {/* Countdown */}
      <div className="bg-[#FFFDFA] border border-[#E8A020] rounded-xl p-4 flex gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 text-warning mt-0.5 shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <div className="flex justify-between items-center w-full">
          <div>
            <p className="text-[18px] font-medium text-text-primary">
              يجب اتمام عملية الدفع خلال 3 ساعات
            </p>
            <p className="text-body-sm text-text-secondary mt-1">
              سيتم إلغاء حجزك تلقائيًا إذا لم يتم إتمام الدفع قبل الموعد
              النهائي.
            </p>
            <p className="text-caption text-text-tertiary mt-1">
              ينتهي في {deadlineFormatted}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {[h, m, s].map((val, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="bg-white border border-[#676767] w-14 h-13 text-center flex justify-center items-center rounded-[20px] px-3 py-1 text-lg font-semibold">
                  {val}
                </div>
                {i < 2 && <span className="text-black font-bold">:</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary + Deposit */}
      <div className="grid grid-cols-2 gap-3">
        <OrderSummaryCard
          product={product}
          dates={dates}
          pricing={null}
          type={"accepted"}
        />
        <div className="border border-border-default rounded-xl p-4">
          <p className="text-caption text-text-secondary mb-3">
            تفاصيل تكلفة العربون
          </p>
          <div className="space-y-2 text-body-sm">
            <div className="flex justify-between">
              <span>{deposit.toLocaleString("ar-EG")} ج.م</span>
              <span className="text-text-secondary">تكلفة العربون</span>
            </div>
            <div className="flex justify-between">
              <span>{deliveryFee.toLocaleString("ar-EG")} ج.م</span>
              <span className="text-text-secondary">سعر التوصيل</span>
            </div>
          </div>
          <div className="flex justify-between font-medium text-brand-primary border-t border-border-default pt-2 mt-2">
            <span>{depositTotal.toLocaleString("ar-EG")} ج.م</span>
            <span>الإجمالي</span>
          </div>
        </div>
      </div>

      {/* Payment */}
      {status === "waiting_for_deposit" ? (
        <div className="border border-[#E8A020] bg-[#FFFDFA] rounded-xl p-6 text-center space-y-2">
          <p className="text-2xl">⏳</p>
          <p className="text-body-sm font-medium text-text-primary">
            في انتظار تأكيد الدفع
          </p>
          <p className="text-caption text-text-secondary">
            تم استلام طلب الدفع وجاري مراجعته، سيتم تأكيد حجزك خلال دقائق.
          </p>
        </div>
      ) : (
        <PaymentPage orderId={orderId} amount={depositTotal} />
      )}
    </div>
  );
}
