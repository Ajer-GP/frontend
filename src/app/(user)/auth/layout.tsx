import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen" dir="rtl">
      {/* Background image — full bleed on mobile, side panel on lg+ */}
      <div className="fixed inset-0 lg:relative lg:inset-auto lg:flex lg:w-2/5 xl:w-1/3 lg:shrink-0">
        <Image
          src="/images/auth-bg.png"
          alt="خلفية تسجيل الدخول"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay gradient — softens image on mobile so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:hidden" />
      </div>

      {/* Form panel */}
      <div className="relative z-10 flex flex-1 flex-col justify-center min-h-screen overflow-y-auto bg-surface-primary/95 backdrop-blur-sm lg:bg-surface-primary lg:backdrop-blur-none">
        <div className="w-full max-w-xl mx-auto px-5 py-10 sm:px-8 sm:py-14 lg:px-12 xl:px-16">
          {children}
        </div>
      </div>
    </div>
  );
}
