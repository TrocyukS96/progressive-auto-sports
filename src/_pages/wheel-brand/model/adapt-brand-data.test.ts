import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {adaptBrandHtml, resolveWheelBrand} from './adapt-brand-data.ts';
import {catalogSummary, displayDesignName, formatCategoryLabel} from './format.ts';

const expected = {
  '/wheel/avant-garde/': {items: 143, categories: { 'art-advanced': 6, 'ag-avant': 10, 'ag-forged': 75, 'ag-luxury': 46, 'ksm-off-road': 6}},
  '/wheel/beyern-wheels/': {items: 15, categories: {}},
  '/wheel/black-rhino/': {items: 100, categories: {}},
  '/wheel/cray/': {items: 14, categories: {}},
  '/wheel/huntington/': {items: 3, categories: {}},
  '/wheel/klassen/': {items: 24, categories: {monoblock: 9, '3-piece-modular': 15}},
  '/wheel/mandrus/': {items: 31, categories: {}},
  '/wheel/petrol/': {items: 12, categories: {}},
  '/wheel/redbourne/': {items: 35, categories: {}},
  '/wheel/savini-wheels/': {items: 149, categories: {'black-di-forza-bm': 55, diamond: 24, forged: 70}},
  '/wheel/tsw/': {items: 75, categories: {}},
  '/wheel/vellano-wheels/': {items: 174, categories: {concave: 58, 'concave-step-lip': 7, duoblock: 7, monoblock: 41, standard: 61}},
  '/wheel/victor-equipment/': {items: 15, categories: {}},
} as const;

test('display names keep codes and do not merge finish names', () => {
  assert.equal(displayDesignName('m10r'), 'M10R');
  assert.equal(displayDesignName('m20Q'), 'M20Q');
  assert.equal(displayDesignName('AscentBlack'), 'Ascent Black');
  assert.equal(displayDesignName('ArmoryDesertSand'), 'Armory Desert Sand');
  assert.equal(displayDesignName('HuntingtonSpringdale2'), 'Huntington Springdale 2');
  assert.equal(displayDesignName('P0ABlackMatte'), 'P0 A Black Matte');
  assert.equal(displayDesignName('Mesh'), 'Mesh');
  assert.notEqual(displayDesignName('Gerade'), displayDesignName('GeradeBlack'));
});

test('category labels stay factual', () => {
  assert.equal(formatCategoryLabel('MONOBLOCK', 'monoblock'), 'Monoblock');
  assert.equal(formatCategoryLabel('3-PIECE MODULAR', '3-piece-modular'), '3-piece modular');
  assert.equal(formatCategoryLabel('AG FORGED', 'ag-forged'), 'AG Forged');
  assert.equal(formatCategoryLabel('KSM OFF ROAD', 'ksm-off-road'), 'KSM Off Road');
  assert.equal(catalogSummary(24, 0, 2), '24 designs · 2 collections');
  assert.equal(catalogSummary(3, 0, 0), '3 designs');
  assert.equal(catalogSummary(0, 4, 0), '4 images');
});

test('gallery markup stays unnamed and is not searchable by filename', () => {
  const view = adaptBrandHtml({
    route: '/wheel/example/',
    slug: 'example',
    html: `<h1>Example</h1><div class="wheel-pic"><a href="/assets/abc123-photo.jpg" title="" rel="lightbox"><img src="/assets/abc123-photo-150x150.jpg" alt=""></a></div>`,
  });
  assert.equal(view.items.length, 1);
  assert.equal(view.items[0].kind, 'gallery-image');
  assert.equal(view.searchable, false);
  assert.equal(view.showFilters, false);
  assert.equal(view.guidance.kind, 'notes');
  if (view.items[0].kind === 'gallery-image') {
    assert.equal(view.items[0].image, '/assets/abc123-photo.jpg');
    assert.equal(view.items[0].alt, 'Wheel photograph');
  }
});

test('finish variants stay separate and full images are not thumbnails', () => {
  const html = `
    <h1>Sample</h1>
    <div class="wheel-pic"><a href="/assets/a-Gerade.jpg" title="Gerade"><img src="/assets/a-Gerade-150x150.jpg" alt=""><h3>Gerade</h3></a></div>
    <div class="wheel-pic"><a href="/assets/b-GeradeBlack.jpg" title="GeradeBlack"><img src="/assets/b-GeradeBlack-150x150.jpg" alt=""><h3>GeradeBlack</h3></a></div>
  `;
  const view = adaptBrandHtml({route: '/wheel/sample/', slug: 'sample', html});
  assert.equal(view.items.length, 2);
  assert.deepEqual(view.items.map((item) => (item.kind === 'named-design' ? item.name : '')), ['Gerade', 'GeradeBlack']);
  for (const item of view.items) assert.equal(item.image.includes('-150x150'), false);
});

test('empty catalog and unknown routes do not fall back to another brand', () => {
  const empty = adaptBrandHtml({route: '/wheel/empty/', slug: 'empty', html: '<h1>Empty</h1>'});
  assert.equal(empty.items.length, 0);
  assert.equal(empty.hero, null);
  assert.equal(empty.summary, '0 designs');
  assert.equal(resolveWheelBrand('/wheel/missing/', {}), null);
  assert.equal(resolveWheelBrand('/about/', {'/about/': {html: '<h1>About</h1>'}}), null);
  assert.equal(resolveWheelBrand('/wheel/klassen/extra/', {'/wheel/klassen/extra/': {html: '<h1>Klassen</h1>'}}), null);
});

test('live wheel catalogs keep every record, category, and original file', () => {
  const pages = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/pages.json'), 'utf8')) as Record<string, {html: string; title: string}>;
  for (const [route, spec] of Object.entries(expected)) {
    const view = resolveWheelBrand(route, pages);
    assert.ok(view, route);
    if (!view) continue;
    const lightbox = (pages[route].html.match(/rel="lightbox"/g) || []).length;
    assert.equal(view.items.length, spec.items, route);
    assert.equal(view.items.length, lightbox, `${route} dropped a lightbox record`);
    assert.equal(view.slug, route.split('/').filter(Boolean)[1]);
    const counts = Object.fromEntries(view.categories.map((category) => [category.slug, category.count]));
    assert.deepEqual(counts, spec.categories, route);
    assert.equal(view.searchable, true, route);
    for (const item of view.items) {
      assert.equal(item.kind, 'named-design');
      assert.equal(/-150x150\./.test(item.image), false, item.image);
      assert.equal(fs.existsSync(path.join(process.cwd(), 'public', item.image.replace(/^\//, ''))), true, item.image);
      if (item.kind === 'named-design') assert.ok(item.label);
    }
  }

  const klassen = resolveWheelBrand('/wheel/klassen/', pages);
  assert.equal(klassen?.route, '/wheels/klassen/');
  assert.equal(resolveWheelBrand('/wheels/klassen/', pages)?.slug, 'klassen');
  assert.equal(klassen?.headline, 'Distinct by design.');
  assert.deepEqual(klassen?.description, ['Explore the Klassen wheel collection.', 'Monoblock and 3-piece modular designs.']);
  assert.equal(klassen?.summary, '24 designs · 2 collections');
  assert.equal(klassen?.guidance.kind, 'construction');
  assert.equal(klassen?.showFilters, true);

  const vellano = resolveWheelBrand('/wheel/vellano-wheels/', pages);
  assert.equal(vellano?.description.some((line) => line.includes('3-piece')), false);
  assert.equal(vellano?.headline.includes('Distinct'), false);
  assert.equal(vellano?.guidance.kind, 'notes');

  const huntington = resolveWheelBrand('/wheel/huntington/', pages);
  assert.equal(huntington?.items.length, 3);
  assert.equal(huntington?.showFilters, false);
  assert.equal(huntington?.summary, '3 designs');
});
