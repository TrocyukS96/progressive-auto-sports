import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {getWheelHero, wheelHeroSlugs} from './wheel-hero-map.ts';

test('each brand hero uses its own file and unknown slugs do not fall back', () => {
  assert.equal(wheelHeroSlugs.length, 13);
  const sources = wheelHeroSlugs.map((slug) => {
    const hero = getWheelHero(slug);
    assert.ok(hero, slug);
    assert.equal(hero.src, `/images/wheel-brands/hero-${slug}.png`);
    assert.equal(hero.width, 1942);
    assert.equal(hero.height, 809);
    assert.equal(fs.existsSync(path.join(process.cwd(), 'public', hero.src.replace(/^\//, ''))), true, hero.src);
    return hero.src;
  });
  assert.equal(new Set(sources).size, sources.length);
  assert.equal(getWheelHero('missing-brand'), null);
  assert.notEqual(getWheelHero('petrol')?.src, getWheelHero('klassen')?.src);
});
