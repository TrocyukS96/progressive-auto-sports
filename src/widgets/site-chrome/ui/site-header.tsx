'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ArrowUpRight, Menu} from 'lucide-react';
import {useEffect, useState} from 'react';
import {cn} from '@/src/shared/lib/cn';
import {Button} from '@/src/shared/ui/button';
import {Sheet, SheetContent, SheetTrigger} from '@/src/shared/ui/sheet';
import {siteFontClass} from '../config/fonts';
import {primaryNav, showroomLink} from '../config/content';
import {isOverlayHeader} from '../model/is-overlay-header';
import {SiteLogo} from './site-logo';
import './site-chrome.css';

const overlayNavLinkClass =
  'home-nav-link inline-flex min-h-[44px] items-center px-[10px] text-[16px] font-medium text-[#F8F8F8] no-underline [text-shadow:0_1px_8px_rgb(0_0_0/0.55)] hover:text-white';

const barNavLinkClass =
  'home-nav-link inline-flex min-h-[44px] items-center px-[10px] text-[16px] font-medium text-[#F8F8F8] no-underline hover:text-white';

const glassButtonClass =
  'border-white/45 bg-white/15 shadow-none backdrop-blur-[14px] hover:border-white hover:bg-[#F8F8F8]';

function isCurrent(pathname: string, href: string) {
  const current = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (href === '/wheels/') return current.startsWith('/wheels/');
  return current === href;
}

const chromeFont = {fontFamily: 'var(--font-body), Inter, sans-serif'} as const;

export function SiteHeader() {
  const pathname = usePathname();
  const bar = !isOverlayHeader(pathname);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (bar) return;
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [bar]);

  return (
    <header
      style={chromeFont}
      className={cn(
        'home-header z-30 text-[#F8F8F8]',
        bar
          ? 'fixed inset-x-0 top-0 h-[72px] bg-[#111315] min-[1024px]:h-[84px]'
          : 'fixed inset-x-0 top-0 bg-transparent px-[12px] pt-[10px] min-[768px]:px-[24px] min-[1024px]:pt-[14px]',
      )}
    >
      <div
        className={cn(
          'mx-auto flex items-center justify-between gap-[16px]',
          bar
            ? 'h-full max-w-[1320px] px-[20px] min-[768px]:px-[24px] min-[1024px]:px-[48px]'
            : cn(
                'max-w-[1280px] rounded-[16px] border border-white/30 px-[22px] py-[16px] backdrop-blur-[16px] transition-colors duration-300 motion-reduce:transition-none min-[1024px]:px-[28px] min-[1024px]:py-[14px]',
                scrolled ? 'bg-[#111315]/70' : 'bg-[#111315]/48',
              ),
        )}
      >
        <SiteLogo priority />
        <nav className="home-desktop-nav items-center" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={bar ? barNavLinkClass : overlayNavLinkClass}
              aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-[8px]">
          <Button
            variant="outline"
            asChild
            className={
              bar
                ? 'home-desktop-cta h-[44px] px-[18px] text-[15px]'
                : `home-desktop-cta h-[36px] px-[16px] text-[15px] ${glassButtonClass}`
            }
          >
            <Link href={showroomLink.href}>
              {showroomLink.label}
              <ArrowUpRight aria-hidden className="size-[16px]" />
            </Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'home-mobile-toggle',
                  bar
                    ? 'text-[#F8F8F8] hover:bg-white/10 hover:text-[#F8F8F8]'
                    : 'border-white/45 bg-white/15 backdrop-blur-[14px] hover:bg-white/25 hover:text-[#F8F8F8]',
                )}
                aria-label="Open menu"
                aria-expanded={open}
              >
                <Menu aria-hidden className="size-[22px]" />
              </Button>
            </SheetTrigger>
            <SheetContent title="Menu" className={siteFontClass} style={{fontFamily: 'var(--font-body), Inter, sans-serif'}}>
              <nav className="flex flex-col" aria-label="Mobile">
                {primaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="home-nav-link inline-flex min-h-[44px] items-center text-[18px] font-medium text-[#F8F8F8] no-underline [font-family:var(--font-body),sans-serif]"
                    aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={showroomLink.href}
                  className="mt-[12px] inline-flex min-h-[44px] items-center gap-[8px] text-[18px] font-medium text-[#F8F8F8] no-underline"
                  onClick={() => setOpen(false)}
                >
                  {showroomLink.label}
                  <ArrowUpRight aria-hidden className="size-[16px]" />
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
