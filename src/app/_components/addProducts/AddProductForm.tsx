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

const STEPS = ["الأساسيات", "التسعير", "مراجعة"];

export default function AddProductForm() {
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<FullFormData>({
    resolver: zodResolver(fullSchema),
    mode: "onTouched",
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
      <div className="mb-8">
        <p className="text-caption text-brand-primary font-medium mb-1">
          أعرض منتجك في أقل من 5 دقائق
        </p>
        <h1 className="text-h1 mb-1">اعرض منتجك للإيجار</h1>
        <p className="text-body-sm text-text-secondary">
          حول ممتلكاتك غير المستخدمة إلى مصدر دخل إضافي
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((label, i) => {
          const num = i + 1;
          const done = num < currentStep;
          const active = num === currentStep;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors
                    ${done ? "bg-brand-primary border-brand-primary text-white" : ""}
                    ${active ? "border-brand-primary text-brand-primary bg-white" : ""}
                    ${!done && !active ? "border-border-default text-text-tertiary bg-white" : ""}
                  `}
                >
                  {done ? "✓" : num}
                </div>
                <span
                  className={`text-caption ${active ? "text-brand-primary font-medium" : "text-text-tertiary"}`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 mb-4 ${done ? "bg-brand-primary" : "bg-border-default"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Steps */}
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {currentStep === 1 && <Step1Basics onNext={next} />}
        {currentStep === 2 && <Step2Pricing onNext={next} onBack={back} />}
        {currentStep === 3 && <Step3Review onBack={back} />}
      </form>
    </FormProvider>
  );
}
