import Image from 'next/image';
import {wheelsHero} from '../config/content';
import {WheelsExploreLink} from './wheels-explore-link';

export function WheelsHero() {
  return (
    <section className="relative isolate h-[100dvh] w-full overflow-hidden bg-[#111315] text-[#F8F8F8]">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={wheelsHero.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[64%_center]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(17,19,21,0.55)_0%,rgba(17,19,21,0.22)_36%,rgba(17,19,21,0)_62%)]" />
      </div>
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1320px] items-end px-[20px] pt-[112px] pb-[48px] min-[768px]:px-[24px] min-[1024px]:items-center min-[1024px]:px-[48px]">
        <div className="max-w-[500px]">
          <h1 className="m-0 text-[40px] leading-[1.02] font-medium text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[768px]:text-[52px] min-[1024px]:text-[60px]">
            {wheelsHero.title}
          </h1>
          <p className="m-0 mt-[16px] max-w-[36ch] text-[16px] leading-[1.5] text-[#F8F8F8] min-[1024px]:text-[18px]">{wheelsHero.description}</p>
          <div className="mt-[28px]">
            <WheelsExploreLink />
          </div>
        </div>
      </div>
    </section>
  );
}
