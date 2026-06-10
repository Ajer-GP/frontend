"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  step1Schema,
  Step1Data,
  FullFormData,
} from "@/app/_schemas/addProduct.schema";
import { useState } from "react";

const MAIN_CATEGORIES = [
  { id: "electronics", label: "الكترونيات", icon: "💻" },
  { id: "clothes", label: "ملابس", icon: "👗" },
  { id: "events", label: "معدات حفلات", icon: "🎪" },
  { id: "books", label: "كتب", icon: "📚" },
];

const SUB_CATEGORIES: Record<string, string[]> = {
  electronics: ["كاميرات", "لابتوب", "سماعات", "بلايستيشن", "درون"],
  clothes: ["رجالي", "نسائي", "أطفال"],
  events: ["إضاءة", "صوتيات", "ديكور"],
  books: ["روايات", "تعليمية", "أطفال"],
};

const HANDLING_TIPS = [
  "قابل للكسر",
  "سهل الكسر",
  "الكترونيات حساسة",
  "بحفظ بعيداً عن الرطوبة",
];

type Props = { onNext: () => void };

export default function Step1Basics({ onNext }: Props) {
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
    control,
  } = useFormContext<FullFormData>();

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({ control, name: "specs" });
  const {
    fields: accFields,
    append: appendAcc,
    remove: removeAcc,
  } = useFieldArray({ control, name: "accessories" });

  const mainCat = watch("mainCategory");
  const selectedTips = watch("handlingTips") ?? [];
  const condition = watch("condition");

  const handleNext = async () => {
    const valid = await trigger([
      "title",
      "description",
      "mainCategory",
      "subCategory",
      "condition",
      "handlingTips",
    ]);
    if (valid) onNext();
  };

  const toggleTip = (tip: string) => {
    const current = selectedTips;
    setValue(
      "handlingTips",
      current.includes(tip)
        ? current.filter((t) => t !== tip)
        : [...current, tip],
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-body-sm font-medium mb-1">
          عنوان المنتج <span className="text-danger">*</span>
        </label>
        <input
          {...register("title")}
          placeholder='مثال: "كاميرا Canon EOS R5 Mirrorless" مع عدسة 70mm-24'
          className="w-full border border-border-default rounded-lg px-3 py-2.5 text-body-sm text-right focus:border-brand-primary outline-none"
        />
        {errors.title && (
          <p className="text-caption text-danger mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-body-sm font-medium mb-1">
          الوصف <span className="text-danger">*</span>
        </label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="اكتب وصفاً يوضح حالة المنتج، المرفقات القيمة، واي نصائح جيدة للاستخدام."
          className="w-full border border-border-default rounded-lg px-3 py-2.5 text-body-sm text-right focus:border-brand-primary outline-none resize-none"
        />
        {errors.description && (
          <p className="text-caption text-danger mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Main Category */}
      <div>
        <label className="block text-body-sm font-medium mb-2">
          الفئة الرئيسية <span className="text-danger">*</span>
        </label>
        <div className="grid grid-cols-4 gap-3">
          {MAIN_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setValue("mainCategory", cat.id);
                setValue("subCategory", "");
              }}
              className={`border rounded-xl py-3 flex flex-col items-center gap-1 text-body-sm transition-colors
                ${
                  mainCat === cat.id
                    ? "border-brand-primary bg-brand-light text-brand-primary"
                    : "border-border-default text-text-secondary hover:border-brand-primary"
                }`}
            >
              <span className="text-xl">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
        {errors.mainCategory && (
          <p className="text-caption text-danger mt-1">
            {errors.mainCategory.message}
          </p>
        )}
      </div>

      {/* Sub Category */}
      {mainCat && (
        <div>
          <label className="block text-body-sm font-medium mb-2">
            الفئة الفرعية <span className="text-danger">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {SUB_CATEGORIES[mainCat]?.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setValue("subCategory", sub)}
                className={`border rounded-full px-4 py-1.5 text-body-sm transition-colors
                  ${
                    watch("subCategory") === sub
                      ? "border-brand-primary bg-brand-light text-brand-primary"
                      : "border-border-default text-text-secondary"
                  }`}
              >
                {sub}
              </button>
            ))}
          </div>
          {errors.subCategory && (
            <p className="text-caption text-danger mt-1">
              {errors.subCategory.message}
            </p>
          )}
        </div>
      )}

      {/* Specs */}
      <div className="border border-border-default rounded-xl p-4">
        <div className="flex justify-between items-start mb-3">
          <button
            type="button"
            onClick={() => appendSpec({ title: "", value: "" })}
            className="text-body-sm text-brand-primary font-medium flex items-center gap-1"
          >
            + أضف
          </button>
          <div>
            <p className="text-body-sm font-medium">مواصفات المنتج</p>
            <p className="text-caption text-text-secondary">
              أضف مواصفات المؤثر على اتخاذ قراره
            </p>
            <span className="text-caption text-text-tertiary">اختياري</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <label className="text-caption text-text-secondary text-right">
            القيمة
          </label>
          <label className="text-caption text-text-secondary text-right">
            عنوان
          </label>
        </div>
        {specFields.map((field, i) => (
          <div key={field.id} className="grid grid-cols-2 gap-2 mb-2">
            <input
              {...register(`specs.${i}.value`)}
              placeholder="مثال سوني"
              className="border border-border-default rounded-lg px-3 py-2 text-body-sm text-right outline-none focus:border-brand-primary"
            />
            <input
              {...register(`specs.${i}.title`)}
              placeholder="مثال الماركة"
              className="border border-border-default rounded-lg px-3 py-2 text-body-sm text-right outline-none focus:border-brand-primary"
            />
          </div>
        ))}
        <p className="text-caption text-text-tertiary mt-2">
          يمكنك الضغط على زر Enter للإضافة
        </p>
      </div>

      {/* Accessories */}
      <div className="border border-border-default rounded-xl p-4">
        <div className="flex justify-between items-start mb-3">
          <button
            type="button"
            onClick={() => appendAcc({ name: "" })}
            className="text-body-sm text-brand-primary font-medium flex items-center gap-1"
          >
            + أضف
          </button>
          <div>
            <p className="text-body-sm font-medium">مرفقات المنتج</p>
            <p className="text-caption text-text-secondary">
              أضف مرفقات المنتج إن وجدت لساعدة المؤجر على اتخاذ قراره
            </p>
            <span className="text-caption text-text-tertiary">اختياري</span>
          </div>
        </div>
        {accFields.map((field, i) => (
          <input
            key={field.id}
            {...register(`accessories.${i}.name`)}
            placeholder="مثال شاحن"
            className="w-full border border-border-default rounded-lg px-3 py-2 text-body-sm text-right outline-none focus:border-brand-primary mb-2"
          />
        ))}
        <p className="text-caption text-text-tertiary">
          يمكنك الضغط على زر Enter للإضافة
        </p>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-body-sm font-medium mb-2">
          الحالة <span className="text-danger">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "new", label: "جديد", icon: "✨" },
            { value: "like_new", label: "ممتاز", icon: "⭐" },
            { value: "good", label: "جيد", icon: "👍" },
          ].map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() =>
                setValue("condition", c.value as "new" | "like_new" | "good")
              }
              className={`border rounded-xl py-4 flex flex-col items-center gap-1 text-body-sm transition-colors
                ${
                  condition === c.value
                    ? "border-brand-primary bg-brand-light text-brand-primary"
                    : "border-border-default text-text-secondary"
                }`}
            >
              <span className="text-xl">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Handling Tips */}
      <div>
        <label className="block text-body-sm font-medium mb-2">
          إرشادات التعامل <span className="text-danger">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {HANDLING_TIPS.map((tip) => (
            <button
              key={tip}
              type="button"
              onClick={() => toggleTip(tip)}
              className={`border rounded-full px-4 py-1.5 text-body-sm transition-colors
                ${
                  selectedTips.includes(tip)
                    ? "border-brand-primary bg-brand-light text-brand-primary"
                    : "border-border-default text-text-secondary"
                }`}
            >
              {tip}
            </button>
          ))}
        </div>
        {errors.handlingTips && (
          <p className="text-caption text-danger mt-1">
            {errors.handlingTips.message}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-border-default">
        <button
          type="button"
          onClick={handleNext}
          className="bg-brand-primary text-white rounded-lg px-8 py-2.5 text-body-sm font-medium flex items-center gap-2"
        >
          ← أكمل
        </button>
        <button
          type="button"
          className="border border-border-default text-text-secondary rounded-lg px-6 py-2.5 text-body-sm"
        >
          احفظ كمسودة
        </button>
        <span className="text-body-sm text-text-secondary flex items-center gap-1">
          ارجع ←
        </span>
      </div>
    </div>
  );
}
