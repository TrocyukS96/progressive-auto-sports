import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {GalleriesPage, getGalleryCatalog} from '@/src/_pages/galleries';

export const dynamicParams = false;

export function generateStaticParams() {
  return getGalleryCatalog()
    .pages.filter((entry) => entry.page > 1)
    .map((entry) => ({page: String(entry.page)}));
}

export async function generateMetadata({params}: {params: Promise<{page: string}>}): Promise<Metadata> {
  const {page} = await params;
  const catalog = getGalleryCatalog();
  const match = catalog.pages.some((entry) => String(entry.page) === page);
  if (!match) return {title: 'Progressive Autosports'};
  return {title: catalog.title};
}

export default async function GalleryPaged({params}: {params: Promise<{page: string}>}) {
  const {page} = await params;
  const pageNumber = Number(page);
  if (!Number.isInteger(pageNumber)) notFound();
  return <GalleriesPage page={pageNumber} />;
}
