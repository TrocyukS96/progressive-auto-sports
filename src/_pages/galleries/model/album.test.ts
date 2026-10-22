import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {
  PHOTOS_PER_PAGE,
  albumPageCount,
  albumPageStart,
  albumPaginationItems,
  buildGalleryAlbum,
  clampAlbumPage,
  createAlbumState,
  formatPhotoNumber,
  mosaicRows,
  mosaicTiles,
  parseAlbumHtml,
  photoAlt,
  reduceAlbumView,
  splitIntro,
  stepIndex,
  type AlbumNeighbor,
} from './album.ts';
import {displayName, parseGalleryBlocks} from './catalog.ts';

const fixture = `
<article>
  <h2 class="entry-title">FERRARI</h2>
  <p class="intro-content">Ferrari S.p.A. is an Italian manufacturer.</p>
  <a href="/assets/full-ferrari104.jpg" title="ferrari104">
    <img src="/assets/view-ferrari104-1170x520.jpg" alt="">
  </a>
  <a href="/assets/full-ferrari13.jpg" title="ferrari13">
    <img src="/assets/view-ferrari13-800x400.jpg" alt="Rosso coupe in the showroom">
  </a>
  <a href="/images/gallery-detail-reference/ferrari/silver-hero.webp" title="mock">
    <img src="/images/gallery-detail-reference/ferrari/silver-hero.webp" alt="mock">
  </a>
</article>
`;

test('parser keeps album order and drops reference crops', () => {
  const parsed = parseAlbumHtml(fixture);
  assert.equal(parsed.rawName, 'FERRARI');
  assert.equal(parsed.photos.length, 2);
  assert.equal(parsed.photos[0]?.id, '/assets/full-ferrari104.jpg');
  assert.equal(parsed.photos[0]?.width, 1170);
  assert.equal(parsed.photos[1]?.width, 800);
  assert.equal(parsed.photos.some((photo) => photo.src.includes('gallery-detail-reference')), false);
});

test('missing alt stays neutral and a real caption is kept', () => {
  assert.equal(photoAlt('Ferrari', 0, ''), 'Ferrari photograph 1');
  assert.equal(photoAlt('Ferrari', 3, 'ferrari104'), 'Ferrari photograph 4');
  assert.equal(photoAlt('Ferrari', 1, 'Rosso coupe in the showroom'), 'Rosso coupe in the showroom');
});

test('photo credit is not treated as a brand story', () => {
  assert.deepEqual(splitIntro('All Photos Taken By - HoustonIsPhotography.com'), {
    about: null,
    credit: 'All Photos Taken By - HoustonIsPhotography.com',
  });
  assert.equal(splitIntro('').about, null);
  assert.match(splitIntro('Ferrari S.p.A. is an Italian manufacturer.').about ?? '', /Ferrari/);
});

test('numbers and photo pages stay inside the real total', () => {
  assert.equal(formatPhotoNumber(0), '01');
  assert.equal(formatPhotoNumber(122), '123');
  assert.equal(albumPageCount(0), 0);
  assert.equal(albumPageCount(1), 1);
  assert.equal(albumPageCount(PHOTOS_PER_PAGE), 1);
  assert.equal(albumPageCount(PHOTOS_PER_PAGE + 1), 2);
  assert.equal(albumPageCount(123), 18);
  assert.equal(clampAlbumPage(0, 18), 1);
  assert.equal(clampAlbumPage(20, 18), 18);
  assert.equal(clampAlbumPage(1, 0), 1);
  assert.deepEqual(albumPaginationItems(1, 1), []);
  assert.deepEqual(albumPaginationItems(1, 3), [1, 2, 3]);
  assert.deepEqual(albumPaginationItems(1, 18), [1, 2, 'gap', 18]);
  assert.deepEqual(albumPaginationItems(8, 18), [1, 'gap', 7, 8, 9, 'gap', 18]);
  assert.equal(stepIndex(0, -1, 5), 4);
  assert.equal(stepIndex(4, 1, 5), 0);
  assert.equal(stepIndex(0, 1, 1), 0);
  assert.equal(stepIndex(0, 1, 0), 0);
});

test('one selection survives grid open, mode changes, and another page', () => {
  const total = 123;
  let state = createAlbumState(total);
  assert.equal(state.page, 1);
  assert.equal(state.lightbox, false);

  for (let step = 0; step < 20; step += 1) state = reduceAlbumView(state, {type: 'step', delta: 1}, total);
  assert.equal(state.selected, 20);
  assert.equal(state.page, 1);

  state = reduceAlbumView(state, {type: 'select', index: 100, lightbox: true}, total);
  assert.equal(state.selected, 100);
  assert.equal(state.page, 1);
  assert.equal(state.lightbox, true);

  state = reduceAlbumView(state, {type: 'lightbox', open: false}, total);
  assert.equal(state.selected, 100);
  assert.equal(state.lightbox, false);

  state = reduceAlbumView(state, {type: 'page', page: 4}, total);
  state = reduceAlbumView(state, {type: 'mode', mode: 'grid'}, total);
  assert.equal(state.page, 4);
  assert.equal(state.selected, 100);
  assert.equal(state.mode, 'grid');
  assert.equal(reduceAlbumView(state, {type: 'page', page: 99}, total).page, 18);

  const single = reduceAlbumView(createAlbumState(1), {type: 'step', delta: -1}, 1);
  assert.equal(single.selected, 0);
  const empty = reduceAlbumView(createAlbumState(0), {type: 'select', index: 0, lightbox: true}, 0);
  assert.equal(empty.page, 1);
  assert.equal(empty.lightbox, false);
});

test('mosaic rows fill without holes for partial batches', () => {
  for (const count of [0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 14, 19]) {
    const tiles = mosaicTiles(count);
    assert.equal(tiles.length, count);
    const rows = mosaicRows(tiles);
    assert.ok(rows, `expected complete rows for ${count}`);
    assert.equal(tiles.reduce((sum, tile) => sum + tile.span, 0), count === 0 ? 0 : (rows?.length ?? 0) * 20);
  }
});

test('each page is its own slice and the pages cover every photo once', () => {
  const ids = Array.from({length: 20}, (_, index) => `photo-${index}`);
  const shown: string[] = [];
  const count = albumPageCount(ids.length);
  for (let page = 1; page <= count; page += 1) {
    const start = albumPageStart(page, ids.length);
    const slice = ids.slice(start, start + PHOTOS_PER_PAGE);
    assert.equal(slice.some((id) => shown.includes(id)), false);
    assert.ok(slice.length > 0);
    assert.ok(slice.length <= PHOTOS_PER_PAGE);
    shown.push(...slice);
  }
  assert.deepEqual(shown, ids);
});

function albumOrder(data: Record<string, {html: string; title?: string}>) {
  return [...parseGalleryBlocks(data['/galleries/'].html), ...parseGalleryBlocks(data['/galleries/page/2/'].html)].map(
    (block) => ({
      slug: block.slug,
      href: block.href,
      name: displayName(block.slug, block.rawName),
      image: {src: block.src, width: 270, height: 180},
    }),
  );
}

function detail(data: Record<string, {html: string; title?: string}>, slug: string, albums: Array<AlbumNeighbor & {slug: string}>) {
  const href = `/gallery/${slug}/`;
  const source = data[href];
  const parsed = parseAlbumHtml(source?.html ?? '');
  return buildGalleryAlbum({
    slug,
    href,
    name: displayName(slug, parsed.rawName || slug),
    title: source?.title ?? '',
    html: source?.html ?? '',
    albums,
  });
}

test('ferrari keeps the workshop album and the legacy Porsche link', () => {
  const data = JSON.parse(readFileSync(new URL('../../../../data/pages.json', import.meta.url), 'utf8')) as Record<
    string,
    {html: string; title?: string}
  >;
  const albums = albumOrder(data);
  const ferrari = detail(data, 'ferrari', albums);
  assert.equal(ferrari.photos.length, 123);
  assert.equal(ferrari.photos.some((photo) => photo.src.includes('gallery-detail-reference')), false);
  assert.equal(new Set(ferrari.photos.map((photo) => photo.id)).size, 123);
  assert.equal(ferrari.photos[0]?.alt, 'Ferrari photograph 1');
  assert.match(ferrari.photos[0]?.fullSrc ?? '', /ferrari104\.jpg$/);
  assert.equal(ferrari.next?.href, '/gallery/porche/');
  assert.equal(ferrari.next?.name, 'Porsche');
  assert.equal(ferrari.lead, 'Italian soul.');
  assert.match(ferrari.about ?? '', /Maranello/);
  assert.equal(ferrari.credit, null);

  const porsche = detail(data, 'porche', albums);
  assert.equal(porsche.href, '/gallery/porche/');
  assert.equal(porsche.name, 'Porsche');
  assert.equal(porsche.lead, null);
  assert.equal(porsche.photos.length, 47);
  assert.equal(porsche.photos.some((photo) => photo.alt.startsWith('Ferrari')), false);

  const mini = detail(data, 'mini-cooper', albums);
  assert.equal(mini.about, null);
  assert.match(mini.credit ?? '', /HoustonIsPhotography/);

  const last = albums[albums.length - 1];
  assert.ok(last);
  assert.equal(detail(data, last.slug, albums).next, null);
  assert.equal(detail(data, 'not-a-marque', albums).photos.length, 0);
  assert.equal(detail(data, 'not-a-marque', albums).next, null);
});
