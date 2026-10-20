import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@/src/shared/ui/button';
import {getWheelHero} from '../config/wheel-hero-map';
import type {WheelBrandView} from '../model/adapt-brand-data';

export function BrandHero({data}: {data: WheelBrandView}) {
  const hero = getWheelHero(data.slug);

  return (
    <section className="relative bg-[#111315] text-[#F8F8F8]">
      <div className="relative mx-auto flex w-full max-w-[1680px] flex-col min-[1024px]:block">
        <div className="wheel-brand-hero relative z-10 min-[1024px]:grid min-[1024px]:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] min-[1024px]:items-center min-[1024px]:px-[48px] min-[1024px]:pt-[120px] min-[1024px]:pb-[48px]">
          <div className="min-w-0 px-[20px] pt-[112px] pb-[8px] min-[768px]:px-[32px] min-[768px]:pt-[120px] min-[1024px]:px-0 min-[1024px]:pt-0 min-[1024px]:pb-0">
            <nav aria-label="Breadcrumb" className="wheel-brand-crumbs">
              <ol className="m-0 flex list-none flex-wrap items-center gap-x-[8px] gap-y-[4px] p-0 text-[13px] text-[#C2C4C7]">
                <li>
                  <Link href="/" className="wheel-brand-crumb">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/wheels/" className="wheel-brand-crumb">
                    Wheels
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-[#F8F8F8]">
                  {data.name}
                </li>
              </ol>
            </nav>
            <h1 className="m-0 mt-[22px] text-[40px] leading-[0.98] font-medium break-words text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[768px]:text-[56px] min-[1024px]:text-[68px]">
              {data.headline}
            </h1>
            <div className="mt-[16px] max-w-[36rem]">
              {data.description.map((line) => (
                <p key={line} className="m-0 text-[16px] leading-[1.5] text-[#C2C4C7] min-[1024px]:text-[18px]">
                  {line}
                </p>
              ))}
            </div>
            <div className="mt-[28px]">
              <Button variant="accent" asChild className="wheel-brand-accent h-[48px] px-[22px] text-[16px]">
                <a href="#brand-collection">
                  Explore collection
                  <svg aria-hidden viewBox="0 0 16 16" className="size-[16px]" fill="none">
                    <path d="M4 6.5 8 10.5 12 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </Button>
            </div>
          </div>
        </div>
        {hero ? (
          <div className="pointer-events-none relative mt-[20px] aspect-[3/2] w-full overflow-hidden min-[1024px]:absolute min-[1024px]:inset-x-0 min-[1024px]:top-[108px] min-[1024px]:bottom-0 min-[1024px]:z-0 min-[1024px]:mt-0 min-[1024px]:aspect-auto">
            <Image
              src={hero.src}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) min(100vw, 1680px), 160vw"
              className="object-cover object-right min-[1024px]:object-contain"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
