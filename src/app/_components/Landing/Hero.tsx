"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    router.push(`/products?search=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };
  return (
    <div className='relative flex flex-col justify-center items-center px-4 sm:px-8 md:px-16'>
      {/* Background Image */}
      <Image
        src='/images/hero-bg.png'
        alt='background'
        fill
        className='object-cover -z-10'
        priority
      />

      <h1 className='my-10 font-black text-3xl sm:text-4xl md:text-5xl text-center'>
        <strong className='text-brand-primary'>استأجر</strong> ما تحتـاجه{" "}
        <strong className='text-brand-primary'>و اربــح </strong> مما تملكه
      </h1>

      <p className='font-black text-gray-600 text-center text-sm sm:text-base max-w-4xl'>
        اكتشف آلاف المنتجات المتاحة للإيجار، من الأجهزة الإلكترونية وأجهزة
        الألعاب إلى الأدوات والمعدات المنزلية. وفّر أموالك، وحقق دخلًا إضافيًا
        من ممتلكاتك، واستمتع بتجربة آمنة وسهلة من البداية للنهاية
      </p>

      <label className='input bg-white my-5 w-full max-w-2xl sm:max-w-3xl rounded-xl shadow-sm py-6 flex items-center gap-2'>
        <Image
          src='/search-normal.svg'
          alt='search icon'
          width={20}
          height={20}
        />
        <input
          type='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='ماذا تريد أن تستأجر اليوم؟'
          className='bg-white py-4 flex-1 min-w-0'
        />
        <button
          onClick={handleSearch}
          className='btn bg-brand-primary text-white rounded-xl px-4 my-2 whitespace-nowrap'>
          ابحث
        </button>
      </label>

      <Image
        src='/images/Hero.png'
        alt='hero'
        height={700}
        width={700}
        className='m-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl h-auto'
      />
    </div>
  );
}
