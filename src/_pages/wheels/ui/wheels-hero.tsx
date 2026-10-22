import {getImageProps} from 'next/image';
import {wheelsHero} from '../config/content';
import {WheelsExploreLink} from './wheels-explore-link';

function WheelsHeroMedia() {
  const shared = {alt: '', sizes: '100vw'} as const;
  const {
    props: {srcSet: desktopSrcSet},
  } = getImageProps({
    ...shared,
    width: wheelsHero.imageWidth,
    height: wheelsHero.imageHeight,
    src: wheelsHero.image,
  });
  const {props: mobile} = getImageProps({
    ...shared,
    width: wheelsHero.mobileImageWidth,
    height: wheelsHero.mobileImageHeight,
    src: wheelsHero.mobileImage,
  });

  return (
    <div className="absolute inset-0 bg-[#111315]" aria-hidden>
      <picture className="absolute inset-0 block">
        <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
        <img
          alt=""
          src={mobile.src}
          srcSet={mobile.srcSet}
          sizes="100vw"
          width={wheelsHero.mobileImageWidth}
          height={wheelsHero.mobileImageHeight}
          fetchPriority="high"
          decoding="async"
          className="block h-full w-full object-cover object-center min-[768px]:object-[64%_center]"
        />
      </picture>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(17,19,21,0.62)_0%,rgba(17,19,21,0.22)_42%,rgba(17,19,21,0)_68%)] min-[768px]:hidden" />
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(17,19,21,0.55)_0%,rgba(17,19,21,0.22)_36%,rgba(17,19,21,0)_62%)] min-[768px]:block" />
    </div>
  );
}

export function WheelsHero() {
  return (
    <section className="relative isolate h-[100dvh] w-full overflow-hidden bg-[#111315] text-[#F8F8F8]">
      <WheelsHeroMedia />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1320px] flex-col px-[20px] pt-[108px] pb-[36px] min-[768px]:items-end min-[768px]:px-[24px] min-[768px]:pt-[112px] min-[768px]:pb-[48px] min-[1024px]:items-center min-[1024px]:px-[48px]">
        <div className="max-w-[500px]">
          <h1 className="m-0 text-[32px] leading-[1.15] font-medium text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[768px]:text-[52px] min-[768px]:leading-[1.02] min-[1024px]:text-[60px]">
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
