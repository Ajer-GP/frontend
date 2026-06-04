import React from "react";
import Link from "next/link";
import LoginForm from "@/modules/user/features/auth/components/LoginForm";

export default function Login() {
  return (
    <div>
      <h1 className="text-4xl text-text-primary mb-2">مرحبا بعودتك</h1>
      <p className="text-gray-400 text-h3 my-2">
        لا تمتلك حساب ؟
        <Link href="/auth/register" className=" text-brand-primary underline">
          {" "}
          قم بأنشاء حسابك الأن{" "}
        </Link>
      </p>
      <LoginForm />
    </div>
  );
}
