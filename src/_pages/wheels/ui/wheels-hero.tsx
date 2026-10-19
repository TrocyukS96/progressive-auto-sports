import Image from 'next/image';
import Link from 'next/link';
import {wheelsHero} from '../config/content';
import {WheelsExploreLink} from './wheels-explore-link';

export function WheelsHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#111315] text-[#F8F8F8] min-[768px]:min-h-[560px]">
      <div className="relative aspect-[4/3] min-[768px]:absolute min-[768px]:inset-0 min-[768px]:aspect-auto" aria-hidden>
        <Image
          src={wheelsHero.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_center] min-[768px]:object-[right_center]"
        />
        <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#111315_0%,#111315_34%,rgba(17,19,21,0.94)_48%,rgba(17,19,21,0.55)_62%,rgba(17,19,21,0)_78%)] min-[768px]:block" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-[1320px] items-center px-[20px] py-[36px] min-[768px]:min-h-[560px] min-[768px]:px-[24px] min-[768px]:py-[72px] min-[1024px]:px-[48px]">
        <div className="max-w-[500px]">
          <nav aria-label="Breadcrumb">
            <ol className="m-0 flex list-none flex-wrap items-center gap-[8px] p-0 text-[14px] text-[#C2C4C7]">
              <li>
                <Link href="/" className="text-[#C2C4C7] no-underline hover:text-[#F8F8F8]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-[#F8F8F8]">
                Wheels
              </li>
            </ol>
          </nav>
          <p className="m-0 mt-[22px] text-[12px] font-medium tracking-[0.18em] text-[#C2C4C7] uppercase">{wheelsHero.eyebrow}</p>
          <h1 className="m-0 mt-[12px] text-[40px] leading-[1.02] font-medium text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[768px]:text-[52px] min-[1024px]:text-[60px]">
            {wheelsHero.title}
          </h1>
          <p className="m-0 mt-[16px] max-w-[36ch] text-[16px] leading-[1.5] text-[#C2C4C7] min-[1024px]:text-[18px]">{wheelsHero.description}</p>
          <div className="mt-[28px]">
            <WheelsExploreLink />
          </div>
        </div>
      </div>
    </section>
  );
}
