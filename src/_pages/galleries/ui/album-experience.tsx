'use client';

import Image from 'next/image';
import {ChevronDown, ChevronLeft, ChevronRight, Expand, LayoutGrid, PanelsTopLeft} from 'lucide-react';
import {useEffect, useReducer, useRef, useState, type KeyboardEvent, type PointerEvent} from 'react';
import {Button} from '@/src/shared/ui/button';
import {cn} from '@/src/shared/lib/cn';
import {
  createAlbumState,
  formatPhotoNumber,
  mosaicTiles,
  reduceAlbumView,
  type AlbumPhoto,
} from '../model/album';
import {AlbumLightbox} from './album-lightbox';
import {PhotoTile} from './photo-tile';

const arrowClass =
  'inline-flex size-[44px] items-center justify-center rounded-full border border-white/55 bg-[#111315]/45 p-0 text-[#F8F8F8]';

const viewClass =
  'inline-flex size-[44px] items-center justify-center border bg-transparent p-0 text-[#111315]';

type AlbumExperienceProps = {
  name: string;
  photos: AlbumPhoto[];
};

function countLabel(total: number) {
  return `${total} ${total === 1 ? 'photo' : 'photos'}`;
}

function ViewerPhoto({photo, priority}: {photo: AlbumPhoto; priority: boolean}) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="m-0 max-w-[24rem] text-[15px] text-[#F8F8F8]">This photograph could not be loaded.</p>
        <button
          type="button"
          className="inline-flex h-[44px] items-center rounded-full border border-[#F8F8F8] px-4 text-[14px] font-medium text-[#F8F8F8]"
          onClick={() => {
            setFailed(false);
            setAttempt((value) => value + 1);
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <Image
      key={attempt}
      src={photo.src}
      alt={photo.alt}
      fill
      priority={priority}
      sizes="100vw"
      className="object-contain object-center"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

export function AlbumExperience({name, photos}: AlbumExperienceProps) {
  const total = photos.length;
  const [state, dispatch] = useReducer(
    (current: ReturnType<typeof createAlbumState>, action: Parameters<typeof reduceAlbumView>[1]) =>
      reduceAlbumView(current, action, total),
    total,
    createAlbumState,
  );
  const stripRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const swipe = useRef<{x: number; y: number} | null>(null);
  const selected = photos[state.selected] ?? null;
  const visiblePhotos = photos.slice(0, state.visible);
  const tiles = state.mode === 'editorial' ? mosaicTiles(visiblePhotos.length) : [];
  const neighbors = selected ? [photos[state.selected - 1], photos[state.selected + 1]].filter((item): item is AlbumPhoto => Boolean(item)) : [];

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLButtonElement>('[aria-current="true"]');
    if (!active) return;
    const stripBox = strip.getBoundingClientRect();
    const box = active.getBoundingClientRect();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (box.left < stripBox.left || box.right > stripBox.right) {
      const delta = box.left - stripBox.left;
      strip.scrollTo({
        left: strip.scrollLeft + delta - (strip.clientWidth - active.clientWidth) / 2,
        behavior: reduce ? 'auto' : 'smooth',
      });
    }
    if (strip.contains(document.activeElement) && document.activeElement !== active) {
      active.focus({preventScroll: true});
    }
  }, [state.selected]);

  const onViewerKey = (event: KeyboardEvent<HTMLElement>) => {
    if (state.lightbox) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    dispatch({type: 'step', delta: event.key === 'ArrowRight' ? 1 : -1});
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    swipe.current = {x: event.clientX, y: event.clientY};
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!swipe.current || total < 2) return;
    const dx = event.clientX - swipe.current.x;
    const dy = event.clientY - swipe.current.y;
    swipe.current = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    dispatch({type: 'step', delta: dx < 0 ? 1 : -1});
  };

  return (
    <>
      {total === 0 || !selected ? (
        <div className="flex aspect-[4/3] items-center bg-[#111315] px-[20px] min-[768px]:aspect-[8/3] min-[768px]:px-[40px]">
          <p className="m-0 max-w-[28rem] text-[18px] leading-[1.4] text-[#F8F8F8]">This album does not have any photographs yet.</p>
        </div>
      ) : (
        <div onKeyDown={onViewerKey}>
          <div
            className="relative aspect-[4/3] touch-pan-y bg-[#111315] min-[768px]:aspect-[2/1] min-[960px]:aspect-[8/3]"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              swipe.current = null;
            }}
          >
            <div key={selected.id} className="album-photo-in absolute inset-0">
              <ViewerPhoto photo={selected} priority={state.selected === 0} />
            </div>
            {total > 1 ? (
              <>
                <button type="button" className={cn(arrowClass, 'absolute top-1/2 left-[8px] -translate-y-1/2 min-[768px]:left-[16px]')} aria-label="Previous photograph" onClick={() => dispatch({type: 'step', delta: -1})}>
                  <ChevronLeft aria-hidden className="size-[18px]" />
                </button>
                <button type="button" className={cn(arrowClass, 'absolute top-1/2 right-[8px] -translate-y-1/2 min-[768px]:right-[16px]')} aria-label="Next photograph" onClick={() => dispatch({type: 'step', delta: 1})}>
                  <ChevronRight aria-hidden className="size-[18px]" />
                </button>
              </>
            ) : null}
            <p className="absolute bottom-[16px] left-[16px] m-0 max-w-[calc(100%-80px)] truncate bg-[#111315]/80 px-[8px] py-[6px] text-[11px] font-medium tracking-[0.16em] text-[#F8F8F8] uppercase min-[768px]:left-[24px]" aria-hidden>
              {name} / Photo {formatPhotoNumber(state.selected)}
            </p>
            <button
              type="button"
              className={cn(arrowClass, 'absolute right-[12px] bottom-[12px] min-[768px]:right-[20px]')}
              aria-label="Expand photograph"
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                dispatch({type: 'lightbox', open: true});
              }}
            >
              <Expand aria-hidden className="size-[16px]" />
            </button>
            <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" aria-hidden>
              {neighbors.map((photo) => (
                <Image key={photo.id} src={photo.src} alt="" width={photo.width} height={photo.height} sizes="100vw" />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-[8px] bg-[#111315] py-[10px] pr-[8px] pl-[12px] min-[768px]:pr-[16px] min-[768px]:pl-[24px] min-[960px]:pl-[40px]">
            <div ref={stripRef} className="album-filmstrip min-w-0 flex-1 overflow-x-auto overflow-y-hidden">
              <div className="flex w-max gap-[8px] py-[2px]">
                {photos.map((photo, index) => {
                  const active = index === state.selected;
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      className="relative h-[68px] w-[118px] shrink-0 bg-[#1C1E21] p-0"
                      aria-label={`Photograph ${index + 1}`}
                      aria-current={active ? 'true' : undefined}
                      tabIndex={active ? 0 : -1}
                      onClick={() => dispatch({type: 'select', index})}
                    >
                      <span
                        className={cn(
                          'absolute inset-0 overflow-hidden',
                          active ? 'shadow-[inset_0_0_0_2px_#ED343B]' : 'shadow-[inset_0_0_0_2px_transparent]',
                        )}
                      >
                        <Image src={photo.src} alt="" fill sizes="128px" className="object-cover object-center" draggable={false} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <p
              className="m-0 shrink-0 text-[13px] font-medium text-[#F8F8F8] tabular-nums"
              aria-live={state.lightbox ? undefined : 'polite'}
            >
              <span className="sr-only">{`Photograph ${state.selected + 1} of ${total}`}</span>
              <span aria-hidden>
                {formatPhotoNumber(state.selected)} / {total}
              </span>
            </p>
            {total > 1 ? (
              <div className="flex shrink-0">
                <button type="button" className={arrowClass} aria-label="Previous photograph" onClick={() => dispatch({type: 'step', delta: -1})}>
                  <ChevronLeft aria-hidden className="size-[16px]" />
                </button>
                <button type="button" className={cn(arrowClass, 'ml-[4px]')} aria-label="Next photograph" onClick={() => dispatch({type: 'step', delta: 1})}>
                  <ChevronRight aria-hidden className="size-[16px]" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <section aria-labelledby="album-collection-title" className="bg-[#F4F3EF] text-[#111315]">
        <div className="mx-auto max-w-[1320px] px-[20px] pt-[28px] pb-[36px] min-[768px]:px-[32px] min-[960px]:px-[40px] min-[960px]:pt-[32px]">
          <div className="flex flex-col gap-[16px] min-[768px]:flex-row min-[768px]:items-end min-[768px]:justify-between">
            <div className="min-w-0">
              <p className="m-0 text-[11px] font-medium tracking-[0.22em] text-[#55595E] uppercase">The collection</p>
              <h2 id="album-collection-title" className="m-0 mt-[10px] text-[34px] leading-[0.95] font-semibold tracking-[-0.03em] text-[#111315] min-[768px]:text-[40px]">
                Every angle.
                <br />
                Pure {name}
                <span className="text-[#ED343B]">.</span>
              </h2>
            </div>
            <div className="flex items-center gap-[12px] min-[768px]:pb-[6px]">
              <p className="m-0 text-[14px] font-medium text-[#55595E] tabular-nums">{countLabel(total)}</p>
              {total > 0 ? (
                <div role="group" aria-label="Collection layout" className="flex">
                  <button
                    type="button"
                    className={cn(viewClass, state.mode === 'editorial' ? 'border-[#ED343B]' : 'border-[#C8C6C1]')}
                    aria-pressed={state.mode === 'editorial'}
                    aria-label="Editorial layout"
                    onClick={() => dispatch({type: 'mode', mode: 'editorial'})}
                  >
                    <PanelsTopLeft aria-hidden className="size-[16px]" />
                  </button>
                  <button
                    type="button"
                    className={cn(viewClass, 'ml-[6px]', state.mode === 'grid' ? 'border-[#ED343B]' : 'border-[#C8C6C1]')}
                    aria-pressed={state.mode === 'grid'}
                    aria-label="Grid layout"
                    onClick={() => dispatch({type: 'mode', mode: 'grid'})}
                  >
                    <LayoutGrid aria-hidden className="size-[16px]" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {visiblePhotos.length > 0 ? (
            <div className={cn('mt-[22px]', state.mode === 'editorial' ? 'album-mosaic' : 'album-grid')}>
              {visiblePhotos.map((photo, index) => {
                const tile = tiles[index];
                return (
                  <PhotoTile
                    key={photo.id}
                    photo={photo}
                    sizes={state.mode === 'grid' ? '(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw'}
                    span={tile?.span}
                    aspect={tile?.aspect}
                    onOpen={(source) => {
                      openerRef.current = source;
                      dispatch({type: 'select', index, lightbox: true});
                    }}
                  />
                );
              })}
            </div>
          ) : null}

          {state.visible < total ? (
            <div className="mt-[28px] flex justify-center">
              <Button
                variant="outline"
                className="h-[44px] border-[#111315] bg-transparent px-[18px] text-[14px] text-[#111315] hover:border-[#111315] hover:bg-[#111315] hover:text-[#F8F8F8]"
                onClick={() => dispatch({type: 'reveal'})}
              >
                Load more photos
                <ChevronDown aria-hidden className="size-[16px]" />
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      {state.lightbox && selected ? (
        <AlbumLightbox
          photos={photos}
          index={state.selected}
          name={name}
          onStep={(delta) => dispatch({type: 'step', delta})}
          onClose={() => dispatch({type: 'lightbox', open: false})}
          returnFocus={openerRef.current}
        />
      ) : null}
    </>
  );
}
