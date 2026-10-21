import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {catalogView, displayName, editorialLayout, filterAlbums, parseGalleryBlocks, type GalleryAlbum} from './catalog.ts';

function album(slug: string, name: string, page = 1, rawName = name.toUpperCase()): GalleryAlbum {
  return {
    slug,
    href: `/gallery/${slug}/`,
    name,
    rawName,
    image: {src: `/images/${slug}.webp`, width: 300, height: 160},
    page,
  };
}

const catalog = [
  album('ferrari', 'Ferrari'),
  album('audi', 'Audi'),
  album('porche', 'Porsche', 1, 'PORCHE'),
  album('mini-cooper', 'Mini Cooper'),
  album('lamborghini', 'Lamborghini'),
  album('bentley', 'Bentley'),
  album('mercedes-benz', 'Mercedes-Benz', 1, 'MERCEDES BENZ'),
  album('bmw', 'BMW'),
  album('viper', 'Viper', 2),
];

test('display names correct Porsche and Mercedes-Benz without inventing other spellings', () => {
  assert.equal(displayName('porche', 'PORCHE'), 'Porsche');
  assert.equal(displayName('mercedes-benz', 'MERCEDES BENZ'), 'Mercedes-Benz');
  assert.equal(displayName('bmw', 'BMW'), 'BMW');
  assert.equal(displayName('aston-martin', 'ASTON MARTIN'), 'Aston Martin');
  assert.equal(displayName('trucks', 'TRUCKS – JEEPS -SUV'), 'Trucks – Jeeps -SUV');
});

test('search is trimmed, case-insensitive, and combines with the selected marque across the full list', () => {
  assert.deepEqual(
    filterAlbums(catalog, '  PORSCHE ', null).map((item) => item.slug),
    ['porche'],
  );
  assert.deepEqual(
    filterAlbums(catalog, 'porche', null).map((item) => item.slug),
    ['porche'],
  );
  assert.deepEqual(
    filterAlbums(catalog, '  ', 'bmw').map((item) => item.slug),
    ['bmw'],
  );
  assert.deepEqual(filterAlbums(catalog, 'audi', 'bmw'), []);
  assert.deepEqual(
    filterAlbums(catalog, 'viper', null).map((item) => item.page),
    [2],
  );
});

test('editorial slots follow marque slug even when the source order differs', () => {
  const layout = editorialLayout([...catalog].reverse());
  assert.equal(layout.prominent?.slug, 'porche');
  assert.deepEqual(
    layout.stack.map((item) => item.slug),
    ['lamborghini', 'bentley'],
  );
  assert.deepEqual(
    layout.bottom.map((item) => item.slug),
    ['mercedes-benz', 'bmw', 'audi'],
  );
});

test('a missing editorial marque leaves no empty slot', () => {
  const layout = editorialLayout(catalog.filter((item) => item.slug !== 'bentley'));
  assert.deepEqual(
    layout.stack.map((item) => item.slug),
    ['lamborghini'],
  );
});

test('the first page shows the editorial grid without the albums from later pages', () => {
  const preview = catalogView({
    all: catalog,
    pageAlbums: catalog.filter((item) => item.page === 1),
    query: '',
    marque: null,
    featuredSlug: 'ferrari',
    page: 1,
  });
  assert.equal(preview.mode, 'editorial');
  assert.equal(preview.rest.length, 0);
  assert.equal(preview.layout.prominent?.slug, 'porche');
  assert.equal(
    [preview.layout.prominent, ...preview.layout.stack, ...preview.layout.bottom].some((item) => item?.slug === 'viper'),
    false,
  );
});

test('a filtered catalog ignores the current page and uses a compact grid', () => {
  const view = catalogView({
    all: catalog,
    pageAlbums: catalog.filter((item) => item.page === 1),
    query: '',
    marque: 'viper',
    featuredSlug: 'ferrari',
    page: 1,
  });
  assert.equal(view.mode, 'compact');
  assert.deepEqual(
    view.rest.map((item) => item.slug),
    ['viper'],
  );
});

test('gallery HTML keeps every album address, including the Porsche slug', () => {
  const data = JSON.parse(readFileSync(new URL('../../../../data/pages.json', import.meta.url), 'utf8')) as Record<
    string,
    {html: string}
  >;
  const first = parseGalleryBlocks(data['/galleries/'].html);
  const second = parseGalleryBlocks(data['/galleries/page/2/'].html);
  const porsche = first.find((item) => item.slug === 'porche');
  assert.equal(first.length, 12);
  assert.equal(second.length, 4);
  assert.equal(porsche?.href, '/gallery/porche/');
  assert.equal(displayName(porsche?.slug ?? '', porsche?.rawName ?? ''), 'Porsche');
  assert.equal(second.some((item) => item.href === '/gallery/trucks/'), true);
});
