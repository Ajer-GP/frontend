import OrderStepper from "@/app/_components/orders/OrderStepper";
import OrderSummaryCard from "@/app/_components/orders/OrderSummaryCard";
import HowItWorks from "@/app/_components/ProductDetails/How-it-works";
import Image from "next/image";
import { getAndGuardRental } from "@/Modules/User/lib/getAndGuardRental";
import PaymentWrapper from "@/app/_components/orders/PaymentWrapper";
import { getPaymentStatus } from "@/app/_actions/getPaymentStatus.action";
import ImportantInfo from "@/app/_components/ImportantInfo";
import ReturnRefundPolicy from "@/app/_components/ProductDetails/ReturnRefundPolicy";
import { confirmDeliveryArrival } from "@/app/_actions/confirmDeliveryArrival.action";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent?: string }>; // ← أضيفي
}
// // util/sleep.ts
// export
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default async function ConfirmedPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { payment_intent } = await searchParams; // ← أضيفي

  const rental = await getAndGuardRental(id, "confirmed");

  // لو جاي من Stripe redirect، نادي confirmDeliveryArrival
  // ConfirmedPage

  if (payment_intent) {
    await sleep(2000);
    try {
      const data = await confirmDeliveryArrival(id);
      console.log("confirmDeliveryArrival", data);
    } catch (err) {
      console.error("confirm delivery error:", err);
    }
    // ✅ redirect بدون payment_intent في الـ URL
    redirect(`/products/orders/${id}/confirmed`);
  }
  const paymentStatus = await getPaymentStatus(id);
  console.log(paymentStatus, "paymentStatus");
  const paymentStatusValue = paymentStatus?.data?.remaining?.status;

  const isPaid = paymentStatusValue === "paid";
  const isPendingVerification = paymentStatusValue === "pending_verification";
  console.log(rental, "rrrrrrrrrrrrr");
  console.log("orderId:", rental._id);

  const product = {
    name: rental.product.title,
    category: rental.product.name,
    image: rental.product.coverImage.url,
    ownerName: rental.owner.fullName,
    ownerAvatar: rental.owner.profileImage.url,
  };

  const start = new Date(rental.startDate);
  const end = new Date(rental.endDate);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

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
  const amount =
    Number(pricing.insurance ?? 0) +
    Number(pricing.platformFee ?? 0) +
    Number(pricing.rentalPrice ?? 0);
  console.log(pricing, "pricing");

  return (
    <div dir="rtl" className="mx-auto w max-w-7xl p-4 space-y-6">
      {/* Success */}
      <div className="text-center space-y-2 py-6">
        <div className="w-32 h-32 rounded-full bg-brand-light flex items-center justify-center mx-auto">
          <Image
            width={80}
            height={80}
            src="/images/tick-circle.png"
            alt="تم التأكيد"
          />
        </div>
        <h1 className="text-h1">تم دفع العربون وتأكيد طلبكم</h1>
        <p className="text-body-sm text-text-secondary">
          تم تأكيد طلبكم وتعمل الآن على توصيله لكم
        </p>
      </div>

      <div className="border border-border-default rounded-xl p-4">
        <p className="text-h3 mb-3">متابعة الطلب</p>
        <OrderStepper currentStep={4} />
      </div>

      <OrderSummaryCard
        product={product}
        dates={dates}
        pricing={pricing}
        type={"confirmed"}
      />

      {isPaid ? (
        <div
          dir="rtl"
          className="border border-border-default rounded-xl p-6 text-center space-y-2"
        >
          <p className="text-2xl">✅</p>
          <p className="text-h3 font-semibold">تم الدفع</p>
          <p className="text-body-sm text-text-secondary">
            تم ارسال OTP يتم تسليمه لدليفري لاستلام المنتج
          </p>
        </div>
      ) : isPendingVerification ? (
        <div
          dir="rtl"
          className="border border-border-default rounded-xl p-6 text-center space-y-2"
        >
          <p className="text-2xl">⏳</p>
          <p className="text-h3 font-semibold">بانتظار التحقق من الدفع</p>
          <p className="text-body-sm text-text-secondary">
            جاري مراجعة عملية الدفع، سيتم إشعارك عند التأكيد.
          </p>
        </div>
      ) : (
        <PaymentWrapper orderId={rental._id} amount={amount} />
      )}

      <HowItWorks currentStep={3} />

      <ImportantInfo />
      <ReturnRefundPolicy />
    </div>
  );
}
