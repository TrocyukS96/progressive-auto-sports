import pages from '@/data/pages.json';
import {buildGalleryAlbum, parseAlbumHtml, type GalleryAlbumDetail} from './album';
import {displayName} from './catalog';
import {getGalleryCatalog} from './get-albums';

export type {GalleryAlbumDetail};

export function getGalleryAlbum(slug: string): GalleryAlbumDetail | null {
  const href = `/gallery/${slug}/`;
  const source = pages[href as keyof typeof pages];
  if (!source) return null;

  const parsed = parseAlbumHtml(source.html);
  return buildGalleryAlbum({
    slug,
    href,
    name: displayName(slug, parsed.rawName || slug),
    title: source.title,
    html: source.html,
    albums: getGalleryCatalog().albums,
  });
}
