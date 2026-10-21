'use client';

import {Search, X} from 'lucide-react';
import {useEffect, useId, useRef, useState} from 'react';
import {WheelDesignCard, type WheelCatalogItem, type WheelCategory} from '@/src/entities/wheel-design';
import {WheelImageLightbox} from '@/src/features/view-wheel-image';
import {CatalogPagination} from '@/src/shared/ui/catalog-pagination';
import {DESIGNS_PER_PAGE, clampPage, filterCatalogItems, pageCount, paginate, paginationItems, resultNoun, showingLabel} from '../model/catalog';

type WheelDesignCatalogProps = {
  brandName: string;
  categories: WheelCategory[];
  showFilters: boolean;
  items: WheelCatalogItem[];
  searchable: boolean;
  contactEmail: string;
};

export function WheelDesignCatalog({brandName, categories, showFilters, items, searchable, contactEmail}: WheelDesignCatalogProps) {
  const searchId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const shouldScroll = useRef(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const activeCategory = category && categories.some((entry) => entry.slug === category) ? category : null;
  const searched = filterCatalogItems(items, query, null);
  const filtered = filterCatalogItems(items, query, activeCategory);
  const count = pageCount(filtered.length, DESIGNS_PER_PAGE);
  const current = clampPage(page, count);
  const visible = paginate(filtered, current, DESIGNS_PER_PAGE);
  const noun = resultNoun(filtered);
  const pages = paginationItems(current, count);
  const namedOnly = items.every((item) => item.kind === 'named-design');
  const galleryOnly = items.every((item) => item.kind === 'gallery-image');
  const allLabel = galleryOnly ? 'All images' : namedOnly ? 'All designs' : 'All';

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

  const changeCategory = (slug: string | null) => {
    setCategory(slug);
    setPage(1);
  };

  const changePage = (next: number) => {
    if (next === current) return;
    shouldScroll.current = true;
    setPage(next);
  };

  const countFor = (slug: string) => searched.filter((item) => item.kind === 'named-design' && item.category === slug).length;

  return (
    <section
      ref={sectionRef}
      id="brand-collection"
      aria-labelledby="brand-collection-title"
      className="scroll-mt-[88px] bg-[#F4F3EF] text-[#111315] min-[1024px]:scroll-mt-[100px]"
    >
      <div className="mx-auto max-w-[1320px] px-[20px] pt-[40px] pb-[28px] min-[768px]:px-[24px] min-[768px]:pt-[56px] min-[1024px]:px-[48px] min-[1024px]:pt-[80px] min-[1024px]:pb-[36px]">
        <div className="flex flex-col gap-[24px] min-[1100px]:flex-row min-[1100px]:items-end min-[1100px]:justify-between">
          <div className="min-w-0">
            <p className="m-0 text-[12px] font-medium tracking-[0.18em] text-[#55595E] uppercase">The {brandName} collection</p>
            <h2 id="brand-collection-title" className="m-0 mt-[12px] text-[32px] leading-[1.05] font-medium text-[#111315] [font-family:var(--font-display),sans-serif] min-[768px]:text-[44px]">
              Find your signature.
            </h2>
            <p className="m-0 mt-[14px] max-w-[40rem] text-[16px] leading-[1.5] text-[#55595E] min-[1024px]:text-[18px]">
              Browse designs. We’ll help confirm the fit for your car.
            </p>
          </div>
          {searchable ? (
            <form role="search" className="w-full min-[1100px]:w-[300px] min-[1100px]:shrink-0" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor={searchId} className="sr-only">
                Search designs
              </label>
              <div className="relative">
                <Search aria-hidden className="pointer-events-none absolute top-1/2 left-[16px] size-[18px] -translate-y-1/2 text-[#55595E]" />
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  placeholder="Search designs"
                  autoComplete="off"
                  onChange={(event) => changeQuery(event.target.value)}
                  className="h-[52px] w-full rounded-full border border-[#DADAD6] bg-white pr-[48px] pl-[44px] text-[16px] text-[#111315] outline-none placeholder:text-[#55595E]"
                />
                {query.length > 0 ? (
                  <button type="button" aria-label="Clear search" onClick={() => changeQuery('')} className="absolute top-1/2 right-[4px] inline-flex size-[44px] -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#111315]">
                    <X aria-hidden className="size-[16px]" />
                  </button>
                ) : null}
              </div>
            </form>
          ) : null}
        </div>

        {showFilters ? (
          <div className="mt-[28px] flex flex-wrap gap-[8px]" role="group" aria-label="Categories">
            <FilterPill pressed={activeCategory === null} onClick={() => changeCategory(null)} label={allLabel} count={searched.length} />
            {categories.map((entry) => (
              <FilterPill key={entry.slug} pressed={activeCategory === entry.slug} onClick={() => changeCategory(entry.slug)} label={entry.label} count={countFor(entry.slug)} />
            ))}
          </div>
        ) : null}

        <p className="sr-only" aria-live="polite">
          {filtered.length === 0 ? 'No matches' : showingLabel(visible.length, filtered.length, noun)}
        </p>

        {visible.length > 0 ? (
          <ul role="list" className="m-0 mt-[28px] grid list-none grid-cols-1 gap-[16px] p-0 min-[480px]:grid-cols-2 min-[1024px]:grid-cols-3 min-[1024px]:gap-[20px] min-[1280px]:grid-cols-4">
            {visible.map((item) => (
              <li key={item.id} className="min-w-0">
                <WheelDesignCard
                  item={item}
                  onOpen={(trigger) => {
                    triggerRef.current = trigger;
                    setActiveId(item.id);
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-[28px] rounded-[12px] border border-[#DADAD6] bg-white px-[24px] py-[48px] text-center">
            <p className="m-0 text-[18px] leading-[1.4] font-medium text-[#111315]">No designs match these filters.</p>
            <button type="button" onClick={() => { changeQuery(''); changeCategory(null); }} className="mt-[16px] inline-flex h-[44px] items-center justify-center rounded-full border border-[#111315] bg-transparent px-[18px] text-[15px] font-medium text-[#111315]">
              Clear filters
            </button>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="mt-[24px] flex flex-col gap-[16px] min-[768px]:mt-[28px] min-[768px]:flex-row min-[768px]:items-center min-[768px]:justify-between">
            <p className="m-0 text-[14px] text-[#55595E] tabular-nums">{showingLabel(visible.length, filtered.length, noun)}</p>
            <CatalogPagination label="Design pages" current={current} count={count} items={pages} onSelect={changePage} />
          </div>
        ) : null}
      </div>
      <WheelImageLightbox
        items={filtered}
        activeId={activeId}
        brandName={brandName}
        contactEmail={contactEmail}
        onOpenChange={(id) => {
          setActiveId(id);
          if (id === null) {
            const trigger = triggerRef.current;
            requestAnimationFrame(() => trigger?.focus());
          }
        }}
      />
    </section>
  );
}

function FilterPill({pressed, onClick, label, count}: {pressed: boolean; onClick: () => void; label: string; count: number}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={
        pressed
          ? 'inline-flex h-[44px] items-center gap-[8px] rounded-full border border-[#111315] bg-[#111315] px-[16px] text-[14px] font-medium text-[#F8F8F8]'
          : 'inline-flex h-[44px] items-center gap-[8px] rounded-full border border-[#DADAD6] bg-white px-[16px] text-[14px] font-medium text-[#111315]'
      }
    >
      <span>{label}</span>
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
