import type {Metadata} from 'next';
import {GalleriesPage, getGalleryCatalog} from '@/src/_pages/galleries';

const catalog = getGalleryCatalog();

export const metadata: Metadata = {
  title: catalog.title,
};

export default function Page() {
  return <GalleriesPage page={1} />;
}
