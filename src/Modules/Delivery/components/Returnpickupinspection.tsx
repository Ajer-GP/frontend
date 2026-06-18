"use client";

import { useState, useRef } from "react";
import Image from "next/image";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

// ─── Static data (في التطبيق الحقيقي هتيجي من props أو server component) ────

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: "working", label: "الجهاز يعمل بشكل طبيعي", checked: true },
  { id: "charger", label: "الشاحن مرفق", checked: true },
  { id: "no_scratch", label: "لا توجد خدوش ظاهرة", checked: true },
  { id: "ports", label: "المنافذ تعمل بشكل سليم", checked: false },
];

// ─── Server Component: ملخص الطلب (لا يحتاج JS) ──────────────────────────────

function OrderSummary() {
  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-primary)] p-5">
      <h2 className="text-h2 text-[var(--text-primary)] mb-4 text-right">
        ملخص الطلب
      </h2>

      {/* Product row */}
      <div className="flex items-start gap-4 flex-row-reverse">
        {/* Product image */}
        <div className="relative w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden border border-[var(--border-default)]">
          <Image
            src="/camera-placeholder.jpg"
            alt="كاميرا سوني ألفا A7 IV"
            fill
            className="object-cover"
          />
        </div>

        {/* Product info */}
        <div className="flex-1 text-right">
          {/* Category badge */}
          <span className="inline-block bg-[var(--surface-tertiary)] text-[var(--text-secondary)] text-caption px-2 py-0.5 rounded-full mb-1">
            كاميرا
          </span>
          <h3 className="text-h3 text-[var(--text-primary)] leading-snug">
            كاميرا سوني ألفا A7 IV بدون مرآة (Mirrorless)
          </h3>
          {/* Owner */}
          <div className="flex items-center gap-1.5 justify-end mt-1">
            <span className="text-caption text-[var(--text-secondary)]">
              المالك
            </span>
            <span className="text-caption text-[var(--text-primary)] font-medium">
              بسنت خالد
            </span>
            <div className="w-5 h-5 rounded-full bg-[var(--surface-tertiary)] overflow-hidden shrink-0">
              <Image
                src="/owner-avatar.jpg"
                alt="بسنت خالد"
                width={20}
                height={20}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-4 border-[var(--border-default)]" />

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3 text-right">
        {[
          { icon: "📅", label: "تاريخ البداية", value: "02/05/2026" },
          { icon: "📅", label: "تاريخ التسليم", value: "05/05/2026" },
          { icon: "⏱", label: "المدة", value: "3 أيام" },
          { icon: "💰", label: "الحساب اليومي", value: "100" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <span className="text-caption text-[var(--text-tertiary)] flex items-center gap-1 justify-end">
              {stat.label}
            </span>
            <span className="text-h3 text-[var(--text-primary)]">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Client Component: قائمة الفحص ───────────────────────────────────────────

function InspectionChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [note, setNote] = useState("");

  const toggle = (id: string) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );

  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-primary)] p-5">
      <h2 className="text-h2 text-[var(--text-primary)] mb-4 text-right">
        قائمة الفحص
      </h2>

      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 flex-row-reverse"
          >
            {/* Custom checkbox */}
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-checked={item.checked}
              role="checkbox"
              className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center border-2 transition-colors
                ${
                  item.checked
                    ? "bg-[var(--brand-primary)] border-[var(--brand-primary)]"
                    : "bg-white border-[var(--border-default)]"
                }`}
            >
              {item.checked && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 12 12"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2 6l3 3 5-5"
                  />
                </svg>
              )}
            </button>
            <span className="text-body-sm text-[var(--text-primary)] flex-1 text-right">
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      {/* Note area */}
      <div className="mt-4">
        <p className="text-caption text-[var(--text-tertiary)] text-right mb-2">
          الإبلاغ عن ضرر أو اكتشاف أحد عناصر قائمة الفحص
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="مثال: يوجد خدش..."
          dir="rtl"
          rows={2}
          className="w-full resize-none rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)]
                     px-3 py-2 text-body-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]
                     focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
        />
      </div>

      {/* Add button */}
      <button
        type="button"
        className="mt-3 flex items-center gap-1.5 bg-[var(--brand-primary)] text-white
                   text-body-sm font-medium px-4 py-2 rounded-xl hover:bg-[var(--brand-dark)] transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        أضف
      </button>
    </section>
  );
}

// ─── Client Component: صور الفحص ─────────────────────────────────────────────

function InspectionPhotos() {
  const [photos, setPhotos] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newUrls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...newUrls].slice(0, 4));
  };

  // We need 4 slots always
  const slots = Array.from({ length: 4 }, (_, i) => photos[i] ?? null);

  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-primary)] p-5">
      <h2 className="text-h2 text-[var(--text-primary)] mb-4 text-right">
        صور الفحص
      </h2>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="grid grid-cols-4 gap-3">
        {slots.map((src, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5
              transition-colors overflow-hidden
              ${
                src
                  ? "border-[var(--brand-primary)] p-0"
                  : "border-[var(--border-default)] bg-[var(--surface-secondary)] hover:border-[var(--brand-mid)] hover:bg-[var(--brand-light)]"
              }`}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={`صورة ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                {/* Upload icon */}
                <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>
                <span className="text-caption text-[var(--text-secondary)] text-center leading-tight">
                  اسحب وأفلت صورك هنا
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)]">
                  أو اضغط للرفع
                </span>
              </>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── Server Component: الـ Banner العلوي ──────────────────────────────────────

function StatusBanner() {
  return (
    <div className="rounded-2xl bg-[var(--brand-primary)] px-5 py-4 flex items-center justify-between flex-row-reverse">
      <div className="text-right">
        <p className="text-white text-body-sm opacity-80">طلب الإيجار</p>
        <h1 className="text-white text-h1 mt-0.5">
          استلام المرتجع من المستأجر
        </h1>
        <p className="text-white text-caption opacity-70 mt-1">
          تأكد من فحص المنتج قبل إتمام الاستلام
        </p>
      </div>
      <span className="bg-white/20 text-white text-body-sm font-medium px-3 py-1.5 rounded-xl whitespace-nowrap">
        تأكيد الاستلام المرتجع
      </span>
    </div>
  );
}

// ─── Client Component: زر التأكيد النهائي ────────────────────────────────────

function ConfirmButton() {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    // هنا بتبعت الـ server action
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    alert("تم تأكيد الاستلام بنجاح ✓");
  };

  return (
    <button
      type="button"
      onClick={handleConfirm}
      disabled={loading}
      className="w-full bg-[var(--brand-primary)] text-white text-h3 font-medium
                 py-3.5 rounded-2xl hover:bg-[var(--brand-dark)] disabled:opacity-60
                 transition-colors flex items-center justify-center gap-2"
    >
      {loading ? (
        <span className="loading loading-spinner loading-sm" />
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          تأكيد الاستلام
        </>
      )}
    </button>
  );
}

// ─── Page Component (Server Component بشكل افتراضي) ──────────────────────────

interface ReturnPickupInspectionPageProps {
  orderId: string;
}

export default function ReturnPickupInspectionPage({
  orderId,
}: ReturnPickupInspectionPageProps) {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[var(--surface-secondary)] pb-10"
    >
      {/* Top nav */}
      <nav className="bg-[var(--surface-primary)] border-b border-[var(--border-default)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">أ</span>
          </div>
          <span className="text-h3 text-[var(--text-primary)]">أجر</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-caption text-[var(--text-tertiary)]">
            14 يونيو 2026
          </span>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[var(--surface-tertiary)] flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[var(--text-secondary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[var(--semantic-danger)] rounded-full" />
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="px-4 py-3 flex items-center gap-1.5 text-caption text-[var(--text-tertiary)]">
        <span>الرئيسية</span>
        <span>/</span>
        <span>جميع المهام</span>
        <span>/</span>
        <span className="text-[var(--text-primary)]">
          فحص الاستلام والإرجاع
        </span>
      </div>

      {/* Content */}
      <div className="px-4 flex flex-col gap-4 max-w-full mx-auto">
        {/* Order ID badge */}
        <div className="flex items-center justify-between">
          <span className="text-caption text-[var(--text-tertiary)] bg-[var(--surface-tertiary)] px-2.5 py-1 rounded-lg">
            {orderId}
          </span>
          <span className="text-caption text-[var(--text-secondary)]">
            الإجراءات الحالية ← طلب الإيجار
          </span>
        </div>

        {/* Banner */}
        <StatusBanner />

        {/* Order summary - Server Component */}
        <OrderSummary />

        {/* Inspection checklist - Client Component */}
        <InspectionChecklist />

        {/* Photos - Client Component */}
        <InspectionPhotos />

        {/* Confirm - Client Component */}
        <ConfirmButton />

        {/* Delivery agent info */}
        <div className="flex items-center justify-end gap-2 text-caption text-[var(--text-tertiary)]">
          <span>قام بالفحص: أحمد القيسي — مندوب توصيل</span>
        </div>
      </div>
    </main>
  );
}
