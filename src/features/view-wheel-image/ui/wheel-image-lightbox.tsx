'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import {ArrowUpRight, ChevronLeft, ChevronRight, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import type {WheelCatalogItem} from '@/src/entities/wheel-design';
import './wheel-lightbox.css';

type WheelImageLightboxProps = {
  items: WheelCatalogItem[];
  activeId: string | null;
  brandName: string;
  contactEmail: string;
  onOpenChange: (id: string | null) => void;
};

function itemTitle(item: WheelCatalogItem) {
  return item.kind === 'named-design' ? item.label : item.alt;
}

function mailtoHref(email: string, brandName: string, item: WheelCatalogItem) {
  if (item.kind !== 'named-design') return '/contact/';
  const subject = `Wheel inquiry: ${brandName} ${item.label}`;
  const body = `Hello,\n\nI'm asking about the ${item.label} wheel from ${brandName}.\n\nVehicle:\n`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function WheelImageLightbox({items, activeId, brandName, contactEmail, onOpenChange}: WheelImageLightboxProps) {
  const index = items.findIndex((item) => item.id === activeId);
  const item = index >= 0 ? items[index] : null;
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');

  useEffect(() => {
    setCopyState('idle');
  }, [activeId]);

  useEffect(() => {
    if (!item || items.length < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const delta = event.key === 'ArrowRight' ? 1 : -1;
      const next = items[(index + delta + items.length) % items.length];
      onOpenChange(next.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, item, items, onOpenChange]);

  const go = (delta: number) => {
    if (items.length < 2 || index < 0) return;
    const next = items[(index + delta + items.length) % items.length];
    onOpenChange(next.id);
  };

  const copyName = async () => {
    if (!item || item.kind !== 'named-design') return;
    try {
      await navigator.clipboard.writeText(item.label);
      setCopyState('copied');
    } catch {
      setCopyState('manual');
    }
  };

  const title = item ? itemTitle(item) : 'Wheel image';
  const named = item?.kind === 'named-design';

  return (
    <Dialog.Root open={item !== null} onOpenChange={(open) => !open && onOpenChange(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-[#111315]/80" />
        <Dialog.Content
          className="wheel-lightbox fixed inset-[12px] z-[80] flex flex-col rounded-[12px] bg-[#111315] p-[16px] text-[#F8F8F8] focus:outline-none min-[768px]:inset-[32px] min-[768px]:p-[24px]"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <div className="flex items-start justify-between gap-[16px]">
            <div className="min-w-0">
              <Dialog.Title className="m-0 text-[22px] leading-[1.15] font-medium break-words text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[768px]:text-[28px]">
                {title}
              </Dialog.Title>
              <Dialog.Description className="m-0 mt-[6px] text-[14px] text-[#C2C4C7]">
                {named && item.categoryLabel ? `${brandName} · ${item.categoryLabel}` : brandName}
              </Dialog.Description>
            </div>
            <Dialog.Close className="inline-flex size-[44px] shrink-0 items-center justify-center rounded-full border border-[#C2C4C7] bg-transparent p-0 text-[#F8F8F8]" aria-label="Close">
              <X aria-hidden className="size-[18px]" />
            </Dialog.Close>
          </div>

          <div className="mt-[12px] grid min-h-0 flex-1 grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-[8px] min-[768px]:gap-[16px]">
            {items.length > 1 ? (
              <button type="button" className="inline-flex size-[44px] items-center justify-center rounded-[8px] border border-[#C2C4C7] bg-transparent p-0 text-[#F8F8F8]" aria-label="Previous image" onClick={() => go(-1)}>
                <ChevronLeft aria-hidden className="size-[18px]" />
              </button>
            ) : (
              <span />
            )}
            <div className="relative h-full min-h-[220px]">
              {item ? (
                <Image src={item.image} alt={named ? `${brandName} ${item.label} wheel` : item.alt} fill sizes="90vw" quality={90} className="object-contain" priority />
              ) : null}
            </div>
            {items.length > 1 ? (
              <button type="button" className="inline-flex size-[44px] items-center justify-center rounded-[8px] border border-[#C2C4C7] bg-transparent p-0 text-[#F8F8F8]" aria-label="Next image" onClick={() => go(1)}>
                <ChevronRight aria-hidden className="size-[18px]" />
              </button>
            ) : (
              <span />
            )}
          </div>

          <div className="mt-[16px] flex flex-col gap-[12px] min-[768px]:flex-row min-[768px]:items-center min-[768px]:justify-between">
            <p className="m-0 text-[14px] text-[#C2C4C7]" aria-live="polite">
              {copyState === 'copied' ? 'Name copied.' : copyState === 'manual' ? 'Select the name above to copy it.' : named ? item.label : 'Original photograph'}
            </p>
            <div className="flex flex-wrap gap-[8px]">
              {named ? (
                <button type="button" className="inline-flex h-[44px] items-center justify-center rounded-full border border-[#F8F8F8] bg-transparent px-[16px] text-[14px] font-medium text-[#F8F8F8]" onClick={copyName}>
                  Copy name
                </button>
              ) : null}
              {item ? (
                <a className="inline-flex h-[44px] items-center justify-center gap-[8px] rounded-full border border-transparent bg-[#CD202B] px-[16px] text-[14px] font-medium text-white no-underline" href={mailtoHref(contactEmail, brandName, item)}>
                  {named ? 'Ask about this design' : 'Ask about fitment'}
                  <ArrowUpRight aria-hidden className="size-[16px]" />
                </a>
              ) : null}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
