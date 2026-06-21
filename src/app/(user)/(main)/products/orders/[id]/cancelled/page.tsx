// src/app/(renter)/renter/orders/[id]/cancelled/page.tsx

import Link from "next/link";
import Image from "next/image";
import OrderStepper from "@/app/_components/orders/OrderStepper";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CancelledPage({ params }: Props) {
  const { id } = await params;

  return (
    <div dir="rtl" className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="text-center py-8 space-y-3">
        <div className="w-32 h-32 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-h1 text-gray-900">تم إلغاء طلب الإيجار</h1>
        <p className="text-body-sm text-text-secondary max-w-md mx-auto">
          تم إلغاء طلبك بنجاح. إذا كنت قد دفعت أي مبلغ، سيتم استرداده خلال ٣–٥
          أيام عمل.
        </p>

        <span className="inline-flex items-center gap-1.5 border border-red-300 text-red-500 bg-red-50 text-body-sm px-4 py-1.5 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
          تم الإلغاء
        </span>
      </div>

      {/* What happens next */}
      <div className="border border-border-default rounded-xl p-5 space-y-3">
        <p className="text-body-xl font-medium">ماذا يحدث الآن؟</p>
        <ul className="space-y-3">
          {[
            {
              icon: "💰",
              text: "سيتم استرداد أي مبالغ مدفوعة خلال ٣–٥ أيام عمل.",
            },
            {
              icon: "📩",
              text: "ستصلك رسالة تأكيد على بريدك الإلكتروني.",
            },
            {
              icon: "🔄",
              text: "يمكنك إعادة طلب إيجار المنتج في أي وقت.",
            },
            {
              icon: "📞",
              text: "للاستفسار تواصل مع دعم أجر.",
            },
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-caption text-text-secondary border-r-2 border-red-200 pr-3"
            >
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/products">
          <button className="w-full bg-brand-primary text-white rounded-lg py-3 text-body-sm font-medium">
            استكشف منتجات أخرى
          </button>
        </Link>
        <Link href="/renter/orders">
          <button className="w-full border border-border-default text-text-secondary rounded-lg py-3 text-body-sm">
            شاهد طلبات إيجارك
          </button>
        </Link>
      </div>
    </div>
  );
}
