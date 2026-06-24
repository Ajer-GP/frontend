import OrderStepper from "@/app/_components/orders/OrderStepper";
import OrderSummaryCard from "@/app/_components/orders/OrderSummaryCard";
import Image from "next/image";
import { getAndGuardRental } from "@/Modules/User/lib/getAndGuardRental";
import HowItWorks from "@/app/_components/ProductDetails/How-it-works";
import ReturnRefundPolicy from "@/app/_components/ProductDetails/ReturnRefundPolicy";
import ReviewForm from "@/Modules/User/Features/Rent/components/ReviewForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CompletedPage({ params }: Props) {
  const { id } = await params;

  const rental = await getAndGuardRental(id, [
    "completed",
    "returning_to_owner",
  ]);
  const start = new Date(rental.startDate);
  const end = new Date(rental.endDate);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  console.log(rental);

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
            alt="تم الإرجاع"
          />
        </div>
        <h1 className="text-h1">تمت عملية الإيجار بنجاح</h1>
        <p className="text-body-sm text-text-secondary">
          تم إرجاع المنتج وإغلاق الطلب بنجاح، نشكرك على استخدام المنصة.
        </p>
        <span className="inline-flex items-center gap-1.5 border border-[#1A6B4A] text-[#1A6B4A] bg-[#E8F0ED] text-body-sm px-4 py-1.5 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          مكتمل
        </span>
      </div>

      {/* Stepper */}
      <div className="border border-border-default rounded-xl p-4">
        <p className="text-caption text-text-secondary mb-3">متابعة الطلب</p>
        <OrderStepper currentStep={6} />
      </div>

      {/* Summary + Pricing */}
      <div className="grid grid-cols-2 gap-3">
        <OrderSummaryCard
          product={product}
          dates={dates}
          pricing={pricing}
          type="completed"
        />
        <div className="border border-border-default rounded-xl p-4">
          <p className="text-caption text-text-secondary mb-3">
            تفاصيل التكلفة
          </p>
          <div className="space-y-2 text-body-sm">
            {[
              { label: "سعر الإيجار", value: pricing.rentalPrice },
              { label: "التأمين", value: pricing.insurance },
              { label: "التوصيل", value: pricing.delivery },
              { label: "عمولة المنصة", value: pricing.platformFee },
            ].map((row) => (
              <div key={row.label} className="flex justify-between">
                <span>{row.value.toLocaleString("ar-EG")} ج.م</span>
                <span className="text-text-secondary">{row.label}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-medium text-brand-primary border-t border-border-default pt-2 mt-2">
            <span>{pricing.total.toLocaleString("ar-EG")} ج.م</span>
            <span>الإجمالي</span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="border border-border-default rounded-xl p-4 space-y-3">
        <p className="text-h2 text-text-primary">قيّم تجربتك</p>
        <p className="text-body-sm text-text-secondary">
          رأيك يساعد المستأجرين الآخرين على اتخاذ قرارهم بشكل أفضل.
        </p>
        <ReviewForm rentalId={id} productId={rental.productId} />
      </div>

      <HowItWorks currentStep={7} />
    </div>
  );
}
