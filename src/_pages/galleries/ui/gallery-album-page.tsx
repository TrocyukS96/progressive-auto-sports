import Image from 'next/image';
import Link from 'next/link';
import {ArrowLeft, ArrowUpLeft, ArrowUpRight, ChevronDown} from 'lucide-react';
import {Button} from '@/src/shared/ui/button';
import {siteFontClass} from '@/src/widgets/site-chrome';
import {showroomLink} from '@/src/widgets/site-chrome/config/content';
import type {GalleryAlbumDetail} from '../model/get-album';
import {AlbumExperience} from './album-experience';
import './gallery-album.css';

const shell = 'mx-auto w-full max-w-[1320px] px-[20px] min-[768px]:px-[32px] min-[960px]:px-[40px]';

export function GalleryAlbumPage({album}: {album: GalleryAlbumDetail}) {
  return (
    <div
      className={`${siteFontClass} gallery-album-page relative box-border w-full min-w-0 flex-1 overflow-x-clip bg-[#111315] text-[#F8F8F8] antialiased [&_*]:box-border`}
      style={{fontFamily: 'var(--font-body), Inter, sans-serif'}}
    >
      <main>
        <section aria-labelledby="album-title" className="bg-[#111315] text-[#F8F8F8]">
          <div className={`${shell} pt-[20px] pb-[28px] min-[768px]:pt-[28px] min-[768px]:pb-[32px]`}>
            <div className="flex flex-col gap-[20px] min-[960px]:flex-row min-[960px]:items-end min-[960px]:justify-between">
              <div className="min-w-0">
                <nav aria-label="Breadcrumb">
                  <ol className="m-0 flex list-none flex-wrap items-center gap-x-[8px] gap-y-[4px] p-0 text-[13px] text-[#C2C4C7]">
                    <li>
                      <Link href="/" className="album-crumb inline-flex min-h-[44px] items-center">
                        Home
                      </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li>
                      <Link href="/galleries/" className="album-crumb inline-flex min-h-[44px] items-center">
                        Gallery
                      </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li aria-current="page" className="text-[#F8F8F8]">
                      {album.name}
                    </li>
                  </ol>
                </nav>
                <p className="m-0 text-[11px] font-medium tracking-[0.22em] text-[#C2C4C7] uppercase">The Progressive Gallery</p>
                <h1 id="album-title" className="m-0 mt-[8px] text-[52px] leading-[0.92] font-semibold tracking-[-0.04em] text-[#F8F8F8] min-[768px]:text-[60px] min-[1024px]:text-[68px]">
                  {album.name}
                  <span className="text-[#ED343B]">.</span>
                </h1>
                <p className="m-0 mt-[12px] max-w-[34rem] text-[14px] leading-[1.45] text-[#C2C4C7]">{album.lede}</p>
              </div>
              <div className="flex flex-col items-start gap-[16px] min-[960px]:items-end">
                <div className="min-[960px]:text-right">
                  {album.lead ? <p className="m-0 text-[18px] leading-[1.3] font-medium text-[#F8F8F8]">{album.lead}</p> : null}
                  <p className="m-0 text-[18px] leading-[1.3] font-medium text-[#F8F8F8]">{album.perspective}</p>
                </div>
                <Button variant="outline" asChild className="album-outline h-[44px] px-[16px] text-[14px]">
                  <Link href="/galleries/">
                    <ArrowLeft aria-hidden className="size-[16px]" />
                    All albums
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <AlbumExperience key={album.slug} name={album.name} photos={album.photos} />

        <section className="bg-[#F4F3EF] text-[#111315]">
          {album.about || album.credit ? (
            <div className={`${shell} pb-[8px]`}>
              {album.credit ? <p className="m-0 text-[14px] leading-[1.5] text-[#55595E]">{album.credit}</p> : null}
              {album.about ? (
                <details className="group border-t border-[#DEDED9]">
                  <summary className="flex min-h-[44px] cursor-pointer items-center justify-between gap-[12px] py-[8px]">
                    <h3 className="m-0 text-[18px] leading-[1.2] font-medium text-[#111315]">About {album.name}</h3>
                    <ChevronDown aria-hidden className="size-[16px] shrink-0 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none" />
                  </summary>
                  <p className="m-0 max-w-[46rem] pb-[16px] text-[15px] leading-[1.6] text-[#55595E]">{album.about}</p>
                </details>
              ) : null}
            </div>
          ) : null}

          <div className={`${shell}`}>
            <nav aria-label="More albums" className="grid border-t border-[#DEDED9] min-[768px]:grid-cols-2">
              <Link href="/galleries/" className="album-quiet flex min-h-[88px] flex-col justify-center py-[16px] no-underline">
                <span className="text-[11px] font-medium tracking-[0.18em] text-[#55595E] uppercase">Back to gallery</span>
                <span className="mt-[4px] inline-flex items-center gap-[8px] text-[20px] leading-none font-medium text-[#111315]">
                  All marques
                  <ArrowUpLeft aria-hidden className="size-[16px]" />
                </span>
              </Link>
              {album.next ? (
                <Link
                  href={album.next.href}
                  className="album-quiet flex min-h-[88px] items-center justify-between gap-[16px] border-t border-[#DEDED9] py-[16px] no-underline min-[768px]:border-t-0 min-[768px]:border-l min-[768px]:pl-[24px]"
                >
                  <span className="min-w-0">
                    <span className="block text-[11px] font-medium tracking-[0.18em] text-[#55595E] uppercase">Next album</span>
                    <span className="mt-[4px] inline-flex items-center gap-[8px] text-[20px] leading-none font-medium text-[#111315]">
                      {album.next.name}
                      <ArrowUpRight aria-hidden className="size-[16px]" />
                    </span>
                  </span>
                  <span className="relative h-[52px] w-[120px] shrink-0 overflow-hidden bg-[#E7E4DE]">
                    <Image src={album.next.image.src} alt="" fill sizes="120px" className="object-cover object-center" />
                  </span>
                </Link>
              ) : null}
            </nav>
          </div>
        </section>

        <section aria-labelledby="album-cta-title" className="bg-[#111315] text-[#F8F8F8]">
          <div className={`${shell} grid gap-[24px] py-[40px] min-[768px]:py-[48px] min-[960px]:grid-cols-[1.2fr_0.8fr] min-[960px]:items-center min-[960px]:py-[56px]`}>
            <div className="min-w-0">
              <p className="m-0 text-[11px] font-medium tracking-[0.22em] text-[#C2C4C7] uppercase">The Progressive Touch</p>
              <h2 id="album-cta-title" className="m-0 mt-[10px] text-[36px] leading-[0.95] font-semibold tracking-[-0.04em] text-[#F8F8F8] min-[768px]:text-[40px]">
                Your car.
                <br />
                Your next chapter
                <span className="text-[#ED343B]">.</span>
              </h2>
            </div>
            <div className="min-w-0">
              <p className="m-0 text-[18px] leading-[1.35] font-medium text-[#F8F8F8]">Inspired by what you see?</p>
              <p className="m-0 mt-[6px] text-[16px] leading-[1.4] text-[#C2C4C7]">Let’s talk about your car.</p>
              <div className="mt-[20px]">
                <Button variant="accent" asChild className="album-accent h-[48px] px-[22px] text-[15px]">
                  <Link href={showroomLink.href}>
                    Talk to our team
                    <ArrowUpRight aria-hidden className="size-[16px]" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
