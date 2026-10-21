import type {Metadata} from 'next';
import {ContactPage} from '@/src/_pages/contact';

export const metadata: Metadata = {
  title: 'Contact - Progressive Autosports',
  description: 'Share your ideas, ask a question, or plan your visit.',
};

export default function Page() {
  return <ContactPage />;
}
