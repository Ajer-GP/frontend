"use client";

import { useState, useTransition, useCallback, useMemo, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import ProductCard from "./ProductCard";
import { getProductsAction } from "../services/products.actions";
import {
  ActionResult,
  GetProductsParams,
  Product,
  ProductCondition,
  ProductsResponse,
} from "../types/products.typs";
import Link from "next/link";

// ── Constants ──────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "", label: "جميع المنتجات" },
  // { value: "cameras", label: "كاميرات" },
  // { value: "laptops", label: "لابتوب" },
  // { value: "tablets", label: "تابلت" },
  // { value: "gaming", label: "بلايستيشن" },
  // { value: "audio", label: "سماعات" },
  { value: "electronics", label: "الكترونيات" },
  { value: "clothes", label: "ملابس" },
  { value: "books", label: "كتب" },
  { value: "party tools", label: "أدوات حفلات" },
  // { value: "drones", label: "درون" },
  // { value: "lighting", label: "إضاءة" },
  // { value: "other", label: "أخرى" },
];

const CONDITIONS: { value: ProductCondition; label: string }[] = [
  { value: "excellent", label: "ممتاز" },
  { value: "good", label: "جديد" },
  { value: "fair", label: "جيد" },
];

const PERIODS = [
  { value: "hour", label: "ساعة" },
  { value: "day", label: "يوم" },
  { value: "week", label: "أسبوع" },
];

// ── Types ──────────────────────────────────────────────────────────────────────

interface Props {
  initialResult: ActionResult<ProductsResponse>;
  initialParams: GetProductsParams;
  AiProducts: Product[]; // ✅ مش GetProductsParams
}
// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductsClient({
  initialResult,
  initialParams,
  AiProducts,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local filter state (not committed until "بحث" / filter changes)
  const [filters, setFilters] = useState<GetProductsParams>({
    page: 1,
    limit: 12,
    ...initialParams,
  });
  const [searchInput, setSearchInput] = useState(initialParams.search ?? "");
  // Price slider local state
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialParams.minPrice ?? 0,
    initialParams.maxPrice ?? 5000,
  ]);

  // Selected conditions (multi-select checkboxes)
  const [selectedConditions, setSelectedConditions] = useState<
    ProductCondition[]
  >(
    initialParams.condition
      ? [initialParams.condition as ProductCondition]
      : [],
  );

  // Active period tab
  const [activePeriod, setActivePeriod] = useState<string>(
    initialParams.period ?? "day",
  );

  // Result state — starts with SSR data
  const [result, setResult] =
    useState<ActionResult<ProductsResponse>>(initialResult);

  const [aiProducts, setAiProducts] = useState<Product[]>(AiProducts);
  console.log(aiProducts, "efef");

  // Filter sidebar open on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Fetch helper ────────────────────────────────────────────────────────────

  const fetchProducts = useCallback(
    (params: GetProductsParams) => {
      startTransition(async () => {
        const res = await getProductsAction(params);
        setResult(res);
      });

      // Sync URL
      const qs = new URLSearchParams();
      if (params.page && params.page > 1) qs.set("page", String(params.page));
      if (params.category) qs.set("category", params.category);
      if (params.condition) qs.set("condition", params.condition);
      if (params.period) qs.set("period", params.period);
      if (params.minPrice) qs.set("minPrice", String(params.minPrice));
      if (params.maxPrice) qs.set("maxPrice", String(params.maxPrice));
      if (params.search) qs.set("search", params.search);
      router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
    },
    [pathname, router],
  );

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleCategoryClick = (cat: string) => {
    const next = { ...filters, category: cat, page: 1 };
    setFilters(next);
    fetchProducts(next);
  };

  const handleConditionToggle = (cond: ProductCondition) => {
    const next = selectedConditions.includes(cond)
      ? selectedConditions.filter((c) => c !== cond)
      : [...selectedConditions, cond];
    setSelectedConditions(next);
    // API only supports single condition — pass first selected
    const nextFilters = {
      ...filters,
      condition: next[0] ?? undefined,
      page: 1,
    };
    setFilters(nextFilters);
    fetchProducts(nextFilters);
  };

  const handlePeriodClick = (period: string) => {
    setActivePeriod(period);
    const next = {
      ...filters,
      period: period as GetProductsParams["period"],
      page: 1,
    };
    setFilters(next);
    fetchProducts(next);
  };

  const handlePriceApply = () => {
    const next = {
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      page: 1,
    };
    setFilters(next);
    fetchProducts(next);
  };

  const handlePageChange = (page: number) => {
    const next = { ...filters, page };
    setFilters(next);
    fetchProducts(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Derived data ────────────────────────────────────────────────────────────
  const handleSearch = () => {
    const next = { ...filters, search: searchInput.trim(), page: 1 };
    setFilters(next);
    fetchProducts(next);
  };
  const products: Product[] = result.success ? result.data.result.products : [];
  const total = result.success ? result.data.result.pagination.total : 0;
  const totalPages = result.success ? result.data.result.pagination.pages : 0;
  const currentPage = result.success ? result.data.result.pagination.page : 1;

  const filteredProducts = useMemo(() => {
    if (!searchInput.trim()) return products;
    const term = searchInput.trim().toLowerCase();
    return products.filter((p) => p.title.toLowerCase().includes(term));
  }, [products, searchInput]);
  // console.log(products, "ioihoih");
  // console.log(result, "uuuuuuuuu");

  const hasError = !result.success;
  const errorMsg = !result.success ? result.error : "";

  const activeCategory = filters.category ?? "";

  // ── Filter sidebar (shared between desktop and mobile drawer) ───────────────

  const renderFilterSidebar = () => (
    <aside dir="rtl" className="w-full flex flex-col gap-5">
      {/* Price range */}
      <div className="border border-border-default rounded-2xl overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-4 py-3 bg-surface-secondary"
          onClick={() => {}}>
          <span className="text-h3 font-medium text-text-primary">
            سعر الإيجار
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-4 text-text-secondary">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 15.75 7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
        <div className="px-4 pb-4 pt-3 flex flex-col gap-3">
          {/* Range slider */}

          <div className="relative h-2 bg-surface-tertiary rounded-full mt-2">
            {/* الجزء المحدد */}
            <div
              className="absolute h-2 bg-brand-primary rounded-full"
              style={{
                right: `${(priceRange[0] / 5000) * 100}%`,
                left: `${100 - (priceRange[1] / 5000) * 100}%`,
              }}
            />

            {/* دائرة الـ Min - بتتبع نفس منطق الـ right */}
            {/* <div
              className="absolute top-1/2 w-5 h-5 bg-white border-2 border-brand-primary rounded-full -translate-y-1/2 shadow pointer-events-none"
              style={{
                right: `calc(${(priceRange[0] / 5000) * 100}% - 10px)`,
              }}
            /> */}

            {/* دائرة الـ Max - بتتبع نفس منطق الـ left */}
            <div
              className="absolute top-1/2 w-5 h-5 bg-white border-2 border-brand-primary rounded-full -translate-y-1/2 shadow pointer-events-none"
              style={{
                left: `calc(${100 - (priceRange[1] / 5000) * 100}% - 10px)`,
              }}
            />

            <input
              type="range"
              min={0}
              max={5000}
              step={50}
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([
                  Math.min(Number(e.target.value), priceRange[1] - 50),
                  priceRange[1],
                ])
              }
              onMouseUp={handlePriceApply}
              onTouchEnd={handlePriceApply}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
            />

            <input
              type="range"
              min={0}
              max={5000}
              step={50}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([
                  priceRange[0],
                  Math.max(Number(e.target.value), priceRange[0] + 50),
                ])
              }
              onMouseUp={handlePriceApply}
              onTouchEnd={handlePriceApply}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
            />
          </div>
          <div className="flex justify-between text-caption text-text-secondary mt-1">
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-overline text-text-tertiary">من</span>
              <span className="font-medium text-text-primary">
                {priceRange[0].toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-overline text-text-tertiary">إلى</span>
              <span className="font-medium text-text-primary">
                {priceRange[1].toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rental period */}
      <div className="border border-border-default rounded-2xl overflow-hidden">
        <button className="w-full flex items-center justify-between px-4 py-3 bg-surface-secondary">
          <span className="text-h3 font-medium text-text-primary">
            مدة الإيجار
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-4 text-text-secondary">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 15.75 7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
        <div className="px-4 pb-4 pt-3 flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => handlePeriodClick(p.value)}
              className={`flex-1 py-2 rounded-xl text-body-sm font-medium border transition-colors ${
                activePeriod === p.value
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-text-secondary border-border-default hover:border-brand-primary"
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="border border-border-default rounded-2xl overflow-hidden">
        <button className="w-full flex items-center justify-between px-4 py-3 bg-surface-secondary">
          <span className="text-h3 font-medium text-text-primary">الحالة</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-4 text-text-secondary">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 15.75 7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
        <div className="px-4 pb-4 pt-2 flex flex-col gap-2">
          {CONDITIONS.map((c) => (
            <label
              key={c.value}
              className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-body-sm text-text-primary">{c.label}</span>
              <input
                type="checkbox"
                checked={selectedConditions.includes(c.value)}
                onChange={() => handleConditionToggle(c.value)}
                className="checkbox checkbox-sm border-border-default checked:border-brand-primary [--chkbg:theme(colors.brand-primary)]"
              />
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  // if (!aiProducts?.length) return null;

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // RTL: زر اليمين = scroll للخلف (محتوى أحدث)، زر الشمال = scroll للأمام
    el.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };
  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div dir="rtl" className="min-h-screen bg-surface-primary">
      <div
        style={{
          backgroundImage: `
          linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
        `,
          backgroundSize: "80px 80px",
        }}>
        {/* Breadcrumb */}

        <div className="breadcrumbs text-sm max-w-7xl mx-auto px-4 py-2.5 text-[#676767]">
          <ul>
            <li>
              <Link href="/" className="font-medium text-[20px]">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link href="/categories" className="font-medium text-[20px]">
                الفئات
              </Link>
            </li>
            {activeCategory && (
              <li className="text-[#2E9E6E] font-medium text-[20px]">
                {CATEGORIES.find((c) => c.value === activeCategory)?.label}
              </li>
            )}
          </ul>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Page header */}
          <div className="mb-6">
            {/* AI recommendation banner */}
            <div className="inline-flex items-center gap-1.5 bg-[#E8F0ED] text-[#2E9E6E] text-caption font-normal px-3 py-1.5 rounded-full mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-3.5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                />
              </svg>
              توصيات ذكية بالذكاء الاصطناعي
            </div>

            <h1 className="text-[48px] font-medium text-text-primary mb-1">
              {activeCategory
                ? (CATEGORIES.find((c) => c.value === activeCategory)?.label ??
                  "المنتجات")
                : "جميع المنتجات"}
            </h1>
            <p className="text-[20px] text-text-secondary">
              استأجر كاميرات احترافية، وأجهزة لابتوب، ومعدات متنوعة من ملاك
              موثوقين في جميع أنحاء مصر بالساعة أو باليوم أو بالأسبوع.
            </p>
            <p className="text-[#515151] font-semibold text-[20px] mt-1">
              {total?.toLocaleString()} منتج متوفر
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* ── Filter sidebar — desktop ──────────────────────────────────────── */}
          <div className="hidden lg:block w-64 shrink-0">
            {/* Filter header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-h3 font-medium text-text-primary">
                فلتر
              </span>
              <button
                onClick={() => {
                  setSelectedConditions([]);
                  setPriceRange([0, 5000]);
                  setActivePeriod("day");
                  const next = { page: 1, limit: 12 };
                  setFilters(next);
                  fetchProducts(next);
                }}
                className="text-caption text-text-tertiary hover:text-brand-primary transition-colors">
                مسح الكل
              </button>
            </div>
            {renderFilterSidebar()}
          </div>

          {/* ── Main content ────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Category tabs + search row */}
            <div className="flex flex-col gap-3 mb-5">
              {/* Search */}
              <div className="flex items-center gap-2 border border-border-default rounded-xl px-3 py-2 bg-white hover:border-brand-primary transition-colors w-full min-w-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 text-text-tertiary shrink-0">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="كاميرا، لابتوب، سماعة..."
                  className="flex-1 min-w-0 bg-transparent outline-none text-body-sm text-text-primary placeholder:text-text-tertiary"
                />
                <button
                  onClick={handleSearch}
                  className="bg-brand-primary text-white text-[11px] sm:text-body-sm px-2 sm:px-4 py-1.5 rounded-lg hover:bg-brand-dark transition-colors shrink-0 whitespace-nowrap">
                  ابحث
                </button>
              </div>

              {/* Category pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryClick(cat.value)}
                    className={`shrink-0 px-4 py-1.5 rounded-xl text-body-sm font-medium border transition-colors whitespace-nowrap ${
                      activeCategory === cat.value
                        ? "bg-brand-primary text-white border-brand-primary"
                        : "bg-white text-text-secondary border-border-default hover:border-brand-primary hover:text-brand-primary"
                    }`}>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Mobile filter button */}
              <div className="flex items-center justify-between lg:hidden">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 border border-border-default rounded-xl px-4 py-2 text-body-sm text-text-secondary hover:border-brand-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                    />
                  </svg>
                  فلتر
                </button>
                <span className="text-caption text-text-tertiary">
                  {total?.toLocaleString()} نتيجة
                </span>
              </div>
            </div>

            {aiProducts && (
              <div className="mb-5">
                {/* ── Header ─────────────────────────────────────────────────────── */}
                <div className="flex items-center gap-2 flex-row-reverse mb-3 px-1">
                  {/* العنوان + أيقونة */}
                  <div className="flex items-center gap-2 flex-row-reverse flex-1 min-w-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4 text-accent-default shrink-0">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                      />
                    </svg>
                    <span className="text-body-sm font-semibold text-[var(--text-primary)] truncate">
                      توصيات ذكية بالذكاء الاصطناعي مختارة لك
                    </span>
                  </div>

                  {/* Arrows */}
                  <div className="flex gap-1.5 shrink-0">
                    {/* زر يمين — يتحرك للخلف في RTL */}
                    <button
                      type="button"
                      onClick={() => scroll("right")}
                      className="size-7 rounded-full border border-[var(--border-default)] flex items-center justify-center
                       text-[var(--text-secondary)] hover:border-accent-default hover:text-accent-default
                       hover:bg-accent-light transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-3.5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </button>
                    {/* زر شمال */}
                    <button
                      type="button"
                      onClick={() => scroll("left")}
                      className="size-7 rounded-full border border-[var(--border-default)] flex items-center justify-center
                       text-[var(--text-secondary)] hover:border-accent-default hover:text-accent-default
                       hover:bg-accent-light transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-3.5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m15.75 19.5-7.5-7.5 7.5-7.5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* ── Scrollable Cards Row ─────────────────────────────────────────── */}
                <div
                  ref={scrollRef}
                  className="flex flex-row-reverse gap-3 overflow-x-auto pb-2
                   scroll-smooth snap-x snap-mandatory
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {aiProducts.map((item, i) => (
                    <div
                      key={i}
                      className="shrink-0 w-[200px] sm:w-[220px] snap-start">
                      <ProductCard
                        product={item.product}
                        period={activePeriod}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Product grid */}
            {hasError ? (
              <div className="text-center py-20">
                <p className="text-danger text-body">{errorMsg}</p>
              </div>
            ) : isPending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-surface-secondary animate-pulse h-72"
                  />
                ))}
              </div>
            ) : products?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="size-16 rounded-full bg-surface-tertiary flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-8 text-text-tertiary">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>
                <p className="text-h3 text-text-secondary">لا توجد منتجات</p>
                <p className="text-body-sm text-text-tertiary">
                  جرّب تغيير الفلاتر
                </p>
              </div>
            ) : (
              <>
                <div className="text-caption text-text-tertiary mb-3">
                  {filteredProducts.length?.toLocaleString()} منتج متوفر
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredProducts?.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      period={activePeriod}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="size-9 rounded-xl border border-border-default flex items-center justify-center text-text-secondary hover:border-brand-primary hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="size-4">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`size-9 rounded-xl text-body-sm font-medium transition-colors ${
                        page === currentPage
                          ? "bg-brand-primary text-white"
                          : "border border-border-default text-text-secondary hover:border-brand-primary hover:text-brand-primary"
                      }`}>
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="size-9 rounded-xl border border-border-default flex items-center justify-center text-text-secondary hover:border-brand-primary hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="size-4">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m15.75 19.5-7.5-7.5 7.5-7.5"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-h2 font-medium text-text-primary">
                الفلاتر
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="size-8 rounded-full bg-surface-secondary flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {renderFilterSidebar()}{" "}
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-full mt-4 bg-brand-primary text-white py-3 rounded-xl font-medium hover:bg-brand-dark transition-colors">
              عرض النتائج
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
