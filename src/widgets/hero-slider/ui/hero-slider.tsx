'use client';

import Image from 'next/image';
import {useEffect, useRef, type KeyboardEvent} from 'react';
import {Carousel, CarouselContent, CarouselItem, useCarousel} from '@/src/shared/ui/carousel';
import {cn} from '@/src/shared/lib/cn';
import type {HomeSlide} from '@/src/_pages/home/config/content';

const frameClass = 'relative h-[100dvh] w-full';
const heroCarouselOpts = {duration: 50};
const autoplayDelay = 7000;

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
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                draggable={false}
                className="object-cover"
                style={{objectPosition: slide.objectPosition}}
              />
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
    <div className="pointer-events-none absolute inset-x-0 bottom-[8px] flex justify-center">
      <div
        className="pointer-events-auto flex items-center rounded-full bg-[#111315]/55 px-[4px]"
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
              className="inline-flex h-[44px] w-[44px] items-center justify-center border-0 bg-transparent p-0"
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
    </div>
  );
}

function HeroChrome({slides}: {slides: HomeSlide[]}) {
  const {selectedIndex} = useCarousel();
  const slide = slides[selectedIndex];

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-black/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[240px] bg-gradient-to-t from-black/65 to-transparent" />
      <div className="absolute inset-x-0 bottom-[88px] px-[16px] min-[768px]:px-[32px]">
        <div className="mx-auto max-w-[1280px]">
          <div
            key={slide.src}
            className="home-caption inline-flex max-w-[min(100%,440px)] items-stretch overflow-hidden rounded-l-[4px] rounded-r-[16px] border border-white/15 bg-[#111315]/55 backdrop-blur-[12px]"
          >
            <span aria-hidden className="w-[4px] shrink-0 bg-[#ED343B]" />
            <span className="px-[16px] py-[14px] min-[1024px]:px-[20px] min-[1024px]:py-[18px]">
              <span className="block text-[24px] leading-[1.12] text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[1024px]:text-[32px]">
                {slide.title}
              </span>
              <span className="mt-[8px] block text-[14px] leading-[1.45] text-[#C2C4C7] min-[1024px]:text-[15px]">
                {slide.description}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSlider({slides}: {slides: HomeSlide[]}) {
  return (
    <Carousel label="Featured vehicles" opts={heroCarouselOpts}>
      <HeroAutoplay />
      <HeroSlides slides={slides} />
      <HeroChrome slides={slides} />
      <p className="sr-only" aria-live="polite">
        <SlideStatus count={slides.length} />
      </p>
      <HeroControls slides={slides} />
    </Carousel>
  );
}

function SlideStatus({count}: {count: number}) {
  const {selectedIndex} = useCarousel();
  return <>{`Slide ${selectedIndex + 1} of ${count}`}</>;
}
