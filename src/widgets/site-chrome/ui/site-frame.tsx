'use client';

import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import {isOverlayHeader} from '../model/is-overlay-header';

export function SiteFrame({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const overlay = isOverlayHeader(pathname);

  return (
    <div className={overlay ? 'flex flex-1 flex-col' : 'flex flex-1 flex-col pt-[72px] min-[1024px]:pt-[84px]'}>{children}</div>
  );
}
