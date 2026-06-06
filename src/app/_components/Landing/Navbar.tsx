import Image from "next/image";
import Link from "next/link";
import React from "react";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "الفئات" },
  { href: "/list", label: "اعرض منتجك للايجار" },
  { href: "/how-it-works", label: "كيف يعمل أجر؟" },
  { href: "/privacy", label: "سياسة الخصوصية والأمان" },
];

export default function Navbar() {
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
        {/* Logo */}
        <div className="navbar-start">
          <Link href="/">
            <Image src="/images/logo.png" alt="Ajer" width={50} height={50} />
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="navbar-center hidden lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 font-black hover:text-brand-primary hover:underline underline-offset-6"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="navbar-end gap-2 hidden lg:flex">
          <Link href="/auth/login" className="btn rounded-2xl bg-white">
            تسجيل الدخول
          </Link>
          <Link
            href="/auth/register"
            className="btn rounded-2xl bg-brand-dark text-white"
          >
            ابدأ الآن
          </Link>
        </div>

        {/* Mobile Hamburger — DaisyUI dropdown */}
        <div className="navbar-end lg:hidden">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-64"
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-black">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <Link
                  href="/auth/login"
                  className="btn btn-sm rounded-2xl bg-white my-1"
                >
                  تسجيل الدخول
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="btn btn-sm rounded-2xl bg-brand-dark text-white my-1"
                >
                  ابدأ الآن
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
