import RegistertionForm from "@/Modules/User/Features/Auth/components/RegistertionForm";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "إنشاء حساب جديد | أجر",
  description: "أنشئ حسابك على منصة أجر وابدأ في إدارة أعمالك بكفاءة",
};

export default function RegisterPage() {
  return (
    <div dir='rtl' className=' pb-13'>
      {/* العنوان */}
      <div className='mb-8 '>
        <h1 className='text-4xl font-medium text-text-primary mb-2'>
          إنشاء حساب جديد
        </h1>
        <p className='font-xl font-normal text-text-secondary'>
          هل تمتلك حساباً بالفعل؟{" "}
          <Link
            href='/auth/login'
            className='text-brand-primary font-medium underline'>
            سجل الدخول
          </Link>
        </p>
      </div>

      <RegistertionForm />
    </div>
  );
}
