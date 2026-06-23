"use client";
import { useState, useRef, useTransition } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { payRemaining } from "@/app/_actions/payRemaning.action";
import { createStripeIntentRemaining } from "@/app/_actions/createStripeIntentRemaining.action";
import { confirmDeliveryArrival } from "@/app/_actions/confirmDeliveryArrival.action";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

type Tab = "card" | "instapay";

// PaymentSection — parent
export default function Paymentremanining({
  orderId,
  amount,
  onSuccess,
}: {
  orderId: string;
  amount: number;
  onSuccess: () => void;
}) {
  const [tab, setTab] = useState<Tab>("instapay");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingStripe, setLoadingStripe] = useState(false);

  const handleTabChange = async (t: Tab) => {
    setTab(t);
    if (t === "card" && !clientSecret) {
      setLoadingStripe(true);
      try {
        const secret = await createStripeIntentRemaining(orderId);
        setClientSecret(secret);
      } catch (err) {
        console.error("stripe intent error:", err);
      } finally {
        setLoadingStripe(false);
      }
    }
  };

  return (
    <div dir="rtl" className="space-y-4">
      <h2 className="text-h2">اختر طريقة الدفع</h2>

      {/* Tabs */}
      <div className="flex rounded-xl border border-border-default overflow-hidden">
        {(["instapay", "card"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTabChange(t)}
            className={`flex-1 py-3 text-body-sm font-medium transition-colors ${
              tab === t
                ? "bg-brand-primary text-white"
                : "bg-surface-primary text-text-secondary"
            }`}>
            {t === "card" ? "بطاقة ائتمان / خصم" : "انستا باي"}
          </button>
        ))}
      </div>

      {tab === "instapay" && (
        <InstapayForm orderId={orderId} amount={amount} onSuccess={onSuccess} />
      )}
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
              options={{ clientSecret, locale: "ar" }}>
              <StripeForm amount={amount} orderId={orderId} />
            </Elements>
          )}
        </>
      )}
    </div>
  );
}

// ── Instapay ───────────────────────────────────────────────────────────────────

function InstapayForm({
  orderId,
  amount,
  onSuccess,
}: {
  orderId: string;
  amount: number;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [waitingAdmin, setWaitingAdmin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = () => {
    if (!file) {
      setError("ارفع صورة التحويل أولاً");
      return;
    }
    setError("");

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("paymentMethod", "instapay");
        fd.append("screenshotUrl", file);

        const result = await payRemaining(orderId, fd);

        const status = result?.rental?.status ?? result?.status;
        if (
          status === "confirmed" ||
          status === "deposit_paid" ||
          status === "remaining_paid"
        ) {
          onSuccess();
        } else {
          setWaitingAdmin(true);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "فشل الإرسال");
      }
    });
  };

  if (waitingAdmin) {
    return (
      <div className="text-center space-y-2 py-6">
        <p className="text-body-sm text-text-secondary">
          تم إرسال الطلب، في انتظار تأكيد الإدارة
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-body-sm">
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

      <div
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-border-default rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-brand-primary transition-colors">
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
          className="bg-brand-primary text-white rounded-lg px-4 py-2 text-caption">
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
        className="w-full bg-brand-primary text-white rounded-lg py-3 text-body-sm font-medium disabled:opacity-50">
        {isPending ? "جاري الإرسال..." : `تأكيد الدفع ${amount} ج.م`}
      </button>
    </div>
  );
}

// ── Stripe ─────────────────────────────────────────────────────────────────────

function StripeForm({ amount, orderId }: { amount: number; orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handlePay = () => {
    if (!stripe || !elements) return;

    startTransition(async () => {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/products/orders/${orderId}/confirmed`,
        },
        // redirect: "if_required",
      });
      if (error) setError(error.message ?? "فشل الدفع");
      //   else{

      //   try {
      //     await confirmDeliveryArrival(orderId);
      //   } catch (err) {
      //     console.error("confirm delivery error:", err);
      //   }
      // };

      // روح لصفحة confirmed يدويًا
      window.location.href = `${window.location.origin}/products/orders/${orderId}/confirmed`;
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
        className="w-full bg-brand-primary text-white rounded-lg py-3 text-body-sm font-medium disabled:opacity-50">
        {isPending ? "جاري الدفع..." : `ادفع ${amount} ج.م`}
      </button>
    </div>
  );
}
