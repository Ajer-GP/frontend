"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "الفئات" },
  { href: "/list", label: "اعرض منتجك للايجار" },
  { href: "/how-it-works", label: "كيف يعمل أجر؟" },
  { href: "/privacy", label: "سياسة الخصوصية والأمان" },
];

export default function Navbar() {
  const [loginState, loginAction] = useState(true);
  return (
    <>
      <div className='navbar bg-base-100 shadow-sm sticky top-0 z-50'>
        {/* Logo */}
        <div className='navbar-start'>
          <Link href='/'>
            <Image
              src='/images/logo.png'
              alt='Ajer'
              width={50}
              height={50}
              className='w-14 h-14'
            />
          </Link>
        </div>

        {/* Desktop Links */}
        <div className='navbar-center hidden lg:flex'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='px-4 font-black hover:text-brand-primary hover:underline underline-offset-6'>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons */}
        {loginState ? (
          <div className='navbar-end gap-2 hidden lg:flex mx-7'>
            <Link href='/notifications'>
              <span className='flex items-center justify-center size-12 bg-brand-light text-brand-primary rounded-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-8'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0'
                  />
                </svg>
              </span>
            </Link>
            <Link href='/auth/profile'>
              <span className='flex items-center justify-center size-12 bg-brand-light text-brand-primary rounded-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-8'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                  />
                </svg>
              </span>
            </Link>
          </div>
        ) : (
          <div className='navbar-end gap-2 hidden lg:flex mx-7'>
            <Link href='/auth/login' className='btn rounded-2xl bg-white'>
              تسجيل الدخول
            </Link>
            <Link
              href='/auth/register'
              className='btn rounded-2xl bg-brand-dark text-white'>
              ابدأ الآن
            </Link>
          </div>
        )}
        {/* Mobile Hamburger — DaisyUI dropdown */}
        <div className='navbar-end lg:hidden'>
          <div className='dropdown dropdown-end'>
            <label tabIndex={0} className='btn btn-ghost btn-square'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-8 w-8'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-64'>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className='font-black'>
                    {link.label}
                  </Link>
                </li>
              ))}
              {loginState ? (
                <span className='flex my-3'>
                  <Link href='/notifications'>
                    <span className='flex items-center justify-center size-12 bg-brand-light text-brand-primary rounded-full mx-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-8'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0'
                        />
                      </svg>
                    </span>
                  </Link>
                  <Link href='/auth/profile'>
                    <span className='flex items-center justify-center size-12 bg-brand-light text-brand-primary rounded-full mx-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-8'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                        />
                      </svg>
                    </span>
                  </Link>
                </span>
              ) : (
                <span>
                  <li className='mt-2'>
                    <Link
                      href='/auth/login'
                      className='btn btn-sm rounded-2xl bg-white my-1'>
                      تسجيل الدخول
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/auth/register'
                      className='btn btn-sm rounded-2xl bg-brand-dark text-white my-1'>
                      ابدأ الآن
                    </Link>
                  </li>
                </span>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
