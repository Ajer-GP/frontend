"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Step1Basics from "./steps/Step1Basics";
import Step2Pricing from "./steps/Step2Pricing";
import Step3Review from "./steps/Step3Review";
import { addProduct } from "@/app/_actions/addProduct.action";
import { FullFormData, fullSchema } from "@/app/_schemas/addProduct.schema";
// server action

const STEPS = [
  { number: 1, title: "الأساسيات" },
  { number: 2, title: "التسعير" },
  { number: 3, title: "مراجعة" },
];
export default function AddProductForm() {
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<FullFormData>({
    resolver: zodResolver(fullSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      mainCategory: "",
      subCategory: "",
      specs: [],
      accessories: [],
      handlingTips: [],
      condition: "new",
      pricePerDay: 0,
      insuranceAmount: 0,
      deliveryPrice: 0,
      address: { street: "", buildingNum: "", floorNum: "", landmark: "" },
      images: [],
    },
  });

  const next = () => setCurrentStep((s) => Math.min(s + 1, 3));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: FullFormData) => {
    const formData = new FormData();
    // append fields...
    await addProduct(formData);
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
        {/* Breadcrumb */}

        <div className="breadcrumbs text-sm max-w-7xl mx-auto px-4 py-2.5 text-[#676767]"></div>
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Page header */}
          <div className="mb-6">
            {/* AI recommendation banner */}
            <div className="inline-flex items-center gap-1.5 bg-[#E8F0ED] text-[#2E9E6E] text-caption font-normal px-3 py-1.5 rounded-full mb-3">
              <p className="text-caption text-brand-primary font-medium mb-1 bg-brand-light w-50 rounded-3xl px-4 ">
                أعرض منتجك في أقل من 5 دقائق
              </p>
            </div>
            <h1 className="text-4xl font-black my-3">اعرض منتجك للإيجار</h1>
            <p className="text-body-sm text-text-secondary">
              حول ممتلكاتك غير المستخدمة إلى مصدر دخل إضافي
            </p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-start justify-center my-3">
        {STEPS.map((step, index) => {
          const isLast = index === STEPS.length - 1;
          const isActive = currentStep === step.number;
          const isDone = currentStep > step.number;

          return (
            <div key={step.number} className="flex items-start">
              {/* Circle + label */}
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`flex items-center justify-center size-10 rounded-full border font-medium text-sm
              ${
                isActive || isDone
                  ? "border-brand-primary bg-brand-light text-brand-primary"
                  : "border-gray-300 bg-white text-gray-400"
              }`}>
                  {step.number}
                </span>
                <p
                  className={`text-xs font-medium
            ${isActive || isDone ? "text-brand-primary" : "text-gray-400"}`}>
                  {step.title}
                </p>
              </div>

              {/* Connector line — hidden after last step */}
              {!isLast && (
                <div
                  className={`h-px w-100 mt-6 mx-1
            ${isDone ? "bg-brand-primary" : "bg-gray-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="max-w-4xl mx-20">
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* name of each tab group should be unique */}
          {currentStep === 1 && <Step1Basics onNext={next} />}{" "}
          {currentStep === 2 && <Step2Pricing onNext={next} onBack={back} />}{" "}
          {currentStep === 3 && <Step3Review onBack={back} />}{" "}
        </form>
      </div>
    </FormProvider>
  );
}
