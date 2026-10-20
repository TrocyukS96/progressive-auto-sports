import assert from 'node:assert/strict';
import test from 'node:test';
import type {WheelCatalogItem} from '@/src/entities/wheel-design';
import {clampPage, filterCatalogItems, pageCount, paginate, paginationItems, resultNoun} from './catalog.ts';

function design(name: string, category: string | null, image = `/assets/${name}.jpg`): WheelCatalogItem {
  return {
    kind: 'named-design',
    id: image,
    name,
    label: name,
    category,
    categoryLabel: category,
    image,
    thumbnail: image.replace('.jpg', '-150x150.jpg'),
  };
}

const gallery: WheelCatalogItem = {
  kind: 'gallery-image',
  id: '/assets/hash-photo.jpg',
  image: '/assets/hash-photo.jpg',
  thumbnail: '/assets/hash-photo-150x150.jpg',
  alt: 'Wheel photograph',
};

test('search is trimmed, case-insensitive, and ignores filenames', () => {
  const items = [design('Ascent', null, '/assets/332c29d2b465-Ascent.jpg'), design('Mesh', null), gallery];
  assert.equal(filterCatalogItems(items, '  ASCENT ', null).length, 1);
  assert.equal(filterCatalogItems(items, '332c29', null).length, 0);
  assert.equal(filterCatalogItems(items, 'hash-photo', null).length, 0);
  assert.equal(filterCatalogItems(items, '', null).length, 3);
});

test('category and search narrow the same full catalog, then paginate', () => {
  const items = [
    design('Alpha', 'monoblock'),
    design('Alpine', 'monoblock'),
    design('Beta', 'forged'),
    ...Array.from({length: 14}, (_, index) => design(`Forge ${index}`, 'forged', `/assets/forge-${index}.jpg`)),
  ];
  const filtered = filterCatalogItems(items, 'alp', 'monoblock');
  assert.deepEqual(filtered.map((item) => (item.kind === 'named-design' ? item.name : '')), ['Alpha', 'Alpine']);
  assert.equal(pageCount(0, 12), 0);
  assert.equal(pageCount(filtered.length, 12), 1);
  assert.equal(paginate(filtered, 9, 12).length, 2);
  const forged = filterCatalogItems(items, '', 'forged');
  assert.equal(pageCount(forged.length, 12), 2);
  assert.equal(paginate(forged, 2, 12).length, 3);
  assert.equal(clampPage(0, 2), 1);
  assert.equal(clampPage(8, 2), 2);
  assert.equal(clampPage(1, 0), 1);
});

test('pagination hides a single page and windows long catalogs', () => {
  assert.deepEqual(paginationItems(1, 0), []);
  assert.deepEqual(paginationItems(1, 1), []);
  assert.deepEqual(paginationItems(2, 3), [1, 2, 3]);
  assert.deepEqual(paginationItems(1, 15), [1, 2, 'gap', 15]);
  assert.deepEqual(paginationItems(8, 15), [1, 'gap', 7, 8, 9, 'gap', 15]);
});

test('empty and gallery-only sets use the right noun', () => {
  assert.equal(resultNoun([]), 'designs');
  assert.equal(resultNoun([gallery]), 'image');
  assert.equal(resultNoun([gallery, {...gallery, id: 'b', image: '/b.jpg'}]), 'images');
  assert.equal(resultNoun([design('A', null), gallery]), 'results');
  assert.equal(filterCatalogItems([], 'a', 'monoblock').length, 0);
});
