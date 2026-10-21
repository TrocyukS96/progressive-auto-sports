import pages from '@/data/pages.json';
import Page from '@/components/Page';
import {notFound, redirect} from 'next/navigation';

type RouteParams = {slug: string[]};

export const dynamicParams = false;

function legacyBrandSlug(slug: string[]) {
  if (slug.length !== 2 || slug[0] !== 'wheel') return null;
  return slug[1];
}

export function generateStaticParams() {
  return Object.keys(pages)
    .map((route) => ({slug: route.split('/').filter(Boolean)}))
    .filter((entry) => {
      const path = entry.slug.join('/');
      return (
        entry.slug.length > 0 &&
        path !== 'wheels' &&
        path !== 'privacy-policy' &&
        path !== 'galleries' &&
        !path.startsWith('galleries/') &&
        !(entry.slug[0] === 'gallery' && entry.slug.length === 2)
      );
    });
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
  if (route === '/wheels/page/2/') redirect('/wheels/');
  const slugName = legacyBrandSlug(slug);
  if (slugName) redirect(`/wheels/${slugName}/`);
  if (!(route in pages)) notFound();
  return <Page route={route as keyof typeof pages} />;
}
