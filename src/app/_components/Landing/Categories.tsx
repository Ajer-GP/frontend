import Image from "next/image";
import React from "react";

const categories = [
  { src: "/images/cat-1.png", label: "الكترونيات" },
  { src: "/images/cat-2.png", label: "ملابس" },
  { src: "/images/cat-3.png", label: "معدات حفلات" },
  { src: "/images/cat-4.png", label: "كتب" },
];

export default function Categories() {
  return (
    <div className='flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 py-10'>
      <div className='badge badge-md mt-5 p-4 font-black rounded-3xl bg-brand-light border-brand-light text-brand-primary'>
        الفئات
      </div>
      <h1 className='text-2xl sm:text-3xl font-black my-2 text-center'>
        استأجر كل ما تحتاجه في{" "}
        <strong className='text-brand-primary'>مكان واحد</strong>
      </h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl'>
        {categories.map((cat) => (
          <div
            key={cat.label}
            className='card bg-gray-50 shadow-lg rounded-2xl my-5 border border-gray-200 hover:border hover:border-brand-primary'>
            <figure className='px-10 pt-10'>
              <Image
                src={cat.src}
                alt={cat.label}
                className='rounded-xl'
                width={100}
                height={100}
              />
            </figure>
            <div className='card-body items-center text-center'>
              <h2 className='card-title text-brand-primary'>{cat.label}</h2>
              <p className='text-gray-500 font-black'>+150 عنصر</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
