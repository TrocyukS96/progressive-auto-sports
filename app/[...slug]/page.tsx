import pages from '@/data/pages.json';
import Page from '@/components/Page';
import {notFound} from 'next/navigation';

type RouteParams = {slug: string[]};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(pages)
    .map((route) => ({slug: route.split('/').filter(Boolean)}))
    .filter((entry) => entry.slug.length > 0);
}

export async function generateMetadata({params}: {params: Promise<RouteParams>}) {
  const {slug} = await params;
  const route = `/${slug.join('/')}/`;
  const data = pages[route as keyof typeof pages];
  return {title: data?.title || 'Progressive Autosports'};
}

export default async function ArchivePage({params}: {params: Promise<RouteParams>}) {
  const {slug} = await params;
  const route = `/${slug.join('/')}/`;
  if (!(route in pages)) notFound();
  return <Page route={route as keyof typeof pages} />;
}
