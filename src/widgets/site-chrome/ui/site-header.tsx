'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ArrowUpRight, ChevronRight, Menu, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {cn} from '@/src/shared/lib/cn';
import {Button} from '@/src/shared/ui/button';
import {Sheet, SheetClose, SheetContent, SheetTrigger} from '@/src/shared/ui/sheet';
import {siteFontClass} from '../config/fonts';
import {onlineStoreLink, primaryNav} from '../config/content';
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
  if (href === '/galleries/') return current.startsWith('/galleries/') || current.startsWith('/gallery/');
  return current === href;
}

const chromeFont = {fontFamily: 'var(--font-body), Inter, sans-serif'} as const;

function isFullBleedHeader(pathname: string) {
  const current = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return current === '/' || current === '/about/' || current === '/wheels/' || current === '/galleries/' || /^\/galleries\/page\/\d+\/$/.test(current);
}

export function SiteHeader() {
  const pathname = usePathname();
  const bar = !isOverlayHeader(pathname);
  const homeOverlay = !bar && isFullBleedHeader(pathname);
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
        homeOverlay
          ? 'fixed inset-x-0 top-0 bg-transparent px-[12px] pt-[10px] min-[768px]:px-[24px] min-[1024px]:pt-[14px]'
          : bar
            ? 'fixed inset-x-0 top-0 h-[72px] bg-[#111315] min-[1024px]:h-[84px]'
            : 'relative inset-x-0 top-0 bg-[#111315] px-[12px] pt-[10px] pb-[10px] min-[768px]:fixed min-[768px]:bg-transparent min-[768px]:px-[24px] min-[768px]:pb-0 min-[1024px]:pt-[14px]',
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
            <a
              href={onlineStoreLink.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${onlineStoreLink.label}, opens in a new tab`}
            >
              {onlineStoreLink.label}
              <ArrowUpRight aria-hidden className="size-[16px]" />
            </a>
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
            <SheetContent
              hideHeader
              title="Menu"
              className={`${siteFontClass} site-menu-panel w-[min(74vw,400px)] bg-[#0E0F11] px-[18px] pt-[14px] pb-[max(16px,env(safe-area-inset-bottom))]`}
              style={chromeFont}
            >
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex items-center justify-between gap-[12px] border-b border-white/10 pb-[14px]">
                  <SiteLogo onClick={() => setOpen(false)} />
                  <SheetClose
                    className="site-menu-close -mr-[8px] inline-flex size-[44px] shrink-0 items-center justify-center rounded-[10px] border-0 bg-transparent p-0 text-[#F8F8F8]"
                    aria-label="Close menu"
                  >
                    <X aria-hidden className="size-[22px]" strokeWidth={1.75} />
                  </SheetClose>
                </div>
                <nav className="mt-[22px] flex min-h-0 flex-1 flex-col overflow-y-auto" aria-labelledby="mobile-explore-label">
                  <p id="mobile-explore-label" className="m-0 px-[14px] text-[12px] font-medium tracking-[0.16em] text-[#A3A7AC] uppercase">
                    Explore
                  </p>
                  <ul className="m-0 mt-[16px] flex list-none flex-col gap-[2px] p-0">
                    {primaryNav.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="site-menu-link flex min-h-[52px] items-center justify-between gap-[12px] rounded-[12px] px-[14px] text-[20px] font-medium text-[#F8F8F8] no-underline transition-colors duration-300 motion-reduce:transition-none"
                          aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                          <ChevronRight aria-hidden className="site-menu-chevron size-[18px] shrink-0 text-[#C2C4C7]" strokeWidth={1.75} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-[18px] shrink-0 border-t border-white/10 pt-[18px]">
                  <Button variant="accent" asChild className="site-menu-store relative h-[54px] w-full rounded-[12px] px-[18px] text-[16px] font-semibold">
                    <a
                      href={onlineStoreLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${onlineStoreLink.label}, opens in a new tab`}
                      onClick={() => setOpen(false)}
                    >
                      {onlineStoreLink.label}
                      <ArrowUpRight aria-hidden className="absolute right-[18px] size-[18px]" />
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
