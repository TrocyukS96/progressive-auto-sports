import {existsSync} from 'node:fs';
import path from 'node:path';
import pages from '@/data/pages.json';
import {displayName, parseGalleryBlocks, type GalleryAlbum, type GalleryPage} from './catalog';

const covers: Record<string, {src: string; width: number; height: number}> = {
  ferrari: {src: '/images/gallery/ferrari-hero.webp', width: 1935, height: 813},
  porche: {src: '/images/gallery/porsche.webp', width: 551, height: 292},
  lamborghini: {src: '/images/gallery/lamborghini.webp', width: 329, height: 134},
  bentley: {src: '/images/gallery/bentley.webp', width: 329, height: 119},
  'mercedes-benz': {src: '/images/gallery/mercedes-benz.webp', width: 297, height: 132},
  bmw: {src: '/images/gallery/bmw.webp', width: 277, height: 132},
  audi: {src: '/images/gallery/audi.webp', width: 296, height: 132},
};

function pageNumber(route: string) {
  const match = route.match(/\/page\/(\d+)\/$/);
  return match ? Number(match[1]) : 1;
}

function assetSize(src: string) {
  const match = src.match(/-(\d+)x(\d+)\./);
  if (!match) return {width: 270, height: 180};
  return {width: Number(match[1]), height: Number(match[2])};
}

function coverFor(slug: string) {
  const cover = covers[slug];
  if (!cover) return null;
  const disk = path.join(process.cwd(), 'public', cover.src.replace(/^\//, ''));
  if (!existsSync(disk)) return null;
  return cover;
}

function galleryRoutes() {
  return Object.keys(pages)
    .filter((route) => route === '/galleries/' || /^\/galleries\/page\/\d+\/$/.test(route))
    .sort((a, b) => pageNumber(a) - pageNumber(b));
}

function albumsFromHtml(html: string, page: number): GalleryAlbum[] {
  return parseGalleryBlocks(html).map((block) => ({
    slug: block.slug,
    href: block.href,
    rawName: block.rawName,
    name: displayName(block.slug, block.rawName),
    image: coverFor(block.slug) ?? {src: block.src, ...assetSize(block.src)},
    page,
  }));
}

export type GalleryCatalog = {
  albums: GalleryAlbum[];
  pages: GalleryPage[];
  title: string;
};

export function getGalleryCatalog(): GalleryCatalog {
  const routes = galleryRoutes();
  const pagesData: GalleryPage[] = routes.map((route) => {
    const html = pages[route as keyof typeof pages]?.html ?? '';
    const page = pageNumber(route);
    return {page, href: route, albums: albumsFromHtml(html, page)};
  });
  const albums = pagesData.flatMap((entry) => entry.albums);
  const title = pages['/galleries/'].title || 'Gallery - Progressive Autosports';
  return {albums, pages: pagesData, title};
}
