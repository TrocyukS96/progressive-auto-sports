import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {Button} from '@/src/shared/ui/button';
import {inventoryLink} from '../config/content';

export function HomeIntro() {
  return (
    <section className="bg-[#111315] text-[#F8F8F8]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-[28px] px-[16px] py-[56px] min-[768px]:px-[32px] min-[768px]:py-[64px] min-[1024px]:flex-row min-[1024px]:items-end min-[1024px]:justify-between min-[1024px]:py-[76px]">
        <div className="max-w-[760px]">
          <p className="m-0 text-[12px] font-medium tracking-[0.16em] text-[#C2C4C7] uppercase">
            Exceptional cars. Individual character.
          </p>
          <h1 className="m-0 mt-[12px] max-w-[12ch] text-[38px] leading-[1.05] font-medium text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[768px]:text-[56px] min-[1024px]:text-[60px]">
            Beyond the ordinary.
          </h1>
        </div>
        <div className="flex flex-col items-start gap-[16px] min-[1024px]:items-end min-[1024px]:pb-[6px]">
          <p className="m-0 text-[16px] leading-[1.5] text-[#F8F8F8]">Discover your next car.</p>
          <Button variant="accent" asChild>
            <Link href={inventoryLink.href}>
              {inventoryLink.label}
              <ArrowUpRight aria-hidden className="size-[16px]" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
