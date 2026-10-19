import type {Metadata} from 'next';
import {WheelsPage} from '@/src/_pages/wheels';

export const metadata: Metadata = {
  title: 'Wheels - Progressive Autosports',
  description: 'Explore wheel brands at Progressive Autosports and find your signature.',
};

export default function Page() {
  return <WheelsPage />;
}
