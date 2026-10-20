import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import type {WheelBrand} from '../model/types';

type WheelBrandCardProps = {
  brand: WheelBrand;
};

export function WheelBrandCard({brand}: WheelBrandCardProps) {
  const external = brand.href.startsWith('http');
  const className =
    'group block h-full rounded-[10px] no-underline';

  const surfaceClass =
    'flex h-full min-h-[168px] translate-y-0 flex-col rounded-[10px] border border-[#DADAD6] bg-white transition-[transform,border-color] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 group-hover:-translate-y-[2px] group-hover:border-[#111315] min-[1024px]:min-h-[184px]';

  const body = (
    <span className={surfaceClass}>
      <span className="flex min-w-0 flex-1 items-center justify-center px-[20px] pt-[22px]">
        {brand.logoSrc ? (
          <Image
            src={brand.logoSrc}
            alt={brand.name}
            width={brand.logoWidth}
            height={brand.logoHeight}
            sizes="240px"
            className="h-auto max-h-[84px] w-auto max-w-full min-w-0 object-contain"
          />
        ) : (
          <span className="text-center text-[18px] leading-[1.2] font-medium text-[#111315] [font-family:var(--font-display),sans-serif]">
            {brand.name}
          </span>
        )}
      </span>
      <span aria-hidden className="flex items-center justify-center gap-[6px] px-[12px] pt-[8px] pb-[16px] text-[14px] font-medium text-[#55595E]">
        Explore wheels
        <ArrowUpRight aria-hidden className="size-[14px]" />
      </span>
    </span>
  );

  if (external) {
    return (
      <a href={brand.href} className={className} target="_blank" rel="noopener noreferrer" aria-label={`Explore ${brand.name} wheels`}>
        {body}
      </a>
    );
  }

  return (
    <Link href={brand.href} className={className} aria-label={`Explore ${brand.name} wheels`}>
      {body}
    </Link>
  );
}
