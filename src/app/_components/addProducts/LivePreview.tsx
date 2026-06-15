"use client";

import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";
import { FullFormData } from "@/app/_schemas/addProduct.schema";

type Props = { coverPreview: string | null };
import { conditionMap } from "./productPreviewLabels";
export default function LivePreview({ coverPreview }: Props) {
  const { control } = useFormContext<FullFormData>();
  const title = useWatch({ control, name: "title" });

  const condition = useWatch({ control, name: "condition" });
  const pricePerDay = useWatch({ control, name: "pricePerDay" });
  return (
    <div className="space-y-3">
      <p className="text-body-sm font-medium text-text-secondary">
        معاينة مباشرة
      </p>

      <div
        dir="rtl"
        className="bg-white rounded-2xl border border-border-default overflow-hidden">
        <div className="relative aspect-[4/3] bg-surface-secondary">
          <Image
            src={coverPreview ?? "/images/img.png"}
            alt={title || "معاينة المنتج"}
            fill
            className="object-cover"
          />
        </div>

        <div className="px-3.5 py-2 flex flex-col">
          <div className="badge text-accent-default bg-[#FDF6E9] rounded-2xl">
            {(conditionMap[condition] ?? condition) || "حالة المنتج يظهر هنا"}
          </div>
          <div className="p-3.5 flex flex-col gap-2">
            <h3 className="text-2xl font-black  min-h-10">
              {title || "عنوان المنتج يظهر هنا"}
            </h3>
          </div>
          <div className="px-3.5 py-2 flex flex-col">
            <h3 className="text-2xl text-brand-primary font-black">
              {pricePerDay || 0}ج.م{" "}
              <span className="text-lg text-gray-500">/يوم</span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
