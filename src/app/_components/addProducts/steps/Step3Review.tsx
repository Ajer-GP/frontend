"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { FullFormData } from "@/app/_schemas/addProduct.schema";
import Image from "next/image";
import { conditionMap } from "../productPreviewLabels";

type Props = {
  coverPreview: string | null;
  galleryPreviews: string[];
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-gray-200 pt-4 first:border-t-0 first:pt-0">
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      {children}
    </div>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 py-1.5">
      <span className="text-caption text-text-tertiary shrink-0">{label}</span>
      <span className="text-body-sm text-text-primary text-right">{value}</span>
    </div>
  );
}

export default function Step3Review({ coverPreview, galleryPreviews }: Props) {
  const { control } = useFormContext<FullFormData>();
  const title = useWatch({ control, name: "title" });
  const description = useWatch({ control, name: "description" });
  const category = useWatch({ control, name: "category" });
  const condition = useWatch({ control, name: "condition" });
  const pricePerHour = useWatch({ control, name: "pricePerHour" });
  const pricePerDay = useWatch({ control, name: "pricePerDay" });
  const pricePerWeek = useWatch({ control, name: "pricePerWeek" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black">مراجعة إعلانك</h1>
        <p className="text-sm text-gray-400 my-2">
          راجع تفاصيل إعلانك بعناية، ثم اضغط «نشر المنتج» عندما تكون جاهزاً.
        </p>
      </div>

      <div className="border border-gray-300 bg-gray-50 rounded-2xl px-4 py-5 space-y-4">
        <Section title="الصور">
          <div className="flex flex-wrap gap-3">
            {coverPreview ? (
              <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-border-default">
                <Image
                  src={coverPreview}
                  alt="cover"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <p className="text-body-sm text-text-tertiary">
                لم تُضف صورة غلاف
              </p>
            )}
            {galleryPreviews.map((src, i) => (
              <div
                key={i}
                className="relative w-28 h-28 rounded-xl overflow-hidden border border-border-default">
                <Image
                  src={src}
                  alt={`gallery-${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Section>
        <div>
          <p className="mb-1 text-sm text-gray-600">
            {" "}
            العنوان <span className="text-brand-primary text-lg">*</span>
          </p>
          <h1 className="font-black text-2xl">{title}</h1>
        </div>
        <div>
          <p className="mb-1 text-sm text-gray-600">
            الفئة و الحالة <span className="text-brand-primary text-lg">*</span>
          </p>
          <h1>
            <div className="badge text-gray-500 bg-gray-300 rounded-2xl">
              {category}
            </div>
            <div className="badge text-accent-default bg-[#FDF6E9] rounded-2xl">
              {conditionMap[condition] ?? condition}
            </div>
          </h1>
        </div>
        <div>
          <p className="mb-1 text-sm text-gray-600">
            الوصف <span className="text-brand-primary text-lg">*</span>
          </p>
          <h1>{description}</h1>
        </div>
        <div className="flex gap-3 text-2xl text-brand-primary items-center justify-between">
          <div className="border border-brand-primary bg-white w-60 h-20 px-8 py-2 rounded-xl ">
            {pricePerHour} ج.م / ساعة
          </div>
          <div className="border border-brand-primary bg-white w-60 h-20 px-8 py-2 rounded-xl ">
            {pricePerDay} ج.م / يوم{" "}
          </div>
          <div className="border border-brand-primary bg-white w-60 h-20 px-8 py-2 rounded-xl ">
            {pricePerWeek} ج.م / أسبوع{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
