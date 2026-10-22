'use client';

import Image from 'next/image';
import {ChevronLeft, ChevronRight, Expand} from 'lucide-react';
import {useEffect, useRef, useState, type PointerEvent as ReactPointerEvent} from 'react';
import {formatPhotoNumber, stepIndex, type AlbumPhoto} from '../model/album';

type AlbumMobileSliderProps = {
  name: string;
  photos: AlbumPhoto[];
  index: number;
  onStep: (delta: number) => void;
  onSelect: (index: number) => void;
  onOpen: (source: HTMLButtonElement, index: number) => void;
};

type Motion = {
  shift: number;
  animate: boolean;
  pending: -1 | 1 | null;
};

const navButton =
  'inline-flex size-[44px] shrink-0 items-center justify-center rounded-full border border-[#C8C6C1] bg-transparent p-0 text-[#111315] disabled:opacity-40';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function AlbumMobileSlider({name, photos, index, onStep, onSelect, onOpen}: AlbumMobileSliderProps) {
  const total = photos.length;
  const frameRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const dragOrigin = useRef<{x: number; y: number} | null>(null);
  const axis = useRef<'x' | 'y' | null>(null);
  const [width, setWidth] = useState(0);
  const [motion, setMotion] = useState<Motion>({shift: 0, animate: false, pending: null});
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const photo = photos[index];

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const update = () => setWidth(node.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = thumbsRef.current;
    if (!container) return;
    const button = container.querySelector<HTMLButtonElement>('[aria-current="true"]');
    if (!button) return;
    const left = button.offsetLeft - (container.clientWidth - button.offsetWidth) / 2;
    container.scrollTo({left: Math.max(0, left), behavior: prefersReducedMotion() ? 'auto' : 'smooth'});
  }, [index]);

  if (!photo) return null;

  const previous = photos[stepIndex(index, -1, total)] ?? photo;
  const upcoming = photos[stepIndex(index, 1, total)] ?? photo;
  const frames = [
    {slot: 'previous', photo: previous},
    {slot: 'current', photo},
    {slot: 'next', photo: upcoming},
  ] as const;

  const commit = (delta: -1 | 1, fromShift: number) => {
    if (total < 2 || width <= 0 || motion.pending) return;
    const target = delta === 1 ? -width : width;
    if (prefersReducedMotion() || Math.abs(target - fromShift) < 1) {
      onStep(delta);
      setMotion({shift: 0, animate: false, pending: null});
      return;
    }
    setMotion({shift: target, animate: true, pending: delta});
  };

  const onTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform' || !motion.pending) return;
    onStep(motion.pending);
    setMotion({shift: 0, animate: false, pending: null});
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (motion.pending || total < 2) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragOrigin.current = {x: event.clientX, y: event.clientY};
    axis.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const origin = dragOrigin.current;
    if (!origin) return;
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    if (!axis.current) {
      if (Math.hypot(dx, dy) < 8) return;
      axis.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (axis.current === 'y') {
        dragOrigin.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        return;
      }
    }
    if (axis.current !== 'x') return;
    setMotion({shift: dx, animate: false, pending: null});
  };

  const endDrag = (clientX: number) => {
    const origin = dragOrigin.current;
    dragOrigin.current = null;
    axis.current = null;
    if (!origin) return;
    const dx = clientX - origin.x;
    if (Math.abs(dx) < 48) {
      setMotion({shift: 0, animate: !prefersReducedMotion(), pending: null});
      return;
    }
    commit(dx < 0 ? 1 : -1, dx);
  };

  return (
    <div className="mt-[22px] min-w-0 min-[768px]:hidden" role="region" aria-roledescription="carousel" aria-label={`${name} photographs`}>
      <div className="rounded-[16px] bg-[#1A1C1F] p-[8px]">
        <div ref={frameRef} className="relative aspect-[16/10] touch-pan-y overflow-hidden rounded-[10px] bg-[#111315]">
          {width > 0 ? (
            <div
              className="flex h-full"
              style={{
                width: width * 3,
                transform: `translate3d(${-width + motion.shift}px, 0, 0)`,
                transition: motion.animate ? 'transform 420ms ease' : 'none',
              }}
              onTransitionEnd={onTransitionEnd}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={(event) => endDrag(event.clientX)}
              onPointerCancel={() => {
                dragOrigin.current = null;
                axis.current = null;
                setMotion({shift: 0, animate: false, pending: null});
              }}
            >
              {frames.map((frame) => (
                <div key={`${frame.slot}-${frame.photo.id}`} className="relative h-full shrink-0" style={{width}}>
                  {failed[frame.photo.id] ? (
                    <div className="flex h-full items-center justify-center px-[16px] text-center text-[14px] text-[#F8F8F8]">
                      This photograph could not be loaded.
                    </div>
                  ) : (
                    <Image
                      src={frame.photo.src}
                      alt={frame.slot === 'current' ? frame.photo.alt : ''}
                      fill
                      sizes="100vw"
                      draggable={false}
                      className="object-cover object-center"
                      onError={() => setFailed((current) => ({...current, [frame.photo.id]: true}))}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-cover object-center" draggable={false} />
          )}
          <button
            type="button"
            className="absolute right-[10px] bottom-[10px] z-[1] inline-flex size-[44px] items-center justify-center rounded-full border border-white/25 bg-[#111315]/80 p-0 text-[#F8F8F8]"
            aria-label={`Expand ${photo.alt}`}
            onClick={(event) => onOpen(event.currentTarget, index)}
          >
            <Expand aria-hidden className="size-[16px]" />
          </button>
        </div>
      </div>

      <div ref={thumbsRef} className="album-thumbs mt-[12px] flex gap-[8px] overflow-x-auto px-[2px] py-[2px]">
        {photos.map((item, photoIndex) => {
          const current = photoIndex === index;
          return (
            <button
              key={item.id}
              type="button"
              className={`relative h-[52px] w-[72px] shrink-0 overflow-hidden rounded-[8px] border-2 bg-[#E7E4DE] p-0 ${current ? 'border-[#ED343B]' : 'border-transparent'}`}
              aria-label={`Show photograph ${photoIndex + 1} of ${total}`}
              aria-current={current ? 'true' : undefined}
              onClick={() => onSelect(photoIndex)}
            >
              <Image src={item.src} alt="" fill sizes="72px" className="object-cover object-center" draggable={false} />
            </button>
          );
        })}
      </div>

      <div className="mt-[18px] flex items-center justify-between gap-[12px]">
        <button type="button" className={navButton} aria-label="Previous photograph" disabled={total < 2} onClick={() => commit(-1, motion.shift)}>
          <ChevronLeft aria-hidden className="size-[18px]" />
        </button>
        <p className="m-0 flex items-baseline gap-[6px] tabular-nums" aria-live="polite">
          <span className="sr-only">{`Photograph ${index + 1} of ${total}`}</span>
          <span aria-hidden className="text-[30px] leading-none font-semibold tracking-[-0.04em] text-[#111315] [font-family:var(--font-display),sans-serif]">
            {formatPhotoNumber(index)}
          </span>
          <span aria-hidden className="text-[16px] font-medium text-[#55595E]">
            / {total}
          </span>
        </p>
        <button type="button" className={navButton} aria-label="Next photograph" disabled={total < 2} onClick={() => commit(1, motion.shift)}>
          <ChevronRight aria-hidden className="size-[18px]" />
        </button>
      </div>
      {total > 1 ? <p className="m-0 mt-[10px] text-center text-[13px] text-[#55595E]">Swipe to explore</p> : null}
    </div>
  );
}
