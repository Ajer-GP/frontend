import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import OrderStepper from "@/app/_components/orders/OrderStepper";
import OrderSummaryCard from "@/app/_components/orders/OrderSummaryCard";
import Image from "next/image";
import Link from "next/link";
import { getAndGuardRental } from "@/Modules/User/lib/getAndGuardRental";
import HowItWorks from "@/app/_components/ProductDetails/How-it-works";
import ReturnRefundPolicy from "@/app/_components/ProductDetails/ReturnRefundPolicy";
import CancelRentalButton from "@/Modules/User/Features/Rent/components/CancelRentalButton";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ActivePage({ params }: Props) {
  const { id } = await params;

  const rental = await getAndGuardRental(id, "active");
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
        <h1 className="text-h1">تم دفع باقي الحساب بنجاح</h1>
        <p className="text-body-sm text-text-secondary">
          أصبحت عملية التأجير مفعلة الآن ويمكنك البدء في استخدام المنتج خلال
          فترة الإيجار المحددة.
        </p>
        <button className="border border-[#1A6B4A] text-[#1A6B4A] bg-[#E8F0ED] text-body-sm px-4 py-1.5 rounded-full">
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
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          عملية مكتملة
        </button>
      </div>

      {/* Stepper */}
      <div className="border border-border-default rounded-xl p-4">
        <p className="text-caption text-text-secondary mb-3">متابعة الطلب</p>
        <OrderStepper currentStep={5} />
      </div>

      <HowItWorks currentStep={5} />
      <ReturnRefundPolicy />
    </div>
  );
}
