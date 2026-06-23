"use client";
import { useState, useRef, useTransition } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { payDepositInstapay } from "@/app/_actions/payDeposit.action";
import { createStripeIntent } from "@/app/_actions/createStripeIntent.action";
import { useRouter } from "next/navigation";
import Image from "next/image";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

type Tab = "card" | "instapay";

// PaymentSection — parent
("use client");
import { useState, useRef, useTransition } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { payDepositInstapay } from "@/app/_actions/payDeposit.action";
import { createStripeIntent } from "@/app/_actions/createStripeIntent.action";
import { useRouter } from "next/navigation";
import Image from "next/image";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

type Tab = "card" | "instapay";

type Address = {
  street: string;
  floor: string;
  apartment: string;
  landmark: string;
  building: string;
};

const EMPTY_ADDRESS: Address = {
  street: "",
  floor: "",
  apartment: "",
  landmark: "",
  building: "",
};

// ── PaymentSection ─────────────────────────────────────────────────────────────

export default function PaymentSection({
  orderId,
  amount,
}: {
  orderId: string;
  amount: number;
}) {
  const [tab, setTab] = useState<Tab>("instapay");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [addressConfirmed, setAddressConfirmed] = useState(false);

  const handleStripeConfirmAddress = async (address: Address) => {
    if (clientSecret) {
      setAddressConfirmed(true);
      return;
    }
    setLoadingStripe(true);
    try {
      const secret = await createStripeIntent(orderId, address);
      setClientSecret(secret);
      setAddressConfirmed(true);
    } catch (err) {
      console.error("stripe intent error:", err);
    } finally {
      setLoadingStripe(false);
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
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-body-sm font-medium transition-colors ${
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
          {!addressConfirmed && !loadingStripe && (
            <StripeAddressStep onConfirm={handleStripeConfirmAddress} />
          )}
          {addressConfirmed && clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, locale: "ar" }}
            >
              <StripeForm
                amount={amount}
                orderId={orderId}
                onEditAddress={() => setAddressConfirmed(false)}
              />
            </Elements>
          )}
        </>
      )}
    </div>
  );
}
// export default function PaymentSection({
//   orderId,
//   amount,
// }: {
//   orderId: string;
//   amount: number;
// }) {
//   const [tab, setTab] = useState<Tab>("instapay");
//   const [clientSecret, setClientSecret] = useState<string | null>(null);
//   const [loadingStripe, setLoadingStripe] = useState(false);
//   const [addressConfirmed, setAddressConfirmed] = useState(false); // ← جديد

//   const handleStripeConfirmAddress = async (address: Address) => {
//     // لو عندنا secret خلاص — متعملش intent جديد
//     if (clientSecret) {
//       setAddressConfirmed(true);
//       return;
//     }

//     setLoadingStripe(true);
//     try {
//       const secret = await createStripeIntent(orderId, address);
//       setClientSecret(secret);
//       setAddressConfirmed(true);
//     } catch (err) {
//       console.error("stripe intent error:", err);
//     } finally {
//       setLoadingStripe(false);
//     }
//   };

//   return (
//     <div dir="rtl" className="space-y-4">
//       {/* Tabs ... */}

//       {tab === "card" && (
//         <>
//           {loadingStripe && (
//             <p className="text-center text-body-sm text-text-secondary py-4">
//               جاري التحضير...
//             </p>
//           )}

//           {!addressConfirmed && !loadingStripe && (
//             <StripeAddressStep onConfirm={handleStripeConfirmAddress} />
//           )}

//           {addressConfirmed && clientSecret && (
//             <Elements
//               stripe={stripePromise}
//               options={{ clientSecret, locale: "ar" }}
//             >
//               <StripeForm
//                 amount={amount}
//                 orderId={orderId}
//                 onEditAddress={() => setAddressConfirmed(false)} // ← بس كده
//               />
//             </Elements>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
// export default function PaymentSection({
//   orderId,
//   amount,
// }: {
//   orderId: string;
//   amount: number;
// }) {
//   const [tab, setTab] = useState<Tab>("instapay");
//   const [clientSecret, setClientSecret] = useState<string | null>(null);
//   const [loadingStripe, setLoadingStripe] = useState(false);
//   const [stripeAddress, setStripeAddress] = useState<Address>(EMPTY_ADDRESS); // ← هنا

//   // بيتنادى لما يدوس "متابعة" في step العنوان
//   const handleStripeConfirmAddress = async (address: Address) => {
//     setStripeAddress(address);
//     setLoadingStripe(true);
//     try {
//       const secret = await createStripeIntent(orderId, address); // ← بيبعت العنوان
//       setClientSecret(secret);
//     } catch (err) {
//       console.error("stripe intent error:", err);
//     } finally {
//       setLoadingStripe(false);
//     }
//   };

//   const handleTabChange = (t: Tab) => {
//     setTab(t);
//     // مش بتنادي createStripeIntent هنا خالص
//   };

//   return (
//     <div dir="rtl" className="space-y-4">
//       <h2 className="text-h2">اختر طريقة الدفع</h2>

//       {/* Tabs */}
//       <div className="flex rounded-xl border border-border-default overflow-hidden">
//         {(["instapay", "card"] as Tab[]).map((t) => (
//           <button
//             key={t}
//             type="button"
//             onClick={() => handleTabChange(t)}
//             className={`flex-1 py-3 text-body-sm font-medium transition-colors ${
//               tab === t
//                 ? "bg-brand-primary text-white"
//                 : "bg-surface-primary text-text-secondary"
//             }`}
//           >
//             {t === "card" ? "بطاقة ائتمان / خصم" : "انستا باي"}
//           </button>
//         ))}
//       </div>

//       {tab === "instapay" && <InstapayForm orderId={orderId} amount={amount} />}

//       {tab === "card" && (
//         <>
//           {loadingStripe && (
//             <p className="text-center text-body-sm text-text-secondary py-4">
//               جاري التحضير...
//             </p>
//           )}
//           {/* لو لسه مفيش secret → اعرض step العنوان */}
//           {!clientSecret && !loadingStripe && (
//             <StripeAddressStep onConfirm={handleStripeConfirmAddress} />
//           )}
//           {/* لو جاب secret → اعرض PaymentElement */}
//           {clientSecret && (
//             <Elements
//               stripe={stripePromise}
//               options={{ clientSecret, locale: "ar" }}
//             >
//               <StripeForm
//                 amount={amount}
//                 orderId={orderId}
//                 onEditAddress={() => {
//                   // لو عايزة ترجعي للعنوان
//                   setClientSecret(null);
//                   setStripeAddress(EMPTY_ADDRESS);
//                 }}
//               />
//             </Elements>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
// ── Instapay ───────────────────────────────────────────────────────────────────

function InstapayForm({
  orderId,
  amount,
}: {
  orderId: string;
  amount: number;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS); // ← جديد
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
    const missing = Object.values(address).some((v) => !v.trim());
    if (missing) {
      setError("أكمل بيانات العنوان كاملة");
      return;
    } // ← جديد
    setError("");

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("payment_method", "instapay");
        fd.append("screenshot", file);

        // const result = await payDepositInstapay(orderId, fd, address);
        // const fd = new FormData();
        // fd.append("payment_method", "instapay");
        // fd.append("screenshot", file);
        // // ← أضف العنوان
        // fd.append("street", address.street);
        // fd.append("floor", address.floor);
        // fd.append("apartment", address.apartment);
        // fd.append("landmark", address.landmark);
        // fd.append("building", address.building);
        // formData.append("location", JSON.stringify(address));
        // const result = await payDepositInstapay(orderId, fd, address);
        const result = await payDepositInstapay(orderId, fd, address);
        console.log("result كامل:", JSON.stringify(result));
        const status = result?.payment?.status ?? result?.status;
        if (status === "paid" || status === "deposit_paid") {
          window.location.href = `/products/orders/${orderId}/confirmed`;
        } else {
          setWaitingAdmin(true);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "فشل الإرسال");
      }
    });
  };

  if (waitingAdmin) {
    /* نفس الـ JSX القديم بدون تغيير */
  }

  return (
    <div className="space-y-4 text-body-sm">
      {/* بيانات الدفع — نفس الـ JSX القديم */}
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

      {/* drag & drop — نفس القديم */}
      <div
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
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

      {/* ← العنوان */}
      <AddressFields value={address} onChange={setAddress} />

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

// ── Stripe ─────────────────────────────────────────────────────────────────────

type StripeStep = "address" | "payment";

function StripeForm({
  amount,
  orderId,
  onEditAddress,
}: {
  amount: number;
  orderId: string;
  onEditAddress: () => void;
}) {
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
      });
      if (error) setError(error.message ?? "فشل الدفع");
    });
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onEditAddress}
        className="text-caption text-text-secondary underline"
      >
        ← تعديل العنوان
      </button>

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
// PaymentSection.tsx  — الجزء المتغير بس

// ── نوع العنوان ────────────────────────────────────────────────────────────────
type Address = {
  street: string;
  floor: string;
  apartment: string;
  landmark: string;
  building: string;
};

const EMPTY_ADDRESS: Address = {
  street: "",
  floor: "",
  apartment: "",
  landmark: "",
  building: "",
};

// ── مكوّن حقول العنوان (مشترك بين Instapay وStripe) ───────────────────────────
function AddressFields({
  value,
  onChange,
}: {
  value: Address;
  onChange: (v: Address) => void;
}) {
  const field = (key: keyof Address, label: string, placeholder: string) => (
    <div className="flex flex-col gap-1">
      <label className="text-caption text-text-secondary">{label}</label>
      <input
        type="text"
        value={value[key]}
        onChange={(e) => onChange({ ...value, [key]: e.target.value })}
        placeholder={placeholder}
        className="border border-border-default rounded-lg px-3 py-2 text-body-sm bg-surface-primary text-text-primary focus:outline-none focus:border-brand-primary"
      />
    </div>
  );

  return (
    <div className="space-y-3">
      <p className="text-body-sm font-medium text-text-primary">
        عنوان التسليم
      </p>
      {field("street", "الشارع", "اسم الشارع")}
      <div className="grid grid-cols-2 gap-3">
        {field("building", "المبنى", "رقم / اسم المبنى")}
        {field("floor", "الدور", "رقم الدور")}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field("apartment", "الشقة", "رقم الشقة")}
        {field("landmark", "المرحلة / علامة مميزة", "مثلاً: بجوار مسجد...")}
      </div>
    </div>
  );
}
function StripeAddressStep({
  onConfirm,
}: {
  onConfirm: (address: Address) => void;
}) {
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [error, setError] = useState("");

  const handleContinue = () => {
    const missing = Object.values(address).some((v) => !v.trim());
    if (missing) {
      setError("أكمل بيانات العنوان كاملة");
      return;
    }
    setError("");
    onConfirm(address); // ← يبعت للـ parent اللي ينادي createStripeIntent
  };

  return (
    <div className="space-y-4">
      <AddressFields value={address} onChange={setAddress} />
      {error && <p className="text-caption text-danger">{error}</p>}
      <button
        type="button"
        onClick={handleContinue}
        className="w-full bg-brand-primary text-white rounded-lg py-3 text-body-sm font-medium"
      >
        متابعة للدفع
      </button>
    </div>
  );
}
