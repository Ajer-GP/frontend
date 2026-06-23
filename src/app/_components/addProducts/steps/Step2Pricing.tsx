"use client";
import { useFormContext, useFormState } from "react-hook-form";
import Image from "next/image";
import { FullFormData } from "@/app/_schemas/addProduct.schema";
import { useEffect, useState, useRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { AIPricingSuggetions } from "@/Modules/User/Features/products/services/products.actions";

type PriceField = "pricePerHour" | "pricePerDay" | "pricePerWeek";
type AISuggestionState = "idle" | "loading" | "done" | "error";

const PRICING_OPTIONS = [
  { key: "pricePerHour", label: "السعر في الساعة", icon: "/images/clock.png" },
  {
    key: "pricePerDay",
    label: "السعر في اليوم",
    icon: "/images/calendar-2.png",
  },
  {
    key: "pricePerWeek",
    label: "السعر في الأسبوع",
    icon: "/images/calendar.png",
  },
];

export type Step2Ref = { triggerPricingError: () => void };

const Step2Pricing = forwardRef<Step2Ref>((_, ref) => {
  const { setValue, getValues, watch, control } =
    useFormContext<FullFormData>();
  const { errors } = useFormState({ control });

  const pricePerHour = watch("pricePerHour");
  const pricePerDay = watch("pricePerDay");
  const pricePerWeek = watch("pricePerWeek");
  const insuranceAmount = watch("insuranceAmount");
  const title = watch("title");
  const category = watch("category");
  const condition = watch("condition");
  const description = watch("description");

  const priceValues: Record<PriceField, number | undefined> = {
    pricePerHour,
    pricePerDay,
    pricePerWeek,
  };

  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [pricingError, setPricingError] = useState(false);
  const [checklistInput, setChecklistInput] = useState("");
  const [checklist, setChecklist] = useState<string[]>([]);
  const [aiState, setAiState] = useState<AISuggestionState>("idle");
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useImperativeHandle(ref, () => ({
    triggerPricingError: () => setPricingError(true),
  }));

  useEffect(() => {
    const values = getValues();
    const selected = PRICING_OPTIONS.filter((option) => {
      const value = values[option.key as PriceField];
      return typeof value === "number" && !Number.isNaN(value) && value > 0;
    }).map((option) => option.key);
    if (selected.length > 0) setSelectedPricing(selected);
  }, [getValues]);

  useEffect(() => {
    const allFilled =
      typeof pricePerHour === "number" &&
      pricePerHour > 0 &&
      typeof pricePerDay === "number" &&
      pricePerDay > 0 &&
      typeof pricePerWeek === "number" &&
      pricePerWeek > 0 &&
      typeof insuranceAmount === "number" &&
      insuranceAmount > 0;

    if (!allFilled) {
      setAiState("idle");
      setAiMessage(null);
      setAiSuggestions(null);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      setAiState("loading");
      setAiMessage(null);

      const result = await AIPricingSuggetions({
        title,
        category,
        condition,
        description,
        pricePerHour,
        pricePerDay,
        pricePerWeek,
        insuranceAmount,
      });

      if (!result.success) {
        setAiState("error");
        setAiMessage("تعذر الحصول على اقتراح الذكاء الاصطناعي");
        return;
      }

      setAiSuggestions(result.data.data);
      setAiState("done");
    }, 800);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [pricePerHour, pricePerDay, pricePerWeek, insuranceAmount]);

  const handlePriceChange = (key: PriceField, raw: string) => {
    const next = raw === "" ? undefined : Number(raw);
    setValue(key, Number.isNaN(next) ? undefined : next, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const togglePricing = (key: string) => {
    setSelectedPricing((prev) => {
      const updated = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      if (!updated.includes(key)) {
        setValue(key as PriceField, undefined, { shouldValidate: true });
      }
      if (updated.length > 0) setPricingError(false);
      return updated;
    });
  };

  const addToChecklist = () => {
    if (!checklistInput.trim()) return;
    const updated = [...checklist, checklistInput.trim()];
    setChecklist(updated);
    setValue("checklist", updated);
    setChecklistInput("");
  };

  const removeFromChecklist = (index: number) => {
    const updated = checklist.filter((_, i) => i !== index);
    setChecklist(updated);
    setValue("checklist", updated);
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black">حدد سعر تأجير منتجك</h1>
        <p className="text-sm text-gray-400 my-2">
          اختر الطريقة التي يمكن للمستأجرين من خلالها حجز منتجك.
        </p>
      </div>

      <div className="w-full border border-gray-300 px-4 py-4 bg-gray-50 rounded-3xl space-y-5">
        {/* ── Pricing duration selection ── */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">
            اختر مدة التأجير{" "}
            <span className="text-brand-primary text-lg">*</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRICING_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => togglePricing(option.key)}
                className={`border rounded-xl py-4 flex flex-col items-center gap-1 text-body-sm transition-colors
                  ${
                    selectedPricing.includes(option.key)
                      ? "border-brand-primary bg-brand-light text-brand-primary"
                      : "border-border-default text-text-secondary"
                  }`}>
                <Image
                  src={option.icon}
                  alt={option.label}
                  height={40}
                  width={40}
                />
                {option.label}
              </button>
            ))}
          </div>

          {/* Price inputs */}
          {selectedPricing.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              {PRICING_OPTIONS.filter((o) =>
                selectedPricing.includes(o.key),
              ).map((option) => {
                const flag = aiSuggestions?.flags?.find(
                  (f: any) => f[option.key],
                );
                const flagMessage = flag?.[option.key];
                const suggestedKey =
                  `suggested${option.key.charAt(0).toUpperCase() + option.key.slice(1)}` as keyof typeof aiSuggestions;
                const suggestedValue = aiSuggestions?.[suggestedKey];

                return (
                  <div key={option.key} className="flex flex-col gap-1">
                    <label className="text-body-sm font-medium">
                      {option.label}
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={priceValues[option.key as PriceField] ?? ""}
                      onChange={(e) =>
                        handlePriceChange(
                          option.key as PriceField,
                          e.target.value,
                        )
                      }
                      className={`w-full border rounded-lg px-3 py-2 text-body-sm outline-none transition-colors
                        ${
                          flagMessage
                            ? "border-yellow-400 focus:border-yellow-500"
                            : "border-border-default focus:border-brand-primary"
                        }`}
                    />
                    {errors[option.key as keyof typeof errors] && (
                      <p className="text-caption text-danger mt-1">
                        {
                          (errors[option.key as keyof typeof errors] as any)
                            ?.message
                        }
                      </p>
                    )}
                    {/* AI per-field hint */}
                    {aiState === "done" && (
                      <div
                        className={`text-xs px-2 py-1.5 rounded-lg mt-1 border
                        ${
                          flagMessage
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}>
                        {flagMessage ? (
                          <p>{flagMessage}</p>
                        ) : (
                          <p>✓ السعر مناسب — المقترح: {suggestedValue} ج.م</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* AI loading / error banner */}
          {aiState !== "idle" && (
            <div className="mt-4 space-y-2">
              {aiState === "loading" && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border bg-gray-50 border-gray-200 text-gray-400 text-body-sm">
                  <span className="loading loading-spinner loading-sm shrink-0" />
                  <p>جارٍ تحليل التسعير بالذكاء الاصطناعي...</p>
                </div>
              )}
              {aiState === "error" && (
                <div className="px-4 py-3 rounded-xl border bg-red-50 border-danger text-danger text-body-sm">
                  {aiMessage}
                </div>
              )}
            </div>
          )}
        </div>
        {/* ── end pricing duration div ── */}

        {/* ── Insurance ── */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">
            سعر التأمين <span className="text-brand-primary text-lg">*</span>
          </label>
          <input
            type="number"
            min={0}
            placeholder="0 ج.م"
            value={insuranceAmount ?? ""}
            onChange={(e) => {
              const next =
                e.target.value === "" ? undefined : Number(e.target.value);
              setValue(
                "insuranceAmount",
                Number.isNaN(next) ? undefined : next,
                {
                  shouldValidate: true,
                  shouldDirty: true,
                },
              );
            }}
            className="w-full border border-border-default rounded-lg px-3 py-2.5 text-body-sm text-right focus:border-brand-primary outline-none"
          />
          {errors.insuranceAmount && (
            <p className="text-caption text-danger mt-1">
              {errors.insuranceAmount.message}
            </p>
          )}
          {/* AI insurance hint */}
          {aiState === "done" &&
            aiSuggestions &&
            (() => {
              const flag = aiSuggestions.flags?.find(
                (f: any) => f["insuranceAmount"],
              );
              const flagMessage = flag?.["insuranceAmount"];
              return (
                <div
                  className={`text-xs px-2 py-1.5 rounded-lg mt-2 border
        ${
          flagMessage
            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
            : "bg-green-50 text-green-700 border-green-200"
        }`}>
                  {flagMessage ? (
                    <p>{flagMessage}</p>
                  ) : (
                    <p>
                      ✓ سعر التأمين مناسب — المقترح:{" "}
                      {aiSuggestions.suggestedInsuranceAmount} ج.م
                    </p>
                  )}
                </div>
              );
            })()}
        </div>
      </div>
      {/* ── end gray card ── */}

      {/* Pricing error banner */}
      {pricingError && (
        <div className="flex items-center gap-2 bg-red-50 border border-danger rounded-xl px-4 py-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-danger shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <p className="text-body-sm text-danger font-medium">
            يجب اختيار — بالساعة و باليوم و بالأسبوع
          </p>
        </div>
      )}

      {/* Commission info */}
      <div className="flex border border-brand-primary px-3 py-3 rounded-xl bg-brand-light gap-2 text-brand-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 shrink-0">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
        <p className="text-body-sm">
          يتم خصم عمولة بنسبة 7.5% من قيمة كل عملية تأجير، وتشمل معالجة المدفوعات،
          وتغطية الحماية، وخدمة الدعم.
        </p>
      </div>

      {/* Checklist */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black">احمِ منتجك</h2>
        <p className="text-sm text-gray-400 my-2">
          تُستخدم قائمة التحقق هذه أثناء عمليات فحص الاستلام والتسليم التي
          يجريها فريق التوصيل عند استلام المنتج وإعادته.
        </p>
        <div className="w-full border border-gray-300 px-4 py-4 bg-gray-50 rounded-3xl">
          {checklist.length > 0 && (
            <div className="space-y-3 mb-4">
              {checklist.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4 rounded-full bg-brand-light text-brand-primary w-9 h-9 px-2 py-2">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                  <span className="text-body-sm">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeFromChecklist(i)}
                    className="text-gray-300 hover:text-danger text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className="block mb-1 text-sm text-gray-600">
            إضافة عنصر إلى قائمة التحقق
          </label>
          <div className="flex items-center gap-2 pt-3">
            <input
              type="text"
              value={checklistInput}
              onChange={(e) => setChecklistInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToChecklist();
                }
              }}
              placeholder="مثال: جميع الملحقات مرفقة"
              className="w-full border border-border-default rounded-lg px-3 py-2.5 text-body-sm text-right focus:border-brand-primary outline-none"
            />
            <button
              type="button"
              onClick={addToChecklist}
              className="bg-brand-primary text-white text-body-sm px-4 py-2 rounded-xl shrink-0">
              + أضف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

Step2Pricing.displayName = "Step2Pricing";
export default Step2Pricing;
