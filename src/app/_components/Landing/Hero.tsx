import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <div className="flex flex-col justify-center items-center px-4 sm:px-8 md:px-16">
      <h1 className="my-10 font-black text-3xl sm:text-4xl md:text-5xl text-center">
        <strong className="text-brand-primary">استأجر</strong> ما تحتـاجه{" "}
        <strong className="text-brand-primary">و اربــح </strong> مما تملكه
      </h1>

      <p className="font-black text-gray-600 text-center text-sm sm:text-base max-w-4xl">
        اكتشف آلاف المنتجات المتاحة للإيجار، من الأجهزة الإلكترونية وأجهزة
        الألعاب إلى الأدوات والمعدات المنزلية. وفّر أموالك، وحقق دخلًا إضافيًا
        من ممتلكاتك، واستمتع بتجربة آمنة وسهلة من البداية للنهاية
      </p>

      <label className="input my-5 w-full max-w-2xl sm:max-w-3xl rounded-xl shadow-sm py-6 flex items-center gap-2">
        <Image
          src="/search-normal.svg"
          alt="search icon"
          width={20}
          height={20}
        />
        <input
          type="search"
          required
          placeholder="ماذا تريد أن تستأجر اليوم؟"
          className="py-4 flex-1 min-w-0"
        />
        <button className="btn bg-brand-primary text-white rounded-xl px-4 my-2 whitespace-nowrap">
          ابحث
        </button>
      </label>

      <Image
        src="/images/Hero.png"
        alt="hero"
        height={700}
        width={700}
        className="m-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl h-auto"
      />
    </div>
  );
}
