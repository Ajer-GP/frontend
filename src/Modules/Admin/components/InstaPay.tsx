import React from "react";
import Image from "next/image";

const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

function formatArabicDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return `${date.getDate()} ${ARABIC_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export default function InstaPay({ instaPay }) {
  const { deposit, remaining } = instaPay.data;

  const payments = [
    { label: "لقطة شاشة مبلغ العربون", data: deposit },
    { label: "لقطة شاشة باقي المبلغ المستحق", data: remaining },
  ];

  return (
    <div className="border border-gray-300 rounded-xl px-4 py-4" dir="rtl">
      <h1 className="text-sm font-semibold">مراجعة إيصال الدفع</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
        {payments.map(({ label, data }) => (
          <div
            key={label}
            className="border border-gray-300 rounded-xl px-4 py-4 flex flex-col gap-2">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-gray-500">
              {formatArabicDate(data.paidAt)}
            </p>
            <div className="relative w-full aspect-square max-w-75 mx-auto">
              <Image
                src={data.screenshotUrl}
                alt={label}
                fill
                className="border border-gray-300 rounded-xl object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
