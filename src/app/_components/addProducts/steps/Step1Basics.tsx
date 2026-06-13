"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  step1Schema,
  Step1Data,
  FullFormData,
} from "@/app/_schemas/addProduct.schema";
import { useState } from "react";

const MAIN_CATEGORIES = [
  { id: "electronics", label: "الكترونيات", icon: "/images/cat-1.png" },
  { id: "clothes", label: "ملابس", icon: "/images/cat-2.png" },
  { id: "events", label: "معدات حفلات", icon: "/images/cat-3.png" },
  { id: "books", label: "كتب", icon: "/images/cat-4.png" },
];

const HANDLING_TIPS = [
  "قابل للكسر",
  "سهل الكسر",
  "الكترونيات حساسة",
  "بحفظ بعيداً عن الرطوبة",
];
const STATES = [
  { value: "New", label: "جديد", icon: "/images/new.png" },
  {
    value: "Excellent",
    label: "ممتاز",
    icon: "/images/excellent.png",
  },
  { value: "Good", label: "جيد", icon: "/images/like.png" },
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

  const [mainCat, setMainCat] = useState("");
  const [selectedTips, setSelectedTips] = useState<string[]>([]);
  const [condition, setCondition] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const handleImageFiles = (files: FileList | null) => {
    if (!files) return;
    const accepted = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 5 - imagePreviews.length);
    const urls = accepted.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...urls].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };
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
    const updated = selectedTips.includes(tip)
      ? selectedTips.filter((t) => t !== tip)
      : [...selectedTips, tip];
    setSelectedTips(updated);
    setValue("handlingTips", updated);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black">أخبرنا عن منتجك</h1>
        <p className="text-sm text-gray-400 my-2">
          العناوين الواضحة والأوصاف التفصيلية قد تساعدك في الحصول على حجوزات
          أكثر حتى 3 مرات.
        </p>
      </div>
      <div className=" w-full border border-gray-300 px-4 py-4 bg-gray-50 rounded-3xl">
        {" "}
        <div>
          <label className="block text-body-sm font-medium mb-1">
            عنوان المنتج <span className="text-brand-primary text-lg">*</span>
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
          <label className="block text-body-sm font-medium my-2">
            الوصف <span className="text-brand-primary text-lg">*</span>
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
        <div className="mb-4">
          <label className="block text-body-sm font-medium my-3">
            الفئة الرئيسية <span className="text-brand-primary text-lg">*</span>
          </label>
          <div className="grid grid-cols-4 gap-3">
            {MAIN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setMainCat(cat.id);
                  setValue("mainCategory", cat.id);
                }}
                className={`border rounded-xl py-3 flex flex-col items-center gap-1 text-body-sm transition-all duration-150
        ${
          mainCat === cat.id
            ? "border-brand-primary bg-brand-light text-brand-primary"
            : "border-border-default text-text-secondary hover:border-brand-primary"
        }`}>
                <Image src={cat.icon} alt={cat.label} width={80} height={80} />
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
        {/* Specs */}
        <div className="border border-brand-primary rounded-2xl p-4 my-3 ">
          <div className="flex justify-between my-2">
            <div>
              <h1 className="text-md font-black my-1">مواصفات المنتج</h1>
              <p className="text-caption text-text-secondary">
                أضف مواصفات المؤثر على اتخاذ قراره
              </p>
            </div>
            <span className="text-caption text-brand-primary">اختياري</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-1">
            <label className="text-sm font-black py-2">عنوان</label>
            <label className="text-sm font-black py-2">القيمة</label>

            <div className="flex justify-between items-start mb-1">
              {" "}
              <button
                type="button"
                onClick={() => appendSpec({ title: "", value: "" })}
                className="text-body-sm text-white bg-brand-primary px-2 py-2 w-20 rounded-xl text-center font-medium flex items-center gap-1 ">
                + أضف
              </button>
            </div>
          </div>
          {specFields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-2 gap-2 mb-2">
              <input
                {...register(`specs.${i}.title`)}
                placeholder="مثال الماركة"
                className="border border-border-default rounded-lg px-3 py-2 text-body-sm text-right outline-none focus:border-brand-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    appendSpec({ title: "", value: "" });
                  }
                }}
              />
              <input
                {...register(`specs.${i}.value`)}
                placeholder="مثال سوني"
                className="border border-border-default rounded-lg px-3 py-2 text-body-sm text-right outline-none focus:border-brand-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    appendSpec({ title: "", value: "" });
                  }
                }}
              />
            </div>
          ))}
          <p className="text-caption text-text-tertiary mt-2">
            يمكنك الضغط على زر Enter للإضافة
          </p>
        </div>
        {/* Accessories */}
        <div className="border border-brand-primary rounded-2xl p-4 my-2">
          <div className="flex justify-between items-start mb-3">
            <div className="flex justify-between">
              <div>
                <p className="text-md font-black my-1">مرفقات المنتج</p>
                <p className="text-caption text-text-secondary">
                  أضف مرفقات المنتج إن وجدت لساعدة المؤجر على اتخاذ قراره
                </p>
              </div>
              <span className="text-caption text-brand-primary">اختياري</span>
            </div>
          </div>
          {accFields.map((field, i) => (
            <input
              key={field.id}
              {...register(`accessories.${i}.name`)}
              placeholder="مثال شاحن"
              className="w-full border border-border-default rounded-lg px-3 py-2 text-body-sm text-right outline-none focus:border-brand-primary mb-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  appendAcc({ name: "" });
                }
              }}
            />
          ))}
          <button
            type="button"
            onClick={() => appendAcc({ name: "" })}
            className="text-body-sm text-white bg-brand-primary px-2 py-2 w-20 rounded-xl text-center font-medium flex items-center gap-1 my-2">
            + أضف
          </button>
          <p className="text-caption text-text-tertiary">
            يمكنك الضغط على زر Enter للإضافة
          </p>
        </div>
        {/* Condition */}
        <div>
          <label className="block text-body-sm font-medium my-2">
            الحالة <span className="text-brand-primary text-lg">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {STATES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCondition(c.value)}
                className={`border rounded-xl py-4 flex flex-col items-center gap-1 text-body-sm transition-colors
                ${
                  condition === c.value
                    ? "border-brand-primary bg-brand-light text-brand-primary"
                    : "border-border-default text-text-secondary"
                }`}>
                <Image src={c.icon} alt={c.label} height={40} width={40} />
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-end my-3 ">
            {" "}
            <div className="flex flex-col w-full me-3">
              <label
                htmlFor="condition"
                className="text-body-sm font-medium my-2">
                أضف وصف للحالة (اختياري){" "}
              </label>
              <input
                type="text"
                id="condition"
                name="condition"
                placeholder="مثال: استخدام طفيف"
                className="border border-border-default rounded-lg px-3 py-2 my-1 text-body-sm text-right outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <button
                type="button"
                className="text-body-sm text-white bg-brand-primary px-3 py-2 my-1 w-20 rounded-xl text-center font-medium flex items-center gap-1 ">
                + أضف
              </button>
            </div>
          </div>
        </div>
        {/* Handling Tips */}
        <div>
          <label className="block text-body-sm font-medium my-2">
            إرشادات التعامل{" "}
            <span className="text-brand-primary text-lg ">*</span>
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
                }`}>
                {tip}
              </button>
            ))}
          </div>

          {errors.handlingTips && (
            <p className="text-caption text-danger mt-1">
              {errors.handlingTips.message}
            </p>
          )}
          <div className="flex justify-between items-end my-3 ">
            {" "}
            <div className="flex flex-col w-full me-3">
              <label
                htmlFor="condition"
                className="text-body-sm font-medium my-2">
                أضف ملاحظة (اختياري){" "}
              </label>
              <input
                type="text"
                id="condition"
                name="condition"
                className="border border-border-default rounded-lg px-3 py-2 my-1 text-body-sm text-right outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <button
                type="button"
                className="text-body-sm text-white bg-brand-primary px-3 py-2 my-1 w-20 rounded-xl text-center font-medium flex items-center gap-1 ">
                + أضف
              </button>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-body-sm font-medium my-2">
            العنوان
            <span className="text-brand-primary text-lg ">*</span>
          </label>

          <div>
            <div className="flex my-2">
              <div className="flex flex-col w-100 me-3 ">
                <label
                  htmlFor="address"
                  className="text-body-sm font-medium my-2">
                  اسم الشارع
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="مثال: شارع أحمد ماهر"
                  className="border border-border-default rounded-lg px-3 py-2 my-1 text-body-sm text-right outline-none focus:border-brand-primary"
                />
              </div>
              <div className="flex flex-col w-75">
                <label
                  htmlFor="buildingNo"
                  className="text-body-sm font-medium my-2">
                  {" "}
                  رقم المبنى
                </label>
                <input
                  type="text"
                  id="buildingNo"
                  name="buildingNo"
                  placeholder="مثال: 6"
                  className="border border-border-default rounded-lg px-3 py-2 my-1 text-body-sm text-right outline-none focus:border-brand-primary"
                />
              </div>
            </div>
            <div className="flex my-2">
              <div className="flex flex-col w-30 me-3">
                <label
                  htmlFor="floor"
                  className="text-body-sm font-medium my-2">
                  رقم الدور
                </label>
                <input
                  type="text"
                  id="floor"
                  name="floor"
                  placeholder="مثال: 3"
                  className="border border-border-default rounded-lg px-3 py-2 my-1 text-body-sm text-right outline-none focus:border-brand-primary"
                />
              </div>
              <div className="flex flex-col w-30 me-3">
                <label
                  htmlFor="houseNo"
                  className="text-body-sm font-medium my-2">
                  رقم المنزل
                </label>
                <input
                  type="text"
                  id="houseNo"
                  name="houseNo"
                  placeholder="مثال:6"
                  className="border border-border-default rounded-lg px-3 py-2 my-1 text-body-sm text-right outline-none focus:border-brand-primary"
                />
              </div>
              <div className="flex flex-col w-100">
                <label
                  htmlFor="nearestSign"
                  className="text-body-sm font-medium my-2">
                  أقرب علامة مميزة للعنوان
                </label>
                <input
                  type="text"
                  id="nearestSign"
                  name="nearestSign"
                  placeholder="مثال: بجوار مترو"
                  className="border border-border-default rounded-lg px-3 py-2 my-1 text-body-sm text-right outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Image Upload */}
        <div>
          <label className="block text-body-sm font-medium mb-2">
            صور المنتج <span className="text-brand-primary text-lg">*</span>
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleImageFiles(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 transition-colors
      ${dragging ? "border-brand-primary bg-brand-light" : "border-gray-300 bg-gray-50"}`}>
            <div className="bg-brand-primary rounded-2xl p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12L8 8m4-4l4 4"
                />
              </svg>
            </div>
            <p className="text-lg font-black">اسحب وأفلت صورك هنا</p>
            <p className="text-body-sm text-text-secondary">
              يمكنك رفع حتى 5 صور
            </p>
            <label className="mt-2 w-full cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageFiles(e.target.files)}
              />
              <div className="w-full bg-brand-primary text-white text-center rounded-xl py-3 text-body-sm font-medium hover:opacity-90 transition-opacity">
                تصفح ملفات الجهاز
              </div>
            </label>
          </div>
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {imagePreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-border-default">
                  <Image
                    src={src}
                    alt={`preview-${i}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border border-gray-200 px-4 py-2 rounded-xl bg-white my-4">
          <h1 className="text-brand-primary text-xl my-3 flex gap-2 ">
            {" "}
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
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
            إرشادات رفع الصور
          </h1>
          <ol className="list-disc list-inside space-y-2 text-gray-500">
            <li>
              استخدم صورًا واضحة ومضيئة جيدًا (الإضاءة الطبيعية هي الأفضل).
            </li>
            <li>اعرض المنتج من عدة زوايا مختلفة.</li>
            <li>أظهر جميع الملحقات والإكسسوارات المرفقة مع المنتج.</li>
            <li>وضّح أي آثار استخدام أو تلف ظاهر بكل شفافية.</li>
          </ol>
        </div>
        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-border-default">
          <span className="text-body-sm text-text-secondary flex items-center gap-1">
            ارجع ←
          </span>

          <button
            type="button"
            className="border border-border-default text-text-secondary rounded-lg px-6 py-2.5 text-body-sm">
            احفظ كمسودة
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="bg-brand-primary text-white rounded-lg px-8 py-2.5 text-body-sm font-medium flex items-center gap-2">
            ← أكمل
          </button>
        </div>
      </div>
    </div>
  );
}
