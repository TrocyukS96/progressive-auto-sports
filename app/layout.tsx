import './globals.css';
import type {Metadata} from 'next';
import {SiteShell} from '@/src/widgets/site-chrome';

export const metadata: Metadata = {
  title: 'Progressive Autosports',
  icons: {
    icon: [
      {url: '/brand/favicon.ico', sizes: 'any'},
      {url: '/brand/icon-32.png', type: 'image/png', sizes: '32x32'},
      {url: '/brand/icon-192.png', type: 'image/png', sizes: '192x192'},
    ],
    apple: '/brand/apple-touch-icon.png',
  },
  robots: {index: false, follow: false},
};

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
