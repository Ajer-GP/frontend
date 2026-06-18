export default function ImportantInfo() {
  return (
    <div dir="rtl" className="space-y-6">
      {/* معلومات مهمة */}
      <div className="border border-border-default rounded-xl p-5 bg-surface-primary space-y-4">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-brand-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>

          <h3 className="text-h3 font-semibold">معلومات مهمة</h3>
        </div>

        <ul className="space-y-2">
          {[
            "مبلغ تأمين الحجز يضمن تثبيت حجزك.",
            "يتم دفع باقي مبلغ الإيجار عند التسليم.",
            "يتم تحصيل مبلغ التأمين فقط قبل تسليم المنتج.",
            "مبلغ التأمين الخاص بك محفوظ وقابل للاسترداد بالكامل بعد إرجاع المنتج بنجاح.",
            "قد تطبق سياسات الإلغاء والاسترداد.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-body-sm">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* محمي بواسطة أجر */}
        <div className="border border-brand-primary rounded-xl p-4 flex items-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            viewBox="0 0 24 24"
            className="w-5 h-5 text-brand-primary mt-0.5 shrink-0"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M20.25 10.907V7.272c0-.829-.633-1.521-1.453-1.644c-.951-.142-2.18-.376-3.078-.722c-.907-.349-1.997-1.007-2.762-1.505a1.76 1.76 0 0 0-1.914 0c-.764.498-1.855 1.156-2.762 1.505c-.899.346-2.127.58-3.078.722c-.82.123-1.453.815-1.453 1.644v3.635a10.13 10.13 0 0 0 5.363 8.939l.23.123l1.962.946a1.6 1.6 0 0 0 1.39 0l1.961-.946l.23-.123a10.13 10.13 0 0 0 5.364-8.939"
            />
          </svg>

          <div>
            <p className="text-body-sm font-semibold">محمي بواسطة أجر</p>
            <p className="text-body-sm text-text-secondary">
              كل عملية إيجار مؤمنة عبر مالكين موثوقين، وتغطية تأمينية، ودعم
              متواصل على مدار الساعة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
