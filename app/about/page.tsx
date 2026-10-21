import type {Metadata} from 'next';
import {AboutPage} from '@/src/_pages/about';

export const metadata: Metadata = {
  title: 'About - Progressive Autosports',
  description:
    'Progressive Autosports began in 1996 with one vision: to personalize automobiles using the finest quality products.',
};

export default function Page() {
  return <AboutPage />;
}
