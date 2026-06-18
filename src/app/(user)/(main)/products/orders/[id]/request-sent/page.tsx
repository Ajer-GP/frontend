import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import OrderStepper from "@/app/_components/orders/OrderStepper";
import OrderSummaryCard from "@/app/_components/orders/OrderSummaryCard";
import Image from "next/image";
import Link from "next/link";
import { getAndGuardRental } from "@/Modules/User/lib/getAndGuardRental";
import HowItWorks from "@/app/_components/ProductDetails/How-it-works";
import ReturnRefundPolicy from "@/app/_components/ProductDetails/ReturnRefundPolicy";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RequestSentPage({ params }: Props) {
  const { id } = await params;

  const rental = await getAndGuardRental(id, "pending");
  const start = new Date(rental.startDate);
  const end = new Date(rental.endDate);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  const product = {
    name: rental.product.title,
    category: rental.product.name,
    image: rental.product.coverImage.url,
    ownerName: rental.owner.fullName,
    ownerAvatar: rental.owner.profileImage.url,
  };

  const dates = {
    start: start.toLocaleDateString("ar-EG"),
    end: end.toLocaleDateString("ar-EG"),
    days,
    dailyRate: rental.rentalFee / (days || 1),
  };

  const pricing = {
    rentalPrice: rental.rentalFee,
    insurance: rental.insuranceAmount,
    delivery: rental.deliveryFee,
    platformFee: rental.commissionFee,
    total: rental.totalAmount,
  };

  return (
    <div dir="rtl" className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="text-center py-6 space-y-2">
        <div className="w-32 h-32 rounded-full bg-brand-light flex items-center justify-center mx-auto">
          <Image
            width={80}
            height={80}
            src="/images/tick-circle.png"
            alt="تم الإرسال"
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
            className="size-4 inline-block ml-1">
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
        <OrderSummaryCard
          product={product}
          dates={dates}
          pricing={pricing}
          type={"request"}
        />

        {/* Info + Actions */}
        <div className="border border-border-default rounded-xl p-4 space-y-4">
          <div>
            <p className="text-body-xl font-medium mb-2">ℹ️ معلومات مهمة</p>
            <ul className="space-y-2 text-body-lg ">
              {[
                "لا يلزم أن تدفع أي مبلغ حتى يقبل المالك طلبك.",
                "ستتلقى إشعارات بكل تحديث لحالة الطلب.",
                "يتم تحديد الحجز فوراً بعد قبول المالك.",
                "يتم تحصيل أمان المضمان قبل استلام المنتج.",
                "تتبع سياسات الإلغاء بعد إتمام العملية المالية.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-caption text-text-secondary border-r-2 border-brand-light pr-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-border-default rounded-lg p-3">
            <p className="text-md flex font-medium mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-shield text-green-900">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
              </svg>{" "}
              محمي بواسطة أجر
            </p>
            <p className="text-sm text-text-secondary">
              كل عملية إيجار مؤمنة عبر مالكين، وعطاءات، تأمينية، ودعم متواصل.
            </p>
          </div>

          <div className="space-y-2">
            <Link href="/products">
              <button className="w-full cursor-pointer mb-1 bg-brand-primary text-white rounded-lg py-2.5 text-body-sm font-medium">
                استكشف منتجات أخرى
              </button>
            </Link>
            <Link href="/products/orders">
              <button className="w-full cursor-pointer border border-border-default text-text-secondary rounded-lg py-2.5 text-body-sm">
                شاهد طلبات إيجارك
              </button>
            </Link>
          </div>
        </div>
      </div>
      <HowItWorks />
      <ReturnRefundPolicy />
    </div>
  );
}
