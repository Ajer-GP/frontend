"use client";
import { useState, useRef, useTransition, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { payDepositInstapay } from "@/app/_actions/payDeposit.action";
import { createStripeIntent } from "@/app/_actions/createStripeIntent.action";
import Image from "next/image";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

type Tab = "card" | "instapay";

export default function PaymentSection({
  orderId,
  amount,
}: {
  orderId: string;
  amount: number;
}) {
  const [tab, setTab] = useState<Tab>("card");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingStripe, setLoadingStripe] = useState(false);

  // ← جيبي الـ secret أول ما الـ component يتحمل
  useEffect(() => {
    setLoadingStripe(true);
    createStripeIntent(orderId)
      .then((secret) => {
        console.log("clientSecret:", secret); // ← شوفي إيه اللي بيرجع
        setClientSecret(secret);
        setLoadingStripe(false);
      })
      .catch((err) => {
        console.error("stripe error:", err); // ← لو في error
        setLoadingStripe(false);
      });
  }, [orderId]);

  // const handleTabChange = async (t: Tab) => {
  //   setTab(t);
  // };

  const handleTabChange = async (t: Tab) => {
    setTab(t);
    if (t === "card" && !clientSecret) {
      setLoadingStripe(true);

      const secret = await createStripeIntent(orderId);
      console.log("clientSecret:", secret);
      console.log("orderId:", orderId);
      setClientSecret(secret);
      setLoadingStripe(false);
    }
  };

  return (
    <div dir="rtl" className="space-y-4">
      <h2 className="text-h2">اختر طريقة الدفع</h2>

      {/* Tabs */}
      <div className="flex rounded-xl border border-border-default overflow-hidden">
        {(["card", "instapay"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTabChange(t)}
            className={`flex-1 py-3 text-body-sm font-medium transition-colors
              ${
                tab === t
                  ? "bg-brand-primary text-white"
                  : "bg-surface-primary text-text-secondary"
              }`}
          >
            {t === "card" ? "بطاقة ائتمان / خصم" : "انستا باي"}
          </button>
        ))}
      </div>

      {tab === "instapay" && <InstapayForm orderId={orderId} amount={amount} />}

      {tab === "card" && (
        <>
          {loadingStripe && (
            <p className="text-center text-body-sm text-text-secondary py-4">
              جاري التحضير...
            </p>
          )}
          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, locale: "ar" }}
            >
              degrg
              <StripeForm amount={amount} orderId={orderId} />
            </Elements>
          )}
        </>
      )}
    </div>
  );
}
function InstapayForm({
  orderId,
  amount,
}: {
  orderId: string;
  amount: number;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = () => {
    if (!file) {
      setError("ارفع صورة التحويل أولاً");
      return;
    }
    setError("");

    startTransition(async () => {
      const fd = new FormData();
      fd.append("payment_method", "instapay");
      fd.append("screenshot", file);
      await payDepositInstapay(orderId, fd);
      // redirect or show success
    });
  };

  return (
    <div className="space-y-4 text-body-sm">
      {/* Steps */}
      <div className="bg-accent-light border border-accent-default rounded-xl p-4">
        <p className="font-medium text-warning mb-2">ℹ️ خطوات الدفع</p>
        <ul className="space-y-1.5 text-text-secondary list-disc list-inside">
          <li>
            حول مبلغ العربون{" "}
            <strong className="text-text-primary">{amount} ج.م</strong> على رقم
            انستا باي الخاص بالمنصة وهو{" "}
            <strong className="text-text-primary">01503011169</strong>
          </li>
          <li>ارفع صورة من التحويل وانتظر دقائق حتى يتم تأكيد الحجز</li>
        </ul>
      </div>

      {/* Upload */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-border-default rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-brand-primary transition-colors"
      >
        {preview ? (
          <Image
            width={160}
            height={160}
            src={preview}
            alt="صورة التحويل"
            className="max-h-40 rounded-lg object-contain"
          />
        ) : (
          <>
            <span className="text-3xl text-text-tertiary">↑</span>
            <p className="text-text-secondary">اسحب وأفلت صورتك هنا</p>
          </>
        )}
        <button
          type="button"
          className="bg-brand-primary text-white rounded-lg px-4 py-2 text-caption"
        >
          تصفح ملفات الجهاز
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>

      {error && <p className="text-caption text-danger">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || !file}
        className="w-full bg-brand-primary text-white rounded-lg py-3 text-body-sm font-medium disabled:opacity-50"
      >
        {isPending ? "جاري الإرسال..." : `تأكيد الدفع ${amount} ج.م`}
      </button>
    </div>
  );
}
// غيري الـ function signature
function StripeForm({ amount, orderId }: { amount: number; orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handlePay = () => {
    if (!stripe || !elements) return;
    setError("");

    startTransition(async () => {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/products/orders/${orderId}/confirmed`,
        },
      });
      if (error) setError(error.message ?? "فشل الدفع");
    });
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      {error && <p className="text-caption text-danger">{error}</p>}
      <button
        type="button"
        onClick={handlePay}
        disabled={isPending || !stripe}
        className="w-full bg-brand-primary text-white rounded-lg py-3 text-body-sm font-medium disabled:opacity-50"
      >
        {isPending ? "جاري الدفع..." : `ادفع ${amount} ج.م`}
      </button>
    </div>
  );
}
