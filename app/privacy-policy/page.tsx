import type {Metadata} from 'next';
import {PrivacyPolicyPage} from '@/src/_pages/privacy-policy';

export const metadata: Metadata = {
  title: 'Privacy Policy - Progressive Autosports',
  description: 'How Progressive Autosports handles information you share through this website.',
};

export default function Page() {
  return <PrivacyPolicyPage />;
}
