"use client";

import { useState, useRef } from "react";
import { submitPickupForm } from "@/Modules/Delivery/Features/services/delivery.actions";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UploadSlot {
  file: File | null;
  preview: string | null;
}

const REQUIRED_PHOTOS = 4;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBanner({ orderId }: { orderId: string }) {
  return (
    <div className="rounded-2xl bg-[var(--brand-primary)] px-5 py-4 flex items-center justify-between gap-3 flex-row-reverse">
      <div className="text-right flex-1">
        <div className="flex items-center gap-2 justify-end mb-0.5">
          <span className="text-white/60 text-caption">{orderId}</span>
          <span className="text-white/60 text-caption">:رقم المهمة</span>
        </div>
        <h1 className="text-white text-h1 leading-snug">
          استلام المنتج من المالك
        </h1>
        <p className="text-white/70 text-caption mt-1">
          أنت حالياً يجب أن تفحص المنتج وتستلمه من المالك
        </p>
      </div>

      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center overflow-hidden">
          <svg
            className="w-7 h-7 text-white/80"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <span className="absolute -bottom-0.5 -left-0.5 bg-[var(--accent-default)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          قادم
        </span>
      </div>
    </div>
  );
}

function PhotoUploadSection({
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
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--semantic-danger)] rounded-full
                             flex items-center justify-center shadow-sm"
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

function OptionalNotes({
  note,
  onChange,
}: {
  note: string;
  onChange: (v: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-primary)] p-5">
      <h2 className="text-h2 text-[var(--text-primary)] mb-3 text-right">
        ملاحظات إضافية{" "}
        <span className="text-[var(--text-tertiary)] text-body-sm font-normal">
          (اختياري)
        </span>
      </h2>
      <textarea
        value={note}
        onChange={(e) => onChange(e.target.value)}
        placeholder="أضف أي ملاحظات مهمة عن حالة المنتج..."
        dir="rtl"
        rows={3}
        className="w-full resize-none rounded-xl border border-[var(--border-default)]
                   bg-[var(--surface-secondary)] px-3 py-2.5 text-body-sm
                   text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]
                   focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
      />
    </section>
  );
}

function ConfirmButton({
  isActive,
  deliveryId,
  files,
  note,
}: {
  isActive: boolean;
  deliveryId: string;
  files: (File | null)[];
  note: string;
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
      for (const file of files) {
        if (file) formData.append("images", file);
      }

      await submitPickupForm(formData);
      setDone(true);
      router.push(`/dashboard/${deliveryId}/otp-renter`);
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
            تأكيد استلام المنتج
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

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function OwnerPickupInspectionPage({
  orderId,
}: {
  orderId: string;
}) {
  const [uploadedCount, setUploadedCount] = useState(0);
  const [files, setFiles] = useState<(File | null)[]>(
    Array(REQUIRED_PHOTOS).fill(null),
  );
  const [note, setNote] = useState("");

  const isReady = uploadedCount >= REQUIRED_PHOTOS;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[var(--surface-secondary)] pb-10"
    >
      <div className="flex flex-row-reverse">
        <div className="flex-1 px-4 py-4 max-w-full mx-auto w-full">
          <div className="flex items-center gap-1.5 text-caption text-[var(--text-tertiary)] mb-3">
            <span>الرئيسية</span>
            <span>/</span>
            <span>المهام الحالية</span>
            <span>/</span>
            <span className="text-[var(--text-primary)]">{orderId}</span>
          </div>

          <div className="flex flex-col gap-4">
            <StatusBanner orderId={orderId} />
            <PhotoUploadSection
              onCountChange={setUploadedCount}
              onFilesChange={setFiles}
            />
            <OptionalNotes note={note} onChange={setNote} />
            <ConfirmButton
              isActive={isReady}
              deliveryId={orderId}
              files={files}
              note={note}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
