import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {Button} from '@/src/shared/ui/button';

export function FitmentCallout() {
  return (
    <section className="grid bg-[#111315] text-[#F8F8F8] min-[1024px]:grid-cols-[1.35fr_1fr]">
      <div className="relative min-h-[240px] aspect-[16/10] min-[1024px]:aspect-auto min-[1024px]:min-h-[380px]">
        <Image src="/images/wheel-details/fitment-neutral.png" alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover object-[center_60%]" />
      </div>
      <div className="flex items-center px-[20px] py-[40px] min-[768px]:px-[24px] min-[1024px]:px-[48px] min-[1024px]:py-[56px]">
        <div className="max-w-[460px]">
          <p className="m-0 text-[12px] font-medium tracking-[0.18em] text-[#C2C4C7] uppercase">The Progressive touch</p>
          <h2 className="m-0 mt-[12px] text-[32px] leading-[1.05] font-medium text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[768px]:text-[44px]">
            Your car. Your setup.
          </h2>
          <p className="m-0 mt-[16px] text-[16px] leading-[1.5] text-[#C2C4C7] min-[1024px]:text-[18px]">Let’s find the right wheels for your car.</p>
          <div className="mt-[24px]">
            <Button variant="accent" asChild className="wheel-brand-accent h-[48px] px-[22px] text-[16px]">
              <Link href="/contact/">
                Ask about fitment
                <ArrowUpRight aria-hidden className="size-[16px]" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
