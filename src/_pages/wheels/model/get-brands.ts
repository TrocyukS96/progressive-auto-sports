import {existsSync} from 'node:fs';
import path from 'node:path';
import pages from '@/data/pages.json';
import type {WheelBrand} from '@/src/entities/wheel-brand';

const catalogRoutes = ['/wheels/', '/wheels/page/2/'] as const;

function decode(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function localLogo(assetPath: string): string | null {
  const file = assetPath.split('/').pop();
  if (!file) return null;
  const diskPath = path.join(process.cwd(), 'public', 'images', 'brands', file);
  if (!existsSync(diskPath)) return null;
  return `/images/brands/${file}`;
}

export function getWheelBrands(): WheelBrand[] {
  const brands: WheelBrand[] = [];
  const seen = new Set<string>();
  const pattern =
    /<a href="([^"]+)" title="Explore more on ([^"]+)">[\s\S]*?<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g;

  for (const route of catalogRoutes) {
    const html = pages[route]?.html ?? '';
    for (const match of html.matchAll(pattern)) {
      const href = match[1];
      if (!href || seen.has(href)) continue;
      seen.add(href);
      brands.push({
        name: decode(match[4] || match[2] || 'Wheel brand'),
        href,
        logoSrc: localLogo(match[3] ?? ''),
      });
    }
  }

  return brands;
}
