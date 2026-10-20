import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {showroomPhoto, wheelsLink} from '../config/content';

export function HomeCustomization() {
  return (
    <section className="bg-[#111315] text-[#F8F8F8]">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-[28px] px-[16px] py-[64px] min-[768px]:px-[32px] min-[1024px]:grid-cols-2 min-[1024px]:gap-[56px] min-[1024px]:py-[84px]">
        <div className="relative aspect-[19/10] overflow-hidden rounded-[8px]">
          <Image
            src={showroomPhoto.src}
            alt={showroomPhoto.alt}
            fill
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover"
            style={{objectPosition: showroomPhoto.objectPosition}}
          />
        </div>
        <div className="max-w-[520px]">
          <p className="m-0 text-[12px] font-medium tracking-[0.16em] text-[#C2C4C7] uppercase">The Progressive touch</p>
          <h2 className="m-0 mt-[12px] text-[36px] leading-[1.05] font-medium text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[768px]:text-[48px]">
            Your car.
            <br />
            Your signature.
          </h2>
          <p className="m-0 mt-[18px] text-[16px] leading-[1.5] text-[#F8F8F8]">Custom wheels. Exceptional details.</p>
          <p className="m-0 mt-[8px] text-[16px] leading-[1.6] text-[#C2C4C7]">
            Wheels and accessories, fitted to the individual vehicle.
          </p>
          <Link
            href={wheelsLink.href}
            className="mt-[24px] inline-flex min-h-[44px] items-center gap-[8px] text-[15px] font-medium text-[#F8F8F8] no-underline hover:underline"
          >
            {wheelsLink.label}
            <ArrowUpRight aria-hidden className="size-[16px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
