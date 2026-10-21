import Link from 'next/link';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import type {ReactNode} from 'react';
import {cn} from '@/src/shared/lib/cn';
import './button.css';

const control =
  'site-control inline-flex h-[44px] min-w-[44px] items-center justify-center rounded-[8px] border px-[12px] text-[15px] font-medium tabular-nums no-underline transition-colors duration-200 motion-reduce:transition-none disabled:cursor-default';

const idle = 'border-[#DADAD6] bg-white text-[#111315] disabled:text-[#55595E]';
const currentPage = 'border-[#CD202B] bg-[#CD202B] text-white';

export type PaginationItem = number | 'gap';

type CatalogPaginationProps = {
  label: string;
  current: number;
  count: number;
  items: PaginationItem[];
  className?: string;
  hrefFor?: (page: number) => string;
  onSelect?: (page: number) => void;
};

export function CatalogPagination({label, current, count, items, className, hrefFor, onSelect}: CatalogPaginationProps) {
  if (count <= 1) return null;

  return (
    <nav aria-label={label} className={cn('flex flex-wrap items-center gap-[8px]', className)}>
      <Step
        page={current - 1}
        disabled={current <= 1}
        label="Previous page"
        hrefFor={hrefFor}
        onSelect={onSelect}
      >
        <ChevronLeft aria-hidden className="size-[18px]" />
      </Step>
      {items.map((item, index) =>
        item === 'gap' ? (
          <span key={`gap-${index}`} className="px-[4px] text-[15px] text-[#55595E]" aria-hidden>
            …
          </span>
        ) : (
          <PageNumber key={item} page={item} current={current} hrefFor={hrefFor} onSelect={onSelect} />
        ),
      )}
      <Step
        page={current + 1}
        disabled={current >= count}
        label="Next page"
        hrefFor={hrefFor}
        onSelect={onSelect}
      >
        <ChevronRight aria-hidden className="size-[18px]" />
      </Step>
    </nav>
  );
}

function PageNumber({
  page,
  current,
  hrefFor,
  onSelect,
}: {
  page: number;
  current: number;
  hrefFor?: (page: number) => string;
  onSelect?: (page: number) => void;
}) {
  const active = page === current;
  const className = cn(control, active ? currentPage : idle);
  const label = `Page ${page}`;

  if (hrefFor) {
    if (active) {
      return (
        <span className={className} aria-current="page" aria-label={label}>
          {page}
        </span>
      );
    }
    return (
      <Link href={hrefFor(page)} aria-label={label} className={className}>
        {page}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      onClick={() => onSelect?.(page)}
    >
      {page}
    </button>
  );
}

function Step({
  page,
  disabled,
  label,
  hrefFor,
  onSelect,
  children,
}: {
  page: number;
  disabled: boolean;
  label: string;
  hrefFor?: (page: number) => string;
  onSelect?: (page: number) => void;
  children: ReactNode;
}) {
  const className = cn(control, idle);

  if (disabled || !hrefFor) {
    return (
      <button type="button" className={className} aria-label={label} disabled={disabled} onClick={() => onSelect?.(page)}>
        {children}
      </button>
    );
  }

  return (
    <Link href={hrefFor(page)} aria-label={label} className={className}>
      {children}
    </Link>
  );
}
