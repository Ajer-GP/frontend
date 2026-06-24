"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { submitReturnPickupForm } from "@/Modules/Delivery/Features/services/delivery.actions";
import { useRouter } from "next/navigation";
import { TaskDetails } from "../types";

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

function StatusBanner({ orderId, type }: { orderId: string; type: string }) {
  const isReturn = type === "from_renter_to_owner";
  return (
    <div className="rounded-2xl bg-[var(--brand-primary)] px-4 sm:px-5 py-4 flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-between">
      {/* Badge — على موبايل فوق، على sm جنب */}
      <span className="self-end sm:self-auto bg-white/20 text-white text-caption sm:text-body-sm font-medium px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0">
        {isReturn ? "تأكيد الاستلام المرتجع" : "تأكيد التوصيل"}
      </span>

      {/* النص */}
      <div className="text-right min-w-0">
        <div className="flex items-center gap-2 justify-end mb-0.5 flex-wrap">
          <span className="text-white/60 text-caption break-all">
            {orderId}
          </span>
          <span className="text-white/60 text-caption shrink-0">
            :رقم المهمة
          </span>
        </div>
        <h1 className="text-white text-h1 leading-snug">
          {isReturn ? "استلام المرتجع من المستأجر" : "توصيل المنتج للمستأجر"}
        </h1>
        <p className="text-white text-caption opacity-70 mt-1">
          تأكد من فحص المنتج قبل إتمام الاستلام
        </p>
      </div>
    </div>
  );
}

function OrderSummary({ task }: { task: TaskDetails }) {
  const startDate = task.startDate.split("T")[0];
  const endDate = task.endDate.split("T")[0];
  const days = Math.floor(
    Math.abs(
      new Date(task.endDate).getTime() - new Date(task.startDate).getTime(),
    ) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-primary)] p-3 sm:p-5">
      <h2 className="text-h2 text-[var(--text-primary)] mb-3 text-right">
        ملخص الطلب
      </h2>

      {/* صورة فوق على موبايل صغير، جنب على sm+ */}
      <div className="flex flex-col xs:flex-row-reverse gap-3">
        {/* الصورة */}
        <div className="relative w-full xs:w-[80px] xs:h-[80px] h-[140px] shrink-0 rounded-xl overflow-hidden border border-[var(--border-default)] bg-[var(--surface-tertiary)]">
          <Image
            src={task.productCoverImage}
            alt={task.productTitle}
            fill
            className="object-cover"
          />
        </div>

        {/* المعلومات */}
        <div className="flex-1 text-right min-w-0">
          <span className="inline-block bg-[var(--surface-tertiary)] text-[var(--text-secondary)] text-caption px-2 py-0.5 rounded-full mb-1 max-w-full truncate">
            {task.productName}
          </span>
          <h3 className="text-h3 text-[var(--text-primary)] leading-snug line-clamp-2">
            {task.productTitle}
          </h3>
          <div className="flex items-center gap-1 justify-end mt-1">
            <span className="text-caption text-[var(--text-secondary)] shrink-0">
              المالك
            </span>
            <span className="text-caption text-[var(--text-primary)] font-medium truncate">
              {task.ownerName}
            </span>
          </div>
        </div>
      </div>

      <hr className="my-3 border-[var(--border-default)]" />

      {/* Stats — دايماً 2 cols */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-right">
        {[
          { label: "تاريخ البداية", value: startDate },
          { label: "تاريخ التسليم", value: endDate },
          { label: "المدة", value: `${days} أيام` },
          { label: "اليومي", value: `${task.pricePerDay} ج.م` },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5 min-w-0">
            <span className="text-caption text-[var(--text-tertiary)] truncate text-[10px]">
              {stat.label}
            </span>
            <span className="text-body-sm font-semibold text-[var(--text-primary)] truncate">
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
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-primary)] p-4 sm:p-5">
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

  // ✅ FIX: notify parent AFTER render via useEffect, not inside setState setter
  useEffect(() => {
    onCountChange(uploadedCount);
    onFilesChange(slots.map((s) => s.file));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots]);

  const openPicker = (idx: number) => {
    targetSlotRef.current = idx;
    inputRef.current?.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    const idx = targetSlotRef.current;

    setSlots((prev) => prev.map((s, i) => (i === idx ? { file, preview } : s)));
    e.target.value = "";
  };

  const removeSlot = (idx: number) => {
    setSlots((prev) =>
      prev.map((s, i) => (i === idx ? { file: null, preview: null } : s)),
    );
  };

  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-primary)] p-4 sm:p-5">
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

      {/* Responsive grid: 2 cols on mobile, 4 cols on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--brand-primary)] flex items-center justify-center">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
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
                <span className="text-[9px] sm:text-[10px] text-[var(--text-secondary)] text-center leading-tight px-1">
                  اسحب وأفلت صورك هنا
                </span>
                <span className="hidden sm:block text-[9px] text-[var(--text-tertiary)]">
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
  const router = useRouter();

  const handleConfirm = async () => {
    if (!isActive || loading || done) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("deliveryId", deliveryId);
      if (note) formData.append("deliveryRepNotes", note);

      // const checkedIds = checkedItems.filter((i) => i.checked).map((i) => i.id);
      // formData.append("checkedItems", JSON.stringify(checkedIds));

      // ✅ بعت الـ labels بدل الـ ids
      const checkedLabels = checkedItems
        .filter((i) => i.checked)
        .map((i) => i.label);
      formData.append("checkedItems", JSON.stringify(checkedLabels));

      for (const file of files) {
        if (file) formData.append("images", file);
      }

      await submitReturnPickupForm(formData);
      setDone(true);
      router.push(`/dashboard/${deliveryId}/otp-owner`);
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
            تم التأكيد بنجاح جار التحويل ...
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

export default function ReturnPickupInspectionPage({
  orderId,
  taskDeatils,
}: {
  orderId: string;
  taskDeatils: TaskDetails;
}) {
  const [uploadedCount, setUploadedCount] = useState(0);
  const [files, setFiles] = useState<(File | null)[]>(
    Array(REQUIRED_PHOTOS).fill(null),
  );
  const [note, setNote] = useState("");
  // ✅ لو checklist: string[]
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(
    taskDeatils.checklist.map((label, i) => ({
      id: `item-${i}`,
      label,
      checked: true,
    })),
  );

  const isReady = uploadedCount >= REQUIRED_PHOTOS;

  return (
    <main dir="rtl" className="min-h-screen pb-10 w-full">
      {/* Breadcrumb */}
      <div className="px-4 py-3 flex items-center gap-1.5 text-caption text-[var(--text-tertiary)] flex-wrap">
        <span>الرئيسية</span>
        <span>/</span>
        <span>جميع المهام</span>
        <span>/</span>
        <span className="text-[var(--text-primary)]">
          فحص الاستلام والإرجاع
        </span>
      </div>

      {/* Content: centered with max-width on large screens */}
      <div className="px-4 flex flex-col gap-4 w-full max-w-full mx-auto">
        <StatusBanner orderId={orderId} type={taskDeatils.type} />
        <OrderSummary task={taskDeatils} />

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
