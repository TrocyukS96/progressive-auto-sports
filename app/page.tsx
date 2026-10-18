import type {Metadata} from 'next';
import {HomePage} from '@/src/_pages/home';

export const metadata: Metadata = {
  title: 'Home - Progressive Autosports',
};

export default function Page() {
  return <HomePage />;
}
