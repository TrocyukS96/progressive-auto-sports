'use client';

import {LayoutGrid, PanelsTopLeft} from 'lucide-react';
import {useEffect, useReducer, useRef} from 'react';
import {cn} from '@/src/shared/lib/cn';
import {CatalogPagination} from '@/src/shared/ui/catalog-pagination';
import {
  PHOTOS_PER_PAGE,
  albumPageCount,
  albumPageStart,
  albumPaginationItems,
  clampAlbumPage,
  createAlbumState,
  mosaicLeadIndexes,
  mosaicTiles,
  reduceAlbumView,
  type AlbumPhoto,
} from '../model/album';
import {AlbumLightbox} from './album-lightbox';
import {AlbumMobileSlider} from './album-mobile-slider';
import {PhotoTile} from './photo-tile';

const viewClass =
  'inline-flex size-[44px] items-center justify-center border bg-transparent p-0 text-[#111315]';

type AlbumExperienceProps = {
  name: string;
  photos: AlbumPhoto[];
};

function countLabel(total: number) {
  return `${total} ${total === 1 ? 'photo' : 'photos'}`;
}

export function AlbumExperience({name, photos}: AlbumExperienceProps) {
  const total = photos.length;
  const [state, dispatch] = useReducer(
    (current: ReturnType<typeof createAlbumState>, action: Parameters<typeof reduceAlbumView>[1]) =>
      reduceAlbumView(current, action, total),
    total,
    createAlbumState,
  );
  const openerRef = useRef<HTMLElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldScroll = useRef(false);
  const pageCount = albumPageCount(total);
  const currentPage = clampAlbumPage(state.page, pageCount);
  const pageStart = albumPageStart(currentPage, total);
  const selected = photos[state.selected] ?? null;
  const visiblePhotos = photos.slice(pageStart, pageStart + PHOTOS_PER_PAGE);
  const tiles = state.mode === 'editorial' ? mosaicTiles(visiblePhotos.length) : [];
  const leadIndexes = mosaicLeadIndexes(tiles);

  useEffect(() => {
    if (!shouldScroll.current) return;
    shouldScroll.current = false;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sectionRef.current?.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'start'});
  }, [state.page]);

  const changePage = (page: number) => {
    if (page === currentPage) return;
    shouldScroll.current = true;
    dispatch({type: 'page', page});
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="album-collection"
        aria-labelledby="album-collection-title"
        className="scroll-mt-[88px] bg-[#F4F3EF] text-[#111315] min-[1024px]:scroll-mt-[100px]"
      >
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
            <div className="hidden items-center gap-[12px] min-[768px]:flex min-[768px]:pb-[6px]">
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

          {total > 0 ? (
            <AlbumMobileSlider
              name={name}
              photos={photos}
              index={state.selected}
              onStep={(delta) => dispatch({type: 'step', delta})}
              onSelect={(photoIndex) => dispatch({type: 'select', index: photoIndex})}
              onOpen={(source, photoIndex) => {
                openerRef.current = source;
                dispatch({type: 'select', index: photoIndex, lightbox: true});
              }}
            />
          ) : null}

          {visiblePhotos.length > 0 ? (
            <div className="mt-[22px] hidden min-[768px]:block">
            <div className={cn(state.mode === 'editorial' ? 'album-mosaic' : 'album-grid')}>
              {visiblePhotos.map((photo, index) => {
                const tile = tiles[index];
                const photoIndex = pageStart + index;
                return (
                  <PhotoTile
                    key={photo.id}
                    photo={photo}
                    sizes={state.mode === 'grid' ? '(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw'}
                    span={tile?.span}
                    aspect={tile?.aspect}
                    lead={leadIndexes.has(index)}
                    onOpen={(source) => {
                      openerRef.current = source;
                      dispatch({type: 'select', index: photoIndex, lightbox: true});
                    }}
                  />
                );
              })}
            </div>
            </div>
          ) : null}

          <div className="hidden min-[768px]:block">
            <CatalogPagination
              label="Photo pages"
              current={currentPage}
              count={pageCount}
              items={albumPaginationItems(currentPage, pageCount)}
              onSelect={changePage}
              className="mt-[28px] justify-end"
            />
          </div>
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
