"use client";
import { useFormContext, useFieldArray, useFormState } from "react-hook-form";
import Image from "next/image";
import { FullFormData } from "@/app/_schemas/addProduct.schema";
import { useState, useEffect } from "react";

const MAIN_CATEGORIES = [
  { id: "electronics", label: "الكترونيات", icon: "/images/cat-1.png" },
  { id: "clothes", label: "ملابس", icon: "/images/cat-2.png" },
  { id: "party tools", label: "معدات حفلات", icon: "/images/cat-3.png" },
  { id: "books", label: "كتب", icon: "/images/cat-4.png" },
];

const HANDLING_TIPS = [
  "قابل للكسر",
  "سهل الكسر",
  "الكترونيات حساسة",
  "يُحفظ بعيداً عن الرطوبة",
  "يُحفظ في مكان جاف وآمن",
  "يُتجنب الضغط أو السقوط",
  "يُحفظ بعيداً عن الحرارة المباشرة",
  "يُراعى عدم ثني أو طي المنتج",
  "يُخزن بشكل منفصل عن المواد الثقيلة",
  "يُراعى التغليف الجيد أثناء النقل",
  "يُحفظ بعيداً عن السوائل",
  " يُتجنب الطي أو الضغط الشديد للحفاظ على الشكل",
  "معدات الحف: تُخزن بعيداً عن السوائل والتلف",
  "تُحفظ بعيداً عن الرطوبة والتمزق",
];
const STATES = [
  { value: "excellent", label: "ممتاز", icon: "/images/excellent.png" },
  { value: "good", label: "جديد", icon: "/images/new.png" },
  { value: "fair", label: "جيد", icon: "/images/like.png" },
];
type Props = {
  coverPreview: string | null;
  setCoverPreview: React.Dispatch<React.SetStateAction<string | null>>;
  galleryPreviews: string[];
  setGalleryPreviews: React.Dispatch<React.SetStateAction<string[]>>;
};

function readFilePreview(file: File, onLoad: (dataUrl: string) => void) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string;
    onLoad(dataUrl);
  };
  reader.readAsDataURL(file);
}

export default function Step1Basics({
  coverPreview,
  setCoverPreview,
  galleryPreviews,
  setGalleryPreviews,
}: Props) {
  const { register, setValue, getValues, control } =
    useFormContext<FullFormData>();
  const { errors } = useFormState({ control });

  const { fields: specFields, append: appendSpec } = useFieldArray({
    control,
    name: "specs",
  });
  const { fields: accFields, append: appendAcc } = useFieldArray({
    control,
    name: "accessories",
  });

  const { fields: noteFields, append: appendNote } = useFieldArray({
    control,
    name: "notes",
  });
  const { fields: conditionFields, append: appendCondition } = useFieldArray({
    control,
    name: "conditionNotes",
  });

  const [mainCat, setMainCat] = useState("");
  const [condition, setCondition] = useState("");
  const [selectedTips, setSelectedTips] = useState<string[]>([]);
  const [draggingCover, setDraggingCover] = useState(false);
  const [draggingGallery, setDraggingGallery] = useState(false);

  const handleCoverFile = (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    readFilePreview(file, setCoverPreview);
    setValue("coverImage", file, { shouldValidate: true });
  };

  const handleGalleryFiles = (files: FileList | null) => {
    if (!files) return;
    const accepted = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 2 - galleryPreviews.length);

    accepted.forEach((file) => {
      readFilePreview(file, (dataUrl) => {
        setGalleryPreviews((prev) => {
          if (prev.length >= 2) return prev;
          return [...prev, dataUrl];
        });
      });
    });

    const current = getValues("images") ?? [];
    setValue("images", [...current, ...accepted].slice(0, 2), {
      shouldValidate: true,
    });
  };

  const removeCover = () => {
    setCoverPreview(null);
    setValue("coverImage", undefined as never, { shouldValidate: true });
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    const current = getValues("images") ?? [];
    setValue(
      "images",
      current.filter((_: File, i: number) => i !== index),
      { shouldValidate: true },
    );
  };

  const toggleTip = (tip: string) => {
    const updated = selectedTips.includes(tip)
      ? selectedTips.filter((t) => t !== tip)
      : [...selectedTips, tip];
    setSelectedTips(updated);
    setValue("handlingNotes", updated, { shouldValidate: true });
  };
  useEffect(() => {
    const values = getValues();
    if (values.category) setMainCat(values.category);
    if (values.condition) setCondition(values.condition);
    if (values.handlingNotes?.length) setSelectedTips(values.handlingNotes);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black">أخبرنا عن منتجك</h1>
        <p className="text-sm text-gray-400 my-2">
          العناوين الواضحة والأوصاف التفصيلية قد تساعدك في الحصول على حجوزات
          أكثر حتى 3 مرات.
        </p>
      </div>

      <div className="w-full border border-gray-300 px-4 py-4 bg-gray-50 rounded-3xl space-y-5">
        {/* Title */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">
            عنوان المنتج
            <span className="text-brand-primary text-lg">*</span>
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
          <label className="block mb-1 text-sm text-gray-600">
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
        <div>
          <label className="block mb-1 text-sm text-gray-600">
            الفئة الرئيسية <span className="text-brand-primary text-lg">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MAIN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setMainCat(cat.id);
                  setValue("category", cat.id, { shouldValidate: true });
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
          {errors.category && (
            <p className="text-caption text-danger mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
        <div className="border border-brand-primary rounded-2xl p-4">
          <div className="flex justify-between my-2">
            <div>
              <h2 className="text-md font-black my-1">مواصفات المنتج</h2>
              <p className="text-caption text-text-secondary">
                أضف مواصفات المؤثر على اتخاذ قراره
              </p>
            </div>
            <span className="text-caption text-brand-primary">اختياري</span>
          </div>

          {/* Header */}
          <div className="grid grid-cols-3 gap-2 mb-2 items-center">
            <label className="text-sm font-black">عنوان</label>
            <label className="text-sm font-black">القيمة</label>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => appendSpec({ title: "", value: "" })}
                className="text-body-sm text-white bg-brand-primary px-2 py-2 w-20 rounded-xl font-medium">
                + أضف
              </button>
            </div>
          </div>

          {/* Rows */}
          {specFields.map((field, i) => (
            <div
              key={field.id}
              className="grid grid-cols-3 gap-2 mb-2 items-center">
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

              <div />
            </div>
          ))}

          <p className="text-caption text-text-tertiary mt-2">
            يمكنك الضغط على زر Enter للإضافة
          </p>
        </div>

        {/* Accessories */}
        <div className="border border-brand-primary rounded-2xl p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-md font-black my-1">مرفقات المنتج</p>
              <p className="text-caption text-text-secondary">
                أضف مرفقات المنتج إن وجدت لساعدة المؤجر على اتخاذ قراره
              </p>
            </div>
            <span className="text-caption text-brand-primary">اختياري</span>
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
        <div>
          <label htmlFor="name" className="block mb-1 text-sm text-gray-600">
            اسم المنتج <span className="text-brand-primary text-lg">*</span>
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            placeholder="مثال : كاميرا"
            className="w-full border border-border-default rounded-lg px-3 py-2.5 text-body-sm text-right focus:border-brand-primary outline-none"
          />
          {errors.name && (
            <p className="text-caption text-danger mt-1">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="usage" className="block mb-1 text-sm text-gray-600">
            ظروف استخدام المنتج{" "}
            <span className="text-brand-primary text-lg">*</span>
          </label>
          <input
            type="text"
            id="usage"
            {...register("usage")}
            placeholder=" تم استخدامها في استديو تصوير فقط"
            className="w-full border border-border-default rounded-lg px-3 py-2.5 text-body-sm text-right focus:border-brand-primary outline-none"
          />
          {errors.usage && (
            <p className="text-caption text-danger mt-1">
              {errors.usage.message}
            </p>
          )}
        </div>
        {/* Condition */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">
            الحالة <span className="text-brand-primary text-lg">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STATES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => {
                  setCondition(c.value);
                  setValue(
                    "condition",
                    c.value as "excellent" | "good" | "fair",
                    { shouldValidate: true },
                  );
                }}
                className={`border rounded-xl py-4 flex flex-col items-center gap-1 text-body-sm transition-colors
                  ${
                    condition === c.value
                      ? "border-brand-primary bg-brand-light text-brand-primary"
                      : "border-border-default text-text-secondary"
                  }`}>
                <Image
                  src={c.icon}
                  alt={c.label}
                  height={40}
                  width={40}
                  loading="eager"
                />
                {c.label}
              </button>
            ))}
          </div>
          {errors.condition && (
            <p className="text-caption text-danger mt-1">
              {errors.condition.message}
            </p>
          )}
          {/* Condition description inputs */}
          {/* <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end my-3 gap-2">
            <div className="flex flex-col w-full sm:me-3">
              <label className="block mb-1 text-sm text-gray-600">
                أضف وصف للحالة (اختياري)
              </label>
              {conditionFields.map((field, i) => (
                <input
                  key={field.id}
                  {...register(`conditionNotes.${i}.text`)}
                  placeholder="مثال: استخدام طفيف"
                  className="w-full border border-border-default rounded-lg px-3 py-2 text-body-sm text-right outline-none focus:border-brand-primary mb-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      appendCondition({ text: "" });
                    }
                  }}
                />
              ))}
            </div>
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => appendCondition({ text: "" })}
                className="text-body-sm text-white bg-brand-primary px-3 py-2 w-20 rounded-xl text-center font-medium flex items-center gap-1 my-2">
                + أضف
              </button>
            </div>
          </div> */}
        </div>

        {/* Handling Tips */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">
            إرشادات التعامل{" "}
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
          {errors.handlingNotes && (
            <p className="text-caption text-danger mt-1">
              {errors.handlingNotes.message}
            </p>
          )}

          {/* Notes inputs */}
          {/* <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end my-3 gap-2">
            <div className="flex flex-col w-full sm:me-3">
              <label className="block mb-1 text-sm text-gray-600">
                أضف ملاحظة (اختياري)
              </label>
              {noteFields.map((field, i) => (
                <input
                  key={field.id}
                  {...register(`notes.${i}.text`)}
                  placeholder="أضف ملاحظة"
                  className="w-full border border-border-default rounded-lg px-3 py-2 text-body-sm text-right outline-none focus:border-brand-primary mb-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      appendNote({ text: "" });
                    }
                  }}
                />
              ))}
            </div>
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => appendNote({ text: "" })}
                className="text-body-sm text-white bg-brand-primary px-3 py-2 w-20 rounded-xl text-center font-medium flex items-center gap-1 my-2">
                + أضف
              </button>
            </div>
          </div> */}
        </div>

        {/* location */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">
            العنوان <span className="text-brand-primary text-lg">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
            <div className="flex flex-col">
              <label
                htmlFor="street"
                className="block mb-1 text-sm text-gray-600">
                اسم الشارع
              </label>
              <input
                type="text"
                id="street"
                placeholder="مثال: شارع أحمد ماهر"
                {...register("location.street")}
                className="border border-border-default rounded-lg px-3 py-2 text-body-sm text-right outline-none focus:border-brand-primary"
              />
              {errors.location?.street && (
                <p className="text-caption text-danger mt-1">
                  {errors.location.street.message}
                </p>
              )}
            </div>
            <div className="flex flex-col ">
              <label
                htmlFor="buildingNum"
                className="block mb-1 text-sm text-gray-600">
                رقم المبنى
              </label>
              <input
                type="text"
                id="buildingNum"
                {...register("location.buildingNum")}
                placeholder="مثال: 6"
                className="border border-border-default rounded-lg px-3 py-2 text-body-sm text-right outline-none focus:border-brand-primary"
              />
              {errors.location?.buildingNum && (
                <p className="text-caption text-danger mt-1">
                  {errors.location.buildingNum.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
            <div className="flex flex-col">
              <label
                htmlFor="floorNum"
                className="block mb-1 text-sm text-gray-600">
                رقم الدور
              </label>
              <input
                type="text"
                id="floorNum"
                {...register("location.floorNum")}
                placeholder="مثال: 3"
                className="border border-border-default rounded-lg px-3 py-2 text-body-sm text-right outline-none focus:border-brand-primary"
              />
              {errors.location?.floorNum && (
                <p className="text-caption text-danger mt-1">
                  {errors.location.floorNum.message}
                </p>
              )}
            </div>
            <div className="flex flex-col ">
              <label
                htmlFor="houseNum"
                className="block mb-1 text-sm text-gray-600">
                رقم المنزل
              </label>
              <input
                type="text"
                id="houseNum"
                {...register("location.houseNum")}
                placeholder="مثال: 6"
                className="border border-border-default rounded-lg px-3 py-2 text-body-sm text-right outline-none focus:border-brand-primary"
              />
              {errors.location?.houseNum && (
                <p className="text-caption text-danger mt-1">
                  {errors.location.houseNum.message}
                </p>
              )}
            </div>
            <div className="flex flex-col ">
              <label
                htmlFor="landmark"
                className="block mb-1 text-sm text-gray-600">
                أقرب علامة مميزة للعنوان
              </label>
              <input
                type="text"
                id="landmark"
                {...register("location.landmark")}
                placeholder="مثال: بجوار مترو"
                className="border border-border-default rounded-lg px-3 py-2 text-body-sm text-right outline-none focus:border-brand-primary"
              />
              {errors.location?.landmark && (
                <p className="text-caption text-danger mt-1">
                  {errors.location.landmark.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">
            صورة الغلاف <span className="text-brand-primary text-lg">*</span>
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDraggingCover(true);
            }}
            onDragLeave={() => setDraggingCover(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDraggingCover(false);
              handleCoverFile(e.dataTransfer.files[0] ?? null);
            }}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-3 transition-colors
              ${draggingCover ? "border-brand-primary bg-brand-light" : "border-gray-300 bg-gray-50"}`}>
            <p className="text-body-sm text-text-secondary text-center">
              الصورة الرئيسية التي تظهر في نتائج البحث
            </p>
            <label className="mt-2 w-full cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleCoverFile(e.target.files?.[0] ?? null)}
              />
              <div className="w-full bg-brand-primary text-white text-center rounded-xl py-3 text-body-sm font-medium hover:opacity-90 transition-opacity">
                {coverPreview ? "تغيير صورة الغلاف" : "رفع صورة الغلاف"}
              </div>
            </label>
          </div>
          {coverPreview && (
            <div className="relative w-24 h-24 mt-4 rounded-xl overflow-hidden border border-border-default">
              <Image
                src={coverPreview}
                alt="cover-preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={removeCover}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                ×
              </button>
            </div>
          )}
          {errors.coverImage && (
            <p className="text-caption text-danger mt-1">
              {errors.coverImage.message as string}
            </p>
          )}
        </div>

        {/* Gallery Images */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">
            صور إضافية <span className="text-brand-primary text-lg">*</span>
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDraggingGallery(true);
            }}
            onDragLeave={() => setDraggingGallery(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDraggingGallery(false);
              handleGalleryFiles(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-3 transition-colors
              ${draggingGallery ? "border-brand-primary bg-brand-light" : "border-gray-300 bg-gray-50"}`}>
            <p className="text-body-sm text-text-secondary text-center">
              أضف صورتين إضافيتين لعرض المنتج من زوايا مختلفة
            </p>
            <label className="mt-2 w-full cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={galleryPreviews.length >= 2}
                onChange={(e) => handleGalleryFiles(e.target.files)}
              />
              <div
                className={`w-full text-center rounded-xl py-3 text-body-sm font-medium transition-opacity
                  ${galleryPreviews.length >= 2 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-brand-primary text-white hover:opacity-90 cursor-pointer"}`}>
                {galleryPreviews.length >= 2
                  ? "تم رفع صورتين"
                  : "رفع الصور الإضافية"}
              </div>
            </label>
          </div>
          {galleryPreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {galleryPreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-border-default">
                  <Image
                    src={src}
                    alt={`gallery-preview-${i}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {errors.images && (
            <p className="text-caption text-danger mt-1">
              {errors.images.message as string}
            </p>
          )}
        </div>

        {/* Image guidelines */}
        <div className="border border-gray-200 px-4 py-2 rounded-xl bg-white">
          <h2 className="text-brand-primary text-xl my-3 flex gap-2">
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
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-500">
            <li>
              استخدم صورًا واضحة ومضيئة جيدًا (الإضاءة الطبيعية هي الأفضل).
            </li>
            <li>اعرض المنتج من عدة زوايا مختلفة.</li>
            <li>أظهر جميع الملحقات والإكسسوارات المرفقة مع المنتج.</li>
            <li>وضّح أي آثار استخدام أو تلف ظاهر بكل شفافية.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
