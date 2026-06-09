"use client";
import { useState } from "react";

type Tab = "card" | "instapay" | "discount";

export default function PaymentPage() {
  const [tab, setTab] = useState<Tab>("card");

  return (
    <div dir="rtl" className="max-w-xl mx-auto p-4 space-y-6">
      <h2 className="text-h2">اختر طريقة الدفع</h2>

      {/* Tabs */}
      <div className="flex rounded-xl border border-border-default overflow-hidden">
        {(["card", "instapay", "discount"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-body-sm font-medium transition-colors
              ${tab === t ? "bg-brand-primary text-white" : "bg-surface-primary text-text-secondary"}`}
          >
            {t === "card"
              ? "بطاقة ائتمان / خصم"
              : t === "instapay"
                ? "انستا باي"
                : "محفظة الكترونية"}
          </button>
        ))}
      </div>

      {tab === "card" && <CardForm />}
      {tab === "instapay" && <InstapayForm />}
    </div>
  );
}

function CardForm() {
  return (
    <div className="space-y-3">
      <input
        className="input input-bordered w-full text-right"
        placeholder="اسم حامل البطاقة بالكامل"
      />
      <input
        className="input input-bordered w-full text-right"
        placeholder="الرقم المكتوب في البطاقة"
      />
      <input
        className="input input-bordered w-full text-right"
        placeholder="1234 5678 9101 1121"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          className="input input-bordered w-full text-right"
          placeholder="تاريخ الصلاحية"
        />
        <input
          className="input input-bordered w-full text-right"
          placeholder="رمز الأمان"
        />
      </div>
      <label className="flex items-center gap-2 text-body-sm cursor-pointer">
        <input type="checkbox" className="checkbox checkbox-sm" />
        <span>احفظ بيانات هذه البطاقة لعمليات الدفع القادمة</span>
      </label>
      <button className="btn w-full bg-brand-primary text-white hover:bg-brand-dark">
        ادفع 400 ج.م
      </button>
    </div>
  );
}

function InstapayForm() {
  return (
    <div className="space-y-4 text-body-sm">
      <p className="font-medium text-brand-primary">خطوات الدفع ℹ️</p>
      <ul className="list-disc list-inside space-y-1 text-text-secondary">
        <li>حول مبلغ العربون 300 ج.م على رقم انستا باي الخاص بالمنصة</li>
        <li>
          يجب رفع صورة من التحويل على المنصة والانتظار دقائق حتى يتم تأكيد الحجز
        </li>
      </ul>
      <div className="border-2 border-dashed border-border-default rounded-xl p-8 flex flex-col items-center gap-2 text-text-tertiary">
        <span className="text-2xl">↑</span>
        <p>اسحب وأفلت صورتك هنا</p>
        <button className="btn btn-sm bg-brand-primary text-white">
          تصفح ملفات الجهاز
        </button>
      </div>
    </div>
  );
}
