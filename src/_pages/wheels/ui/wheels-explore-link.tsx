'use client';

import {ArrowDownRight} from 'lucide-react';
import type {MouseEvent} from 'react';
import {Button} from '@/src/shared/ui/button';

export function WheelsExploreLink() {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById('wheel-brands');
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'start'});
  };

  return (
    <Button variant="accent" asChild className="h-[48px] px-[22px] text-[16px]">
      <a href="#wheel-brands" onClick={onClick}>
        Explore brands
        <ArrowDownRight aria-hidden className="size-[16px]" />
      </a>
    </Button>
  );
}
