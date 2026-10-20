import type {ReactNode} from 'react';
import {siteFontClass} from '../config/fonts';
import {SiteFooter} from './site-footer';
import {SiteFrame} from './site-frame';
import {SiteHeader} from './site-header';

export function SiteShell({children}: {children: ReactNode}) {
  return (
    <div className={`${siteFontClass} flex min-h-screen flex-col`}>
      <SiteHeader />
      <SiteFrame>{children}</SiteFrame>
      <SiteFooter />
    </div>
  );
}
