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
    'flex h-full min-h-[168px] flex-col rounded-[10px] border border-[#DADAD6] bg-white no-underline transition-[transform,border-color] duration-200 motion-reduce:transition-none motion-reduce:hover:translate-y-0 hover:-translate-y-[2px] hover:border-[#111315] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#111315] min-[1024px]:min-h-[184px]';

  const body = (
    <>
      <span className="flex flex-1 items-center justify-center px-[20px] pt-[22px]">
        {brand.logoSrc ? (
          <Image
            src={brand.logoSrc}
            alt={brand.name}
            width={270}
            height={180}
            sizes="180px"
            style={{width: 'auto', height: 'auto'}}
            className="max-h-[84px] max-w-[82%] object-contain"
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
    </>
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
