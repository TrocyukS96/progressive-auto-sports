'use client';

import {Search, X} from 'lucide-react';
import {useId, useState} from 'react';
import {Button} from '@/src/shared/ui/button';
import {CatalogPagination} from '@/src/shared/ui/catalog-pagination';
import {catalogView, type GalleryAlbum, type GalleryPage} from '../model/catalog';
import {AlbumCard} from './album-card';

type AlbumCatalogProps = {
  albums: GalleryAlbum[];
  pageAlbums: GalleryAlbum[];
  pages: GalleryPage[];
  page: number;
  featuredSlug: string | null;
};

const prominentSizes = '(min-width: 960px) 58vw, 100vw';
const stackSizes = '(min-width: 960px) 34vw, (min-width: 768px) 50vw, 100vw';
const bottomSizes = '(min-width: 960px) 30vw, (min-width: 768px) 50vw, 100vw';

const lightButton =
  'h-[44px] border-[#111315] bg-transparent px-[18px] text-[14px] text-[#111315] hover:border-[#111315] hover:bg-[#111315] hover:text-[#F8F8F8]';

export function AlbumCatalog({albums, pageAlbums, pages, page, featuredSlug}: AlbumCatalogProps) {
  const searchId = useId();
  const [query, setQuery] = useState('');
  const [marque, setMarque] = useState<string | null>(null);

  const view = catalogView({
    all: albums,
    pageAlbums,
    query,
    marque,
    featuredSlug,
    page,
  });
  const visibleCount =
    view.mode === 'editorial'
      ? [view.layout.prominent, ...view.layout.stack, ...view.layout.bottom].filter(Boolean).length + view.rest.length
      : view.rest.length;
  const filtering = query.trim().length > 0 || marque !== null;

  const reset = () => {
    setQuery('');
    setMarque(null);
  };

  return (
    <section
      id="gallery-albums"
      aria-labelledby="gallery-albums-title"
      className="scroll-mt-[120px] bg-[#F4F3EF] text-[#111315] min-[1024px]:scroll-mt-[132px]"
    >
      <div className="mx-auto max-w-[1320px] px-[20px] pt-[28px] pb-[40px] min-[768px]:px-[32px] min-[960px]:px-[50px] min-[960px]:pt-[32px] min-[960px]:pb-[48px]">
        <div className="flex flex-col gap-[20px] min-[960px]:flex-row min-[960px]:items-end min-[960px]:justify-between">
          <div className="min-w-0">
            <p className="m-0 text-[11px] font-medium tracking-[0.22em] text-[#55595E] uppercase">Find your inspiration</p>
            <h2
              id="gallery-albums-title"
              className="m-0 mt-[10px] text-[32px] leading-[0.98] font-semibold tracking-[-0.03em] text-[#111315] [font-family:var(--font-display),sans-serif] min-[768px]:text-[40px]"
            >
              Every marque.
              <br />
              A different perspective.
            </h2>
          </div>
          <form
            role="search"
            className="w-full min-[960px]:w-[220px] min-[960px]:shrink-0"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor={searchId} className="sr-only">
              Search marques
            </label>
            <div className="relative">
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-[14px] size-[16px] -translate-y-1/2 text-[#55595E]" />
              <input
                id={searchId}
                type="search"
                value={query}
                placeholder="Search marques"
                autoComplete="off"
                onChange={(event) => setQuery(event.target.value)}
                className="h-[44px] w-full rounded-full border border-[#DEDED9] bg-transparent pr-[44px] pl-[38px] text-[14px] text-[#111315] outline-none placeholder:text-[#55595E]"
              />
              {query.length > 0 ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery('')}
                  className="absolute top-1/2 right-0 inline-flex size-[44px] -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#111315]"
                >
                  <X aria-hidden className="size-[16px]" />
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="mt-[22px] max-w-full overflow-x-auto overscroll-x-contain min-[960px]:overflow-visible">
          <div className="flex w-max min-w-full gap-[22px] min-[960px]:w-auto min-[960px]:flex-wrap min-[960px]:gap-x-[32px] min-[960px]:gap-y-[4px]" role="toolbar" aria-label="Filter by marque">
            <FilterTab pressed={marque === null} onClick={() => setMarque(null)}>
              All marques
            </FilterTab>
            {albums.map((album) => (
              <FilterTab key={album.href} pressed={marque === album.slug} onClick={() => setMarque(album.slug)}>
                {album.name}
              </FilterTab>
            ))}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {visibleCount === 0 ? 'No albums found' : `${visibleCount} ${visibleCount === 1 ? 'album' : 'albums'}`}
        </p>

        {visibleCount === 0 ? (
          <div className="mt-[28px] border border-[#DEDED9] bg-white px-[24px] py-[40px] text-center">
            <p className="m-0 text-[18px] leading-[1.4] font-medium text-[#111315]">No albums found</p>
            <div className="mt-[16px]">
              <Button type="button" className={lightButton} onClick={reset}>
                Reset filters
              </Button>
            </div>
          </div>
        ) : (
          <div id="gallery-album-grid" className="mt-[22px]">
            {view.mode === 'editorial' ? (
              <>
                <div className="grid grid-cols-1 gap-[8px] min-[768px]:grid-cols-2 min-[960px]:grid-cols-[minmax(0,15fr)_minmax(0,9fr)]">
                  {view.layout.prominent ? (
                    <div className="min-w-0 min-[768px]:col-span-2 min-[960px]:col-span-1 min-[960px]:row-span-2 min-[960px]:row-start-1">
                      <AlbumCard album={view.layout.prominent} prominent sizes={prominentSizes} />
                    </div>
                  ) : null}
                  {view.layout.stack.length > 0 ? (
                    <div className="grid grid-cols-1 gap-[8px] min-[768px]:col-span-2 min-[768px]:grid-cols-2 min-[960px]:col-span-1 min-[960px]:col-start-2 min-[960px]:row-span-2 min-[960px]:row-start-1 min-[960px]:grid-cols-1">
                      {view.layout.stack.map((album) => (
                        <AlbumCard key={album.href} album={album} sizes={stackSizes} />
                      ))}
                    </div>
                  ) : null}
                </div>
                {view.layout.bottom.length > 0 ? (
                  <div className="mt-[8px] grid grid-cols-1 gap-[8px] min-[768px]:grid-cols-2 min-[960px]:grid-cols-3">
                    {view.layout.bottom.map((album) => (
                      <AlbumCard key={album.href} album={album} sizes={bottomSizes} />
                    ))}
                  </div>
                ) : null}
              </>
            ) : null}
            {view.rest.length > 0 ? (
              <ul
                className={`m-0 grid list-none grid-cols-1 gap-[8px] p-0 min-[768px]:grid-cols-2 min-[960px]:grid-cols-3 ${view.mode === 'editorial' ? 'mt-[8px]' : ''}`}
                aria-label={view.mode === 'editorial' ? 'More albums' : undefined}
              >
                {view.rest.map((album) => (
                  <li key={album.href} className="min-w-0">
                    <AlbumCard album={album} sizes={bottomSizes} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}

        {!filtering ? (
          <CatalogPagination
            label="Pagination"
            current={page}
            count={pages.at(-1)?.page ?? 0}
            items={pages.map((entry) => entry.page)}
            hrefFor={(number) => pages.find((entry) => entry.page === number)?.href ?? '/galleries/'}
            className="mt-[28px] justify-end"
          />
        ) : null}
      </div>
    </section>
  );
}

function FilterTab({pressed, onClick, children}: {pressed: boolean; onClick: () => void; children: string}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex min-h-[44px] shrink-0 items-center border-0 border-b-2 bg-transparent px-[2px] text-[13px] leading-none ${
        pressed
          ? 'border-[#ED343B] font-semibold text-[#111315]'
          : 'border-transparent font-medium text-[#55595E]'
      }`}
    >
      {children}
    </button>
  );
}
