import {Inter, Space_Grotesk} from 'next/font/google';

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const homeFontClass = `${display.variable} ${body.variable}`;
