import OrderStepper from "@/app/_components/orders/OrderStepper";
import OrderSummaryCard from "@/app/_components/orders/OrderSummaryCard";
import HowItWorks from "@/app/_components/ProductDetails/How-it-works";
import Image from "next/image";

export default function ConfirmedPage() {
  const product = {
    name: "كاميرا سوني ألفا A7 IV بدون مرآة (Mirrorless)",
    category: "كاميرا",
    image:
      "https://res.cloudinary.com/dlo09osm6/image/upload/v1780767831/mqm7ter5hnqqlzhstm2q.png",
    ownerName: "بسنت خالد",
    ownerAvatar: "/images/owner.jpg",
  };
  const dates = {
    start: "02/05/2026",
    end: "05/05/2026",
    days: 3,
    dailyRate: 100,
  };
  const pricing = {
    rentalPrice: 400,
    insurance: 2000,
    delivery: 100,
    platformFee: 20,
    total: 3000,
  };
  return (
    <div dir="rtl" className=" mx-auto p-4 space-y-6">
      {/* Success */}
      <div className="text-center space-y-2 py-6">
        <div className="w-32 h-32 rounded-full bg-brand-light flex items-center justify-center mx-auto">
          <Image
            width={80}
            height={80}
            src="/images/tick-circle.png"
            alt="Checkmark"
            className="text-brand-primary text-2xl"
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
