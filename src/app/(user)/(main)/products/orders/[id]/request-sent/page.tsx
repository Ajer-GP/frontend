"use client";
import { useState, useEffect } from "react";
import OrderStepper from "@/app/_components/orders/OrderStepper";
import OrderSummaryCard from "@/app/_components/orders/OrderSummaryCard";
import PaymentPage from "@/app/_components/orders/Payment";
import Image from "next/image";
import Link from "next/link";

type PaymentTab = "card" | "instapay" | "discount";

export default function AcceptedPage() {
  const [tab, setTab] = useState<PaymentTab>("card");
  const [seconds, setSeconds] = useState(3 * 60 * 60); // 3 hours

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");

  return (
    <div dir="rtl" className=" max-w-6xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="text-center py-6 space-y-2">
        <div className="w-32 h-32 rounded-full bg-brand-light flex items-center justify-center mx-auto">
          <Image
            width={80}
            height={80}
            src="/images/tick-circle.png"
            alt="Checkmark"
            className="text-brand-primary text-2xl"
          />
        </div>
        <h1 className="text-h1">تم ارسال طلب ايجار بنجاح</h1>
        <p className="text-body-sm text-text-secondary">
          تم إرسال طلبك إلى المالك للمراجعة، مستنيين إشعاراً بمجرد أن يرد المالك
          على طلبك.
        </p>
        <button className="border border-[#BA801A] text-[#BA801A] bg-[#FDF6E9] text-body-sm px-4 py-1.5 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4 w-4 h-4 inline-block ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          بانتظار موافقة المالك
        </button>
      </div>

      {/* Stepper */}
      <div className="border border-border-default rounded-xl p-4">
        <p className="text-caption text-text-secondary mb-3">متابعة الطلب</p>
        <OrderStepper currentStep={2} />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-3">
        {/* Order Summary */}
        <OrderSummaryCard
          product={{
            name: "كاميرا سوني ألفا A7 IV بدون مرآة (Mirrorless)",
            category: "كاميرا",
            image: "/images/camera.jpg",
            ownerName: "بسنت خالد",
            ownerAvatar: "/images/owner.jpg",
          }}
          dates={{
            start: "02/05/2026",
            end: "05/05/2026",
            days: 3,
            dailyRate: 100,
          }}
          pricing={{
            rentalPrice: 300,
            insurance: 2000,
            delivery: 100,
            platformFee: 20,
            total: 3000,
          }}
        />

        {/* Info + Actions */}
        <div className="border border-border-default rounded-xl p-4 space-y-4">
          <div>
            <p className="text-body-sm font-medium mb-2">ℹ️ معلومات مهمة</p>
            <ul className="space-y-2">
              {[
                "لا يلزم أن تدفع أي مبلغ حتى يقبل المالك طلبك.",
                "ستتلقى إشعارات بكل تحديث لحالة الطلب.",
                "يتم تحديد الحجز فوراً بعد قبول المالك.",
                "يتم تحصيل أمان المضمان قبل استلام المنتج.",
                "تتبع سياسات الإلغاء بعد إتمام العملية المالية.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-caption text-text-secondary border-r-2 border-brand-light pr-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-border-default rounded-lg p-3">
            <p className="text-caption font-medium mb-1">🛡️ محمي بواسطة أجر</p>
            <p className="text-caption text-text-secondary">
              كل عملية إيجار مؤمنة عبر مالكين، وعطاءات، تأمينية، ودعم متواصل.
            </p>
          </div>

          <div className="space-y-2">
            <Link href="/products">
              <button className="w-full bg-brand-primary text-white rounded-lg py-2.5 text-body-sm font-medium">
                استكشف منتجات أخرى
              </button>
            </Link>
            <Link href="/orders">
              <button className="w-full border border-border-default text-text-secondary rounded-lg py-2.5 text-body-sm">
                شاهد طلبات إيجارك
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
