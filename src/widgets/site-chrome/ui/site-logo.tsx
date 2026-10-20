import Image from 'next/image';
import Link from 'next/link';
import {cn} from '@/src/shared/lib/cn';

type SiteLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function SiteLogo({className, imageClassName, priority = false}: SiteLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Progressive Autosports, home"
      className={cn(
        'inline-flex items-center gap-[8px] no-underline min-[1024px]:gap-[10px]',
        className,
      )}
    >
      <span className="inline-flex h-[34px] w-[30px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-white min-[1024px]:h-[40px] min-[1024px]:w-[36px]">
        <Image
          src="/brand/logo.png"
          alt=""
          width={507}
          height={620}
          priority={priority}
          className={cn('h-[22px] w-auto min-[1024px]:h-[26px]', imageClassName)}
        />
      </span>
      <span className="text-[#F8F8F8] [font-family:var(--font-display),sans-serif]">
        <span className="block text-[12px] font-semibold uppercase leading-none tracking-[0.14em] min-[1024px]:text-[15px] min-[1024px]:tracking-[0.16em]">
          Progressive
        </span>
        <span className="mt-[3px] block text-[10px] font-medium uppercase leading-none tracking-[0.18em] min-[1024px]:text-[12px] min-[1024px]:tracking-[0.2em]">
          Autosports
        </span>
      </span>
    </Link>
  );
}
