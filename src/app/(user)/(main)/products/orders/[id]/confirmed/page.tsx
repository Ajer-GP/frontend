import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import OrderStepper from "@/app/_components/orders/OrderStepper";
import OrderSummaryCard from "@/app/_components/orders/OrderSummaryCard";
import HowItWorks from "@/app/_components/ProductDetails/How-it-works";
import Image from "next/image";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ConfirmedPage({ params }: Props) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(`${process.env.API_BASE_URL}/requests/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) notFound();

  const { rental } = await res.json();

  // ── map إلى الشكل اللي OrderSummaryCard بتتوقعه
  const product = {
    name: rental.product.title,
    category: "",
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

  return (
    <div dir="rtl" className="mx-auto p-4 space-y-6">
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
        <OrderStepper currentStep={5} />
      </div>

      <OrderSummaryCard product={product} dates={dates} pricing={pricing} />
      <HowItWorks />
    </div>
  );
}
