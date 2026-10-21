'use client';

import {Search, X} from 'lucide-react';
import {useEffect, useId, useRef, useState} from 'react';
import {WheelBrandCard, type WheelBrand} from '@/src/entities/wheel-brand';
import {CatalogPagination} from '@/src/shared/ui/catalog-pagination';
import {BRANDS_PER_PAGE, clampPage, filterBrands, pageCount, paginate} from '../model/catalog';

type WheelBrandCatalogProps = {
  brands: WheelBrand[];
};

export function WheelBrandCatalog({brands}: WheelBrandCatalogProps) {
  const searchId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const shouldScroll = useRef(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = filterBrands(brands, query);
  const count = pageCount(filtered.length, BRANDS_PER_PAGE);
  const current = clampPage(page, count);
  const visible = paginate(filtered, current, BRANDS_PER_PAGE);

  useEffect(() => {
    if (page !== current) setPage(current);
  }, [page, current]);

  useEffect(() => {
    if (!shouldScroll.current) return;
    shouldScroll.current = false;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sectionRef.current?.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'start'});
  }, [page]);

  const changeQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const changePage = (next: number) => {
    if (next === current) return;
    shouldScroll.current = true;
    setPage(next);
  };

  return (
    <section
      ref={sectionRef}
      id="wheel-brands"
      aria-labelledby="wheel-brands-title"
      className="scroll-mt-[88px] bg-[#F4F3EF] text-[#111315] min-[1024px]:scroll-mt-[100px]"
    >
      <div className="mx-auto max-w-[1320px] px-[20px] py-[48px] min-[768px]:px-[24px] min-[768px]:py-[72px] min-[1024px]:px-[48px] min-[1024px]:py-[88px]">
        <div className="flex flex-col gap-[24px] min-[1100px]:flex-row min-[1100px]:items-end min-[1100px]:justify-between">
          <div className="min-[1100px]:min-w-0 min-[1100px]:flex-1">
            <p className="m-0 text-[12px] font-medium tracking-[0.18em] text-[#55595E] uppercase">The wheel collection</p>
            <h2
              id="wheel-brands-title"
              className="m-0 mt-[12px] text-[32px] leading-[1.05] font-medium text-[#111315] [font-family:var(--font-display),sans-serif] min-[768px]:text-[44px]"
            >
              Exceptional brands. Individual style.
            </h2>
            <p className="m-0 mt-[14px] text-[16px] leading-[1.5] text-[#55595E] min-[1024px]:text-[18px]">
              Discover the brands behind your next set of wheels.
            </p>
          </div>
          <form role="search" className="w-full min-[1100px]:w-[300px] min-[1100px]:shrink-0" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor={searchId} className="sr-only">
              Search brands
            </label>
            <div className="relative">
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-[16px] size-[18px] -translate-y-1/2 text-[#55595E]" />
              <input
                id={searchId}
                type="search"
                value={query}
                placeholder="Search brands"
                autoComplete="off"
                onChange={(event) => changeQuery(event.target.value)}
                className="h-[52px] w-full rounded-full border border-[#DADAD6] bg-white pr-[48px] pl-[44px] text-[16px] text-[#111315] outline-none placeholder:text-[#55595E]"
              />
              {query.length > 0 ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => changeQuery('')}
                  className="absolute top-1/2 right-[4px] inline-flex size-[44px] -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#111315]"
                >
                  <X aria-hidden className="size-[16px]" />
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <p className="sr-only" aria-live="polite">
          {filtered.length === 0 ? 'No brands found' : `${filtered.length} ${filtered.length === 1 ? 'brand' : 'brands'}`}
        </p>

        {visible.length > 0 ? (
          <ul role="list" className="m-0 mt-[32px] grid list-none grid-cols-1 gap-[16px] p-0 min-[480px]:grid-cols-2 min-[1024px]:mt-[40px] min-[1024px]:grid-cols-3 min-[1024px]:gap-[20px] min-[1280px]:grid-cols-4">
            {visible.map((brand) => (
              <li key={brand.href} className="min-w-0">
                <WheelBrandCard brand={brand} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-[32px] rounded-[10px] border border-[#DADAD6] bg-white px-[24px] py-[48px] text-center">
            <p className="m-0 text-[18px] leading-[1.4] font-medium text-[#111315]">No brands found</p>
            <button
              type="button"
              onClick={() => changeQuery('')}
              className="mt-[16px] inline-flex h-[44px] items-center justify-center rounded-full border border-[#111315] bg-transparent px-[18px] text-[15px] font-medium text-[#111315]"
            >
              Clear search
            </button>
          </div>
        )}

        <CatalogPagination
          label="Brand pages"
          current={current}
          count={count}
          items={Array.from({length: count}, (_, index) => index + 1)}
          onSelect={changePage}
          className="mt-[28px] justify-end min-[1024px]:mt-[36px]"
        />
      </div>
    </section>
  );
}
