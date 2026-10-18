'use client';

import useEmblaCarousel from 'embla-carousel-react';
import {createContext, useCallback, useContext, useEffect, useState, type ReactNode} from 'react';
import {cn} from '@/src/shared/lib/cn';

type EmblaApi = NonNullable<ReturnType<typeof useEmblaCarousel>[1]>;
type EmblaOptions = NonNullable<Parameters<typeof useEmblaCarousel>[0]>;

type CarouselContextValue = {
  viewportRef: ReturnType<typeof useEmblaCarousel>[0];
  api: EmblaApi | undefined;
  selectedIndex: number;
  scrollTo: (index: number) => void;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarousel() {
  const value = useContext(CarouselContext);
  if (!value) {
    throw new Error('useCarousel must be used within Carousel');
  }
  return value;
}

type CarouselProps = {
  opts?: EmblaOptions;
  className?: string;
  children: ReactNode;
  label: string;
};

export function Carousel({opts, className, children, label}: CarouselProps) {
  const [viewportRef, api] = useEmblaCarousel({align: 'start', loop: true, duration: 25, ...opts});
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      api.reInit({align: 'start', loop: true, ...opts, duration: media.matches ? 0 : (opts?.duration ?? 25)});
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [api, opts]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  return (
    <CarouselContext.Provider value={{viewportRef, api, selectedIndex, scrollTo}}>
      <section className={cn('relative', className)} aria-roledescription="carousel" aria-label={label}>
        {children}
      </section>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({className, children}: {className?: string; children: ReactNode}) {
  const {viewportRef} = useCarousel();
  return (
    <div ref={viewportRef} className="overflow-hidden">
      <div className={cn('flex', className)}>{children}</div>
    </div>
  );
}

export function CarouselItem({className, children}: {className?: string; children: ReactNode}) {
  return <div className={cn('min-w-0 shrink-0 grow-0 basis-full', className)}>{children}</div>;
}
