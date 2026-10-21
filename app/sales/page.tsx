import type {Metadata} from 'next';
import {MotorSalesPage} from '@/src/_pages/motor-sales';

export const metadata: Metadata = {
  title: 'Motor Sales - Progressive Autosports',
  description: 'Discover luxury and custom vehicles in Houston, Texas.',
};

export default function Page() {
  return <MotorSalesPage />;
}
