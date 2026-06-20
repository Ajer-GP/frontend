"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { submitReturnPickupForm } from "@/Modules/Delivery/Features/services/delivery.actions";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

interface UploadSlot {
  file: File | null;
  preview: string | null;
}

const REQUIRED_PHOTOS = 4;

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: "working", label: "الجهاز يعمل بشكل طبيعي", checked: true },
  { id: "charger", label: "الشاحن مرفق", checked: true },
  { id: "no_scratch", label: "لا توجد خدوش ظاهرة", checked: true },
  { id: "ports", label: "المنافذ تعمل بشكل سليم", checked: false },
];

// ─── StatusBanner ─────────────────────────────────────────────────────────────

function StatusBanner({ orderId }: { orderId: string }) {
  return (
    <div className="rounded-2xl bg-[var(--brand-primary)] px-5 py-4 flex items-center justify-between flex-row-reverse">
      <div className="text-right">
        <div className="flex items-center gap-2 justify-end mb-0.5">
          <span className="text-white/60 text-caption">{orderId}</span>
          <span className="text-white/60 text-caption">:رقم المهمة</span>
        </div>
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

// ─── OrderSummary ─────────────────────────────────────────────────────────────

function OrderSummary() {
  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-primary)] p-5">
      <h2 className="text-h2 text-[var(--text-primary)] mb-4 text-right">
        ملخص الطلب
      </h2>

      <div className="flex items-start gap-4 flex-row-reverse">
        <div className="relative w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden border border-[var(--border-default)] bg-[var(--surface-tertiary)]">
          <Image
            src="/camera-placeholder.jpg"
            alt="المنتج"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 text-right">
          <span className="inline-block bg-[var(--surface-tertiary)] text-[var(--text-secondary)] text-caption px-2 py-0.5 rounded-full mb-1">
            كاميرا
          </span>
          <h3 className="text-h3 text-[var(--text-primary)] leading-snug">
            كاميرا سوني ألفا A7 IV بدون مرآة (Mirrorless)
          </h3>
          <div className="flex items-center gap-1.5 justify-end mt-1">
            <span className="text-caption text-[var(--text-secondary)]">
              المالك
            </span>
            <span className="text-caption text-[var(--text-primary)] font-medium">
              بسنت خالد
            </span>
          </div>
        </div>
      </div>

      <hr className="my-4 border-[var(--border-default)]" />

      <div className="grid grid-cols-4 gap-3 text-right">
        {[
          { label: "تاريخ البداية", value: "02/05/2026" },
          { label: "تاريخ التسليم", value: "05/05/2026" },
          { label: "المدة", value: "3 أيام" },
          { label: "الحساب اليومي", value: "100" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <span className="text-caption text-[var(--text-tertiary)]">
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

// ─── InspectionChecklist ──────────────────────────────────────────────────────

function InspectionChecklist({
  items,
  onItemsChange,
  note,
  onNoteChange,
}: {
  items: ChecklistItem[];
  onItemsChange: (items: ChecklistItem[]) => void;
  note: string;
  onNoteChange: (v: string) => void;
}) {
  const toggle = (id: string) =>
    onItemsChange(
      items.map((item) =>
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

      <div className="mt-4">
        <p className="text-caption text-[var(--text-tertiary)] text-right mb-2">
          الإبلاغ عن ضرر أو اكتشاف أحد عناصر قائمة الفحص
        </p>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="مثال: يوجد خدش..."
          dir="rtl"
          rows={2}
          className="w-full resize-none rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)]
                     px-3 py-2 text-body-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]
                     focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
        />
      </div>
    </section>
  );
}

// ─── InspectionPhotos ─────────────────────────────────────────────────────────

function InspectionPhotos({
  onCountChange,
  onFilesChange,
}: {
  onCountChange: (count: number) => void;
  onFilesChange: (files: (File | null)[]) => void;
}) {
  const [slots, setSlots] = useState<UploadSlot[]>(
    Array.from({ length: REQUIRED_PHOTOS }, () => ({
      file: null,
      preview: null,
    })),
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const targetSlotRef = useRef<number>(0);

  const uploadedCount = slots.filter((s) => s.preview !== null).length;

  const openPicker = (idx: number) => {
    targetSlotRef.current = idx;
    inputRef.current?.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    const idx = targetSlotRef.current;

    setSlots((prev) => {
      const next = prev.map((s, i) => (i === idx ? { file, preview } : s));
      onCountChange(next.filter((s) => s.preview !== null).length);
      onFilesChange(next.map((s) => s.file));
      return next;
    });
    e.target.value = "";
  };

  const removeSlot = (idx: number) => {
    setSlots((prev) => {
      const next = prev.map((s, i) =>
        i === idx ? { file: null, preview: null } : s,
      );
      onCountChange(next.filter((s) => s.preview !== null).length);
      onFilesChange(next.map((s) => s.file));
      return next;
    });
  };

  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-primary)] p-5">
      <div className="flex items-center justify-between mb-4 flex-row-reverse">
        <h2 className="text-h2 text-[var(--text-primary)]">صور الفحص</h2>
        <span
          className={`text-caption font-medium px-2.5 py-1 rounded-full transition-colors
          ${
            uploadedCount === REQUIRED_PHOTOS
              ? "bg-[var(--semantic-success-bg)] text-[var(--semantic-success)]"
              : "bg-[var(--surface-tertiary)] text-[var(--text-tertiary)]"
          }`}
        >
          {uploadedCount} / {REQUIRED_PHOTOS}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      <div className="grid grid-cols-4 gap-3">
        {slots.map((slot, idx) => (
          <div key={idx} className="relative aspect-square">
            {slot.preview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slot.preview}
                  alt={`صورة ${idx + 1}`}
                  className="w-full h-full object-cover rounded-xl border-2 border-[var(--brand-primary)]"
                />
                <button
                  type="button"
                  onClick={() => removeSlot(idx)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--semantic-danger)] rounded-full flex items-center justify-center shadow-sm"
                >
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
                      d="M2 2l8 8M10 2l-8 8"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => openPicker(idx)}
                className="w-full h-full rounded-xl border-2 border-dashed border-[var(--border-default)]
                           bg-[var(--surface-secondary)] flex flex-col items-center justify-center gap-1
                           hover:border-[var(--brand-mid)] hover:bg-[var(--brand-light)] transition-colors"
              >
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
                <span className="text-[10px] text-[var(--text-secondary)] text-center leading-tight px-1">
                  اسحب وأفلت صورك هنا
                </span>
                <span className="text-[9px] text-[var(--text-tertiary)]">
                  أو اضغط للرفع
                </span>
              </button>
            )}
          </div>
        ))}
      </div>

      {uploadedCount < REQUIRED_PHOTOS && (
        <p className="mt-3 text-caption text-[var(--text-tertiary)] text-right">
          يجب رفع {REQUIRED_PHOTOS} صور لتفعيل زر التأكيد{" "}
          <span className="text-[var(--semantic-warning)] font-medium">
            (تبقى {REQUIRED_PHOTOS - uploadedCount})
          </span>
        </p>
      )}
    </section>
  );
}

// ─── ConfirmButton ────────────────────────────────────────────────────────────

function ConfirmButton({
  isActive,
  deliveryId,
  files,
  note,
  checkedItems,
}: {
  isActive: boolean;
  deliveryId: string;
  files: (File | null)[];
  note: string;
  checkedItems: ChecklistItem[];
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = async () => {
    if (!isActive || loading || done) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("deliveryId", deliveryId);
      if (note) formData.append("deliveryRepNotes", note);

      // بنبعت الـ ids بس للـ checked items
      const checkedIds = checkedItems.filter((i) => i.checked).map((i) => i.id);
      formData.append("checkedItems", JSON.stringify(checkedIds));

      for (const file of files) {
        if (file) formData.append("images", file);
      }

      await submitReturnPickupForm(formData);
      setDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleConfirm}
        disabled={!isActive || loading || done}
        className={`w-full text-h3 font-medium py-3.5 rounded-2xl
                    flex items-center justify-center gap-2 transition-all
                    ${
                      isActive && !done
                        ? "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-dark)] cursor-pointer"
                        : done
                          ? "bg-[var(--semantic-success-bg)] text-[var(--semantic-success)] cursor-default"
                          : "bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] cursor-not-allowed"
                    }`}
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : done ? (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            تم التأكيد بنجاح
          </>
        ) : (
          <>
            {!isActive && (
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            )}
            تأكيد الاستلام
          </>
        )}
      </button>

      {!isActive && !done && (
        <p className="text-caption text-[var(--text-tertiary)] text-center">
          ارفع 4 صور للفحص لتفعيل هذا الزر
        </p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface ReturnPickupInspectionPageProps {
  orderId: string;
}

export default function ReturnPickupInspectionPage({
  orderId,
}: ReturnPickupInspectionPageProps) {
  const [uploadedCount, setUploadedCount] = useState(0);
  const [files, setFiles] = useState<(File | null)[]>(
    Array(REQUIRED_PHOTOS).fill(null),
  );
  const [note, setNote] = useState("");
  const [checklistItems, setChecklistItems] =
    useState<ChecklistItem[]>(INITIAL_CHECKLIST);

  const isReady = uploadedCount >= REQUIRED_PHOTOS;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[var(--surface-secondary)] pb-10"
    >
      <div className="px-4 py-3 flex items-center gap-1.5 text-caption text-[var(--text-tertiary)]">
        <span>الرئيسية</span>
        <span>/</span>
        <span>جميع المهام</span>
        <span>/</span>
        <span className="text-[var(--text-primary)]">
          فحص الاستلام والإرجاع
        </span>
      </div>

      <div className="px-4 flex flex-col gap-4 max-w-full mx-auto">
        <StatusBanner orderId={orderId} />
        <OrderSummary />

        <InspectionChecklist
          items={checklistItems}
          onItemsChange={setChecklistItems}
          note={note}
          onNoteChange={setNote}
        />

        <InspectionPhotos
          onCountChange={setUploadedCount}
          onFilesChange={setFiles}
        />

        <ConfirmButton
          isActive={isReady}
          deliveryId={orderId}
          files={files}
          note={note}
          checkedItems={checklistItems}
        />
      </div>
    </main>
  );
}
