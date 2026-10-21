import type {Metadata} from 'next';
import pages from '@/data/pages.json';
import {notFound} from 'next/navigation';
import {GalleryAlbumPage, getGalleryAlbum} from '@/src/_pages/galleries';

type RouteParams = {slug: string};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(pages)
    .map((route) => route.split('/').filter(Boolean))
    .filter((parts) => parts[0] === 'gallery' && parts.length === 2)
    .map((parts) => ({slug: parts[1]}));
}

export async function generateMetadata({params}: {params: Promise<RouteParams>}): Promise<Metadata> {
  const {slug} = await params;
  const album = getGalleryAlbum(slug);
  if (!album) return {title: 'Progressive Autosports'};
  return {title: album.pageTitle};
}

export default async function GalleryAlbumRoute({params}: {params: Promise<RouteParams>}) {
  const {slug} = await params;
  const album = getGalleryAlbum(slug);
  if (!album) notFound();
  return <GalleryAlbumPage album={album} />;
}
