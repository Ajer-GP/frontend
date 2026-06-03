import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen' dir='rtl'>
      {/* fixed photo */}
      <div className='hidden lg:flex w-1/3 shrink-0 relative bg-brand-dark'>
        <Image
          src='/images/auth-bg.png'
          alt='خلفية تسجيل الدخول'
          fill
          className='object-cover'
          priority
        />
      </div>

      {/* forms */}
      <div className='flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16 bg-surface-primary min-h-screen overflow-y-auto'>
        <div className='w-full max-w-xl'>{children}</div>
      </div>
    </div>
  );
}
