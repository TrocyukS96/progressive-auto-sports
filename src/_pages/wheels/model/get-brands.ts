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

/** WordPress 270×180 thumbnails that crop the wordmark. Use the full file instead. */
const uncroppedLogos: Record<string, {src: string; width: number; height: number}> = {
  '7b2a671c6acc-savini-logo-270x180.jpg': {
    src: '/assets/6968578bf044-savini-logo-675x170.jpg',
    width: 675,
    height: 170,
  },
};

function publicBrandHref(href: string) {
  if (href.startsWith('/wheel/') && !href.startsWith('/wheels/')) {
    return `/wheels/${href.slice('/wheel/'.length)}`;
  }
  return href;
}

function localLogo(assetPath: string): {src: string; width: number; height: number} | null {
  const file = assetPath.split('/').pop();
  if (!file) return null;

  const full = uncroppedLogos[file];
  if (full && existsSync(path.join(process.cwd(), 'public', full.src.replace(/^\//, '')))) {
    return full;
  }

  const diskPath = path.join(process.cwd(), 'public', 'images', 'brands', file);
  if (!existsSync(diskPath)) return null;
  return {src: `/images/brands/${file}`, width: 270, height: 180};
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
      const logo = localLogo(match[3] ?? '');
      brands.push({
        name: decode(match[4] || match[2] || 'Wheel brand'),
        href: publicBrandHref(href),
        logoSrc: logo?.src ?? null,
        logoWidth: logo?.width ?? 270,
        logoHeight: logo?.height ?? 180,
      });
    }
  }

  return brands;
}
