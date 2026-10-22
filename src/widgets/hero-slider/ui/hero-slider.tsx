'use client';

import {getImageProps} from 'next/image';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useEffect, useRef, type CSSProperties, type KeyboardEvent} from 'react';
import {Carousel, CarouselContent, CarouselItem, useCarousel} from '@/src/shared/ui/carousel';
import {cn} from '@/src/shared/lib/cn';
import type {HomeSlide} from '@/src/_pages/home/config/content';

const frameClass =
  'home-hero-frame relative h-[100dvh] w-full overflow-hidden bg-[#111315] min-[768px]:aspect-[3/2] min-[768px]:h-auto min-[1024px]:aspect-auto min-[1024px]:h-[100dvh]';
const heroCarouselOpts = {duration: 50};
const autoplayDelay = 7000;
const arrowClass =
  'home-hero-arrow inline-flex size-[44px] items-center justify-center rounded-full border border-white/40 bg-[#111315]/45 p-0 text-[#F8F8F8] backdrop-blur-[8px] focus-visible:shadow-[0_0_0_3px_#CD202B]';

const desktopFrame: Record<string, {width: number; height: number}> = {
  '/images/home/hero-mclaren.jpg': {width: 1170, height: 600},
  '/images/home/hero-range-rover.jpg': {width: 1503, height: 1000},
  '/images/home/hero-viper.jpg': {width: 2000, height: 1331},
};

function HeroAutoplay() {
  const {api} = useCarousel();

  useEffect(() => {
    if (!api) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const section = api.rootNode().closest('section');
    let timer = 0;
    let paused = false;

    const clear = () => window.clearTimeout(timer);
    const schedule = () => {
      clear();
      if (paused || media.matches || document.hidden) return;
      timer = window.setTimeout(() => api.scrollNext(), autoplayDelay);
    };
    const pause = () => {
      paused = true;
      clear();
    };
    const resume = () => {
      paused = false;
      schedule();
    };
    const onFocusOut = (event: FocusEvent) => {
      if (section?.contains(event.relatedTarget as Node | null)) return;
      resume();
    };
    const onMotion = () => (media.matches ? pause() : resume());
    const onVisibility = () => (document.hidden ? pause() : resume());

    schedule();
    api.on('select', schedule);
    section?.addEventListener('mouseenter', pause);
    section?.addEventListener('mouseleave', resume);
    section?.addEventListener('focusin', pause);
    section?.addEventListener('focusout', onFocusOut);
    media.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clear();
      api.off('select', schedule);
      section?.removeEventListener('mouseenter', pause);
      section?.removeEventListener('mouseleave', resume);
      section?.removeEventListener('focusin', pause);
      section?.removeEventListener('focusout', onFocusOut);
      media.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [api]);

  return null;
}

function HeroPhoto({slide, priority}: {slide: HomeSlide; priority: boolean}) {
  const frame = desktopFrame[slide.src] ?? {width: 1600, height: 900};
  const shared = {alt: slide.alt, sizes: '100vw'} as const;
  const {
    props: {srcSet: desktopSrcSet},
  } = getImageProps({...shared, width: frame.width, height: frame.height, src: slide.src});
  const {props: mobile} = getImageProps({...shared, width: 576, height: 1024, src: slide.mobileSrc});

  return (
    <picture className="absolute inset-0 block">
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
      <img
        alt={mobile.alt}
        src={mobile.src}
        srcSet={mobile.srcSet}
        sizes={mobile.sizes}
        width={576}
        height={1024}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
        className="home-hero-photo"
        style={
          {
            '--hero-position': slide.objectPosition,
            '--hero-tablet-position': slide.mobileObjectPosition ?? slide.objectPosition,
            '--hero-portrait-position': slide.portraitPosition ?? 'center center',
          } as CSSProperties
        }
      />
    </picture>
  );
}

function HeroSlides({slides}: {slides: HomeSlide[]}) {
  const {selectedIndex} = useCarousel();

  return (
    <CarouselContent>
      {slides.map((slide, index) => {
        const active = index === selectedIndex;
        return (
          <CarouselItem key={slide.src}>
            <div
              className={frameClass}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              aria-hidden={active ? undefined : true}
              inert={active ? undefined : true}
            >
              <HeroPhoto slide={slide} priority={index === 0} />
            </div>
          </CarouselItem>
        );
      })}
    </CarouselContent>
  );
}

function HeroControls({slides}: {slides: HomeSlide[]}) {
  const {api, selectedIndex, scrollTo} = useCarousel();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      api?.scrollNext();
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      api?.scrollPrev();
    }
    if (event.key === 'Home') {
      event.preventDefault();
      scrollTo(0);
      buttons.current[0]?.focus();
    }
    if (event.key === 'End') {
      event.preventDefault();
      const last = slides.length - 1;
      scrollTo(last);
      buttons.current[last]?.focus();
    }
  };

  return (
    <div className="home-hero-controls">
      {slides.length > 1 ? (
        <button type="button" className={arrowClass} aria-label="Previous slide" onClick={() => api?.scrollPrev()}>
          <ChevronLeft aria-hidden className="size-[18px]" />
        </button>
      ) : (
        <span className="home-hero-arrow" aria-hidden />
      )}
      <div
        className="home-hero-dots flex items-center rounded-full px-[4px]"
        role="group"
        aria-label="Choose a slide"
        onKeyDown={onKeyDown}
      >
        {slides.map((slide, index) => {
          const selected = index === selectedIndex;
          return (
            <button
              key={slide.src}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              type="button"
              className="inline-flex h-[44px] w-[44px] items-center justify-center border-0 bg-transparent p-0 focus-visible:shadow-[0_0_0_3px_#CD202B]"
              aria-label={`Show slide ${index + 1} of ${slides.length}: ${slide.alt}`}
              aria-pressed={selected}
              aria-current={selected ? 'true' : undefined}
              onClick={() => scrollTo(index)}
            >
              <span
                className={cn(
                  'block rounded-full transition-[width,height,background-color] duration-[400ms] motion-reduce:transition-none',
                  selected ? 'h-[6px] w-[22px] bg-[#ED343B]' : 'h-[7px] w-[7px] bg-white/70',
                )}
              />
            </button>
          );
        })}
      </div>
      {slides.length > 1 ? (
        <button type="button" className={arrowClass} aria-label="Next slide" onClick={() => api?.scrollNext()}>
          <ChevronRight aria-hidden className="size-[18px]" />
        </button>
      ) : (
        <span className="home-hero-arrow" aria-hidden />
      )}
    </div>
  );
}

function HeroChrome({slides}: {slides: HomeSlide[]}) {
  const {selectedIndex} = useCarousel();
  const slide = slides[selectedIndex];

  return (
    <div className="home-hero-caption">
      <div className="mx-auto max-w-[1280px]">
        <div
          key={slide.src}
          className="home-caption inline-flex w-full max-w-[min(100%,340px)] items-stretch overflow-hidden rounded-l-[4px] rounded-r-[16px] border border-white/15 bg-[#111315]/78 backdrop-blur-[12px] min-[768px]:max-w-[min(100%,440px)] min-[768px]:bg-[#1A1C20] min-[768px]:backdrop-blur-none min-[1024px]:bg-[#111315]/55 min-[1024px]:backdrop-blur-[12px]"
        >
          <span aria-hidden className="block w-[4px] shrink-0 bg-[#ED343B]" />
          <span className="block px-[14px] py-[12px] min-[1024px]:px-[20px] min-[1024px]:py-[18px]">
            <span className="block text-[26px] leading-[1.12] text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[360px]:text-[28px] min-[768px]:text-[32px] min-[768px]:leading-[1.15] min-[1024px]:text-[60px] min-[1024px]:leading-[1.12]">
              {slide.title.endsWith('.') ? slide.title.slice(0, -1) : slide.title}
              {slide.title.endsWith('.') ? <span className="text-[#ED343B]">.</span> : null}
            </span>
            <span className="mt-[6px] block text-[14px] leading-[1.4] text-[#C2C4C7] min-[1024px]:mt-[8px] min-[1024px]:text-[15px]">
              {slide.description}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export function HeroSlider({slides}: {slides: HomeSlide[]}) {
  return (
    <Carousel
      label="Featured vehicles"
      opts={heroCarouselOpts}
      className="flex flex-col bg-[#111315] min-[768px]:pt-[96px] min-[1024px]:block min-[1024px]:pt-0"
    >
      <HeroAutoplay />
      <div className="relative order-1">
        <HeroSlides slides={slides} />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-[140px] bg-gradient-to-b from-black/50 to-transparent min-[768px]:h-[72px] min-[768px]:from-black/35 min-[1024px]:h-[120px] min-[1024px]:from-black/45" />
          <div className="home-hero-bottom-shade absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 to-transparent min-[1024px]:from-black/65" />
        </div>
      </div>
      <HeroChrome slides={slides} />
      <HeroControls slides={slides} />
      <p className="sr-only" aria-live="polite">
        <SlideStatus count={slides.length} />
      </p>
    </Carousel>
  );
}

function SlideStatus({count}: {count: number}) {
  const {selectedIndex} = useCarousel();
  return <>{`Slide ${selectedIndex + 1} of ${count}`}</>;
}
