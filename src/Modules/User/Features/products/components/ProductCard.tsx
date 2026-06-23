// modules/products/components/ProductCard.tsx — pure presentational component

import Link from "next/link";
import { Product } from "../types/products.typs";
import Image from "next/image";

const CONDITION_LABELS: Record<string, string> = {
  excellent: "ممتاز",
  good: "جديد",
  fair: "جيد",
};

const CONDITION_STYLES: Record<string, string> = {
  excellent: "bg-success-bg text-success",
  good: "bg-brand-light text-brand-primary",
  fair: "bg-accent-light text-accent-default",
};

const PERIOD_LABELS: Record<string, string> = {
  hour: "ساعة",
  day: "يوم",
  week: "أسبوع",
  month: "شهر",
};

const CATEGORY_LABELS: Record<string, string> = {
  // cameras: "كاميرات",
  // laptops: "لابتوب",
  // tablets: "تابلت",
  // gaming: "بلايستيشن",
  // audio: "سماعات",
  electronics: "الكترونيات",
  clothes: "ملابس",
  books: "كتب",
  "party tools": "أدوات حفلات",
  // drones: "درون",
  // lighting: "إضاءة",
  // other: "أخرى",
};

interface Props {
  product: Product;
  period?: string;
}

export default function ProductCard({ product, period = "day" }: Props) {
  const conditionLabel =
    CONDITION_LABELS[product.condition] ?? product.condition;
  const conditionStyle =
    CONDITION_STYLES[product.condition] ??
    "bg-surface-tertiary text-text-secondary";
  const periodLabel = PERIOD_LABELS[period] ?? period;
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;
  const price =
    period === "week"
      ? (product.pricePerWeek ?? product.pricePerDay)
      : period === "hour"
        ? (product.pricePerHour ?? product.pricePerDay)
        : product.pricePerDay;

  return (
    <div
      dir="rtl"
      className="group bg-white rounded-2xl border border-border-default overflow-hidden hover:shadow-md hover:border-brand-primary/30 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-surface-secondary overflow-hidden">
        {product.coverImage?.url ? (
          <Image
            width={400}
            height={300}
            src={product.coverImage.url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="size-12 text-border-default"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        )}

        {/* Category badge */}
        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-caption text-text-secondary px-2 py-0.5 rounded-lg">
          {categoryLabel}
        </span>

        {/* Condition badge */}
        <span
          className={`absolute top-2 left-2 text-caption font-medium px-2 py-0.5 rounded-lg ${conditionStyle}`}
        >
          {conditionLabel === "كالجديد" ? (
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-current" />
              {conditionLabel}
            </span>
          ) : (
            conditionLabel
          )}
        </span>
      </div>

      {/* Body */}
      <div className="p-3.5 flex flex-col gap-2">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-3.5 text-accent-default"
          >
            <path
              fillRule="evenodd"
              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-caption font-medium text-text-primary">
            {product.rating ? product.rating.toFixed(1) : "0"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-body-sm font-medium text-text-primary line-clamp-2 leading-snug">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-h2 font-medium text-brand-primary">
            {price?.toLocaleString("ar-EG")} ج.م
          </span>
          <span className="text-caption text-text-tertiary">
            /{periodLabel}
          </span>
        </div>

        {/* Insurance if available */}
        {/* {(product as { insurance?: number }).insurance && (
          <p className="text-caption text-text-tertiary">
            {(product as { insurance?: number }).insurance?.toLocaleString()}{" "}
            ج.م تأمين
          </p>
        )} */}
        {product.insuranceAmount && (
          <p className="text-caption text-text-tertiary">
            {product.insuranceAmount.toLocaleString()} ج.م تأمين
          </p>
        )}
        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <Link
            href={`/products/${product._id}`}
            className="flex-1 text-center py-2 rounded-xl text-body-sm font-medium border border-border-default text-text-secondary hover:border-brand-primary hover:text-brand-primary transition-colors"
          >
            اعرف المزيد
          </Link>
          {/* <Link
            href={`/products/${product._id}/rent`}
            className="flex-1 text-center py-2 rounded-xl text-body-sm font-medium bg-brand-primary text-white hover:bg-brand-dark transition-colors"
          >
            أجر الآن
          </Link> */}
        </div>
      </div>
    </div>
  );
}
