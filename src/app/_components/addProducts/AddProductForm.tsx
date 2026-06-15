"use client";
import { useRef, useState, useTransition } from "react";
import { useForm, FormProvider, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import Step1Basics from "./steps/Step1Basics";
import Step2Pricing, { Step2Ref } from "./steps/Step2Pricing";
import Step3Review from "./steps/Step3Review";
import { FullFormData, fullSchema } from "@/app/_schemas/addProduct.schema";
import { buildProductFormData } from "./buildProductFormData";
import LivePreview from "./LivePreview";

const STEPS = [
  { number: 1, title: "الأساسيات" },
  { number: 2, title: "التسعير" },
  { number: 3, title: "مراجعة" },
];

const STEP_FIELDS: Record<number, (keyof FullFormData)[]> = {
  1: [
    "title",
    "description",
    "name",
    "usage",
    "category",
    "condition",
    "handlingNotes",
    "location",
    "coverImage",
    "images",
  ],
  2: ["insuranceAmount", "pricePerHour", "pricePerDay", "pricePerWeek"],
};

const STEP1_ERROR_FIELDS = new Set<string>([
  "title",
  "description",
  "name",
  "usage",
  "category",
  "condition",
  "handlingNotes",
  "location",
  "coverImage",
  "images",
  "specs",
  "accessories",
  "conditionNotes",
  "notes",
]);

function getErrorStep(errors: FieldErrors<FullFormData>): number {
  for (const field of Object.keys(errors)) {
    if (field === "location" || STEP1_ERROR_FIELDS.has(field)) return 1;
  }
  return 2;
}

function cleanNumber(value: number | undefined): number | undefined {
  return value == null || Number.isNaN(value) ? undefined : value;
}

function cleanFormData(data: FullFormData): FullFormData {
  return {
    ...data,
    pricePerHour: cleanNumber(data.pricePerHour),
    pricePerDay: cleanNumber(data.pricePerDay),
    pricePerWeek: cleanNumber(data.pricePerWeek),
    insuranceAmount: cleanNumber(data.insuranceAmount) as number,
  };
}

export default function AddProductForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const step2Ref = useRef<Step2Ref>(null);

  const methods = useForm<FullFormData>({
    resolver: zodResolver(fullSchema),
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      title: "",
      description: "",
      category: "",
      specs: [],
      accessories: [],
      conditionNotes: [],
      notes: [],
      handlingNotes: [],
      condition: undefined as unknown as "excellent" | "good" | "fair",
      location: {
        street: "",
        buildingNum: "",
        floorNum: "",
        houseNum: "",
        landmark: "",
      },
      images: [],
      coverImage: undefined,
      pricePerDay: undefined,
      pricePerHour: undefined,
      pricePerWeek: undefined,
      checklist: [],
      insuranceAmount: undefined,
      name: "",
      usage: "",
    },
  });

  const next = () => setCurrentStep((s) => Math.min(s + 1, 3));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleNext = async () => {
    if (currentStep === 1) {
      const coverImage = methods.getValues("coverImage");
      const images = methods.getValues("images");

      if (!(coverImage instanceof File)) {
        methods.setError("coverImage", { message: "أضف صورة الغلاف" });
      }
      if (!images || images.length < 2) {
        methods.setError("images", { message: "أضف صورتين إضافيتين" });
      }
      if (!(coverImage instanceof File) || !images || images.length < 2) {
        await methods.trigger(STEP_FIELDS[1]);
        return;
      }
    }

    if (currentStep === 2) {
      const cleaned = cleanFormData(methods.getValues());
      methods.setValue("pricePerHour", cleaned.pricePerHour);
      methods.setValue("pricePerDay", cleaned.pricePerDay);
      methods.setValue("pricePerWeek", cleaned.pricePerWeek);
      methods.setValue("insuranceAmount", cleaned.insuranceAmount);

      if (
        cleaned.pricePerHour == null &&
        cleaned.pricePerDay == null &&
        cleaned.pricePerWeek == null
      ) {
        step2Ref.current?.triggerPricingError();
        return;
      }
    }

    const fields = STEP_FIELDS[currentStep];
    const valid = await methods.trigger(fields);
    if (valid) next();
  };

  const handlePublish = () => {
    if (currentStep !== 3) return;

    const cleaned = cleanFormData(methods.getValues());
    methods.setValue("pricePerHour", cleaned.pricePerHour);
    methods.setValue("pricePerDay", cleaned.pricePerDay);
    methods.setValue("pricePerWeek", cleaned.pricePerWeek);
    methods.setValue("insuranceAmount", cleaned.insuranceAmount);

    void methods.handleSubmit(onSubmit, onInvalid)();
  };

  const onInvalid = (errors: FieldErrors<FullFormData>) => {
    setCurrentStep(getErrorStep(errors));
    setSubmitError("يرجى إكمال جميع الحقول المطلوبة قبل النشر");
  };

  const onSubmit = (data: FullFormData) => {
    setSubmitError(null);
    const cleaned = cleanFormData(data);

    startTransition(async () => {
      try {
        const formData = buildProductFormData(cleaned);
        const res = await fetch("/api/products/add", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();

        if (!res.ok) {
          const details = result?.error?.details as
            | { field: string; message: string }[]
            | undefined;
          const detailMsg = details?.map((d) => d.message).join(" · ");
          const backendMsg =
            detailMsg ||
            result?.error?.message ||
            result?.message ||
            `فشل نشر المنتج (${res.status})`;
          setSubmitError(backendMsg);
          console.error("Add product failed:", res.status, result);
          return;
        }

        const productId =
          result?.product?._id ?? result?.data?.product?._id ?? result?._id;
        if (productId) {
          router.push(`/products/${productId}`);
        }
      } catch {
        setSubmitError("تعذر الاتصال بالخادم، حاول مجدداً");
      }
    });
  };

  return (
    <FormProvider {...methods}>
      {/* Header */}
      <div
        style={{
          backgroundImage: `
          linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
        `,
          backgroundSize: "80px 80px",
        }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 bg-[#E8F0ED] text-[#2E9E6E] text-caption font-normal px-3 py-1.5 rounded-full mb-3">
              <p className="text-caption text-brand-primary font-medium mb-1 bg-brand-light rounded-3xl px-4">
                أعرض منتجك في أقل من 5 دقائق
              </p>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black my-3">
              اعرض منتجك للإيجار
            </h1>
            <p className="text-body-sm text-text-secondary">
              حول ممتلكاتك غير المستخدمة إلى مصدر دخل إضافي
            </p>
          </div>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-start justify-center my-3 w-full max-w-lg mx-auto px-4">
        {STEPS.map((step, index) => {
          const isLast = index === STEPS.length - 1;
          const isActive = currentStep === step.number;
          const isDone = currentStep > step.number;

          return (
            <div key={step.number} className="flex items-start flex-1">
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`flex items-center justify-center size-8 sm:size-10 rounded-full border font-medium text-sm
                  ${
                    isActive || isDone
                      ? "border-brand-primary bg-brand-light text-brand-primary"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}>
                  {isDone ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </span>
                <p
                  className={`text-xs font-medium text-center ${isActive || isDone ? "text-brand-primary" : "text-gray-400"}`}>
                  {step.title}
                </p>
              </div>
              {!isLast && (
                <div
                  className={`flex-1 h-px mt-4 sm:mt-5 mx-1 ${isDone ? "bg-brand-primary" : "bg-gray-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-10 py-4">
        <div className="w-full lg:max-w-3xl">
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && currentStep !== 3) {
                event.preventDefault();
              }
            }}>
            <div className={currentStep === 1 ? "" : "hidden"}>
              <Step1Basics
                coverPreview={coverPreview}
                setCoverPreview={setCoverPreview}
                galleryPreviews={galleryPreviews}
                setGalleryPreviews={setGalleryPreviews}
              />
            </div>
            <div className={currentStep === 2 ? "" : "hidden"}>
              <Step2Pricing ref={step2Ref} />
            </div>
            <div className={currentStep === 3 ? "" : "hidden"}>
              <Step3Review
                coverPreview={coverPreview}
                galleryPreviews={galleryPreviews}
              />
            </div>

            {submitError && (
              <div className="mt-4 rounded-xl border border-danger bg-red-50 px-4 py-3 text-body-sm text-danger">
                {submitError}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 border-t border-border-default my-3">
              <button
                type="button"
                onClick={back}
                className="text-body-sm text-text-secondary flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
                ارجع
              </button>

              <div className="flex gap-3">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-brand-primary text-white rounded-2xl px-8 py-2.5 text-body-sm font-medium flex items-center gap-2">
                    أكمل
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isPending}
                    className="bg-brand-primary text-white rounded-2xl px-8 py-2.5 text-body-sm font-medium disabled:opacity-60">
                    {isPending ? "جاري النشر..." : "نشر المنتج"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Live preview */}
        <div className="w-full lg:w-80 lg:sticky lg:top-6 lg:self-start">
          <LivePreview coverPreview={coverPreview} />
        </div>
      </div>
    </FormProvider>
  );
}
