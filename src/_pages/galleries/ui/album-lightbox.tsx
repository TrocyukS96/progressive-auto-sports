'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import {ChevronLeft, ChevronRight, X} from 'lucide-react';
import {useState} from 'react';
import {siteFontClass} from '@/src/widgets/site-chrome';
import {formatPhotoNumber, type AlbumPhoto} from '../model/album';

const control =
  'inline-flex size-[44px] shrink-0 items-center justify-center rounded-full border border-[#C2C4C7] bg-[#111315]/80 p-0 text-[#F8F8F8]';

type AlbumLightboxProps = {
  photos: AlbumPhoto[];
  index: number;
  name: string;
  onStep: (delta: number) => void;
  onClose: () => void;
  returnFocus: HTMLElement | null;
};

function LightboxFrame({photo}: {photo: AlbumPhoto}) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="m-0 text-[15px] text-[#F8F8F8]">This photograph could not be loaded.</p>
        <button
          type="button"
          className="inline-flex h-[44px] items-center rounded-full border border-[#F8F8F8] px-4 text-[14px] font-medium text-[#F8F8F8]"
          onClick={() => {
            setFailed(false);
            setAttempt((value) => value + 1);
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <Image
      key={attempt}
      src={photo.fullSrc}
      alt={photo.alt}
      fill
      sizes="100vw"
      className="object-contain object-center"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

export function AlbumLightbox({photos, index, name, onStep, onClose, returnFocus}: AlbumLightboxProps) {
  const photo = photos[index];
  if (!photo) return null;

  const total = photos.length;
  const neighbors = [photos[index - 1], photos[index + 1]].filter((item): item is AlbumPhoto => Boolean(item));
  const position = `${formatPhotoNumber(index)} / ${total}`;

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-[#111315]/80" />
        <Dialog.Content
          className={`${siteFontClass} album-lightbox fixed inset-0 z-[80] flex flex-col bg-[#111315] text-[#F8F8F8] outline-none`}
          style={{fontFamily: 'var(--font-body), Inter, sans-serif'}}
          onCloseAutoFocus={(event) => {
            if (!returnFocus) return;
            event.preventDefault();
            returnFocus.focus();
          }}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
            event.preventDefault();
            event.stopPropagation();
            onStep(event.key === 'ArrowRight' ? 1 : -1);
          }}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 min-[768px]:px-6">
            <div className="min-w-0">
              <Dialog.Title className="m-0 truncate text-[18px] leading-none font-medium text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[768px]:text-[22px]">
                {name}
              </Dialog.Title>
              <Dialog.Description id="album-lightbox-position" className="m-0 mt-2 text-[14px] text-[#C2C4C7] tabular-nums" aria-live="polite">
                <span className="sr-only">{`Photograph ${index + 1} of ${total}. `}</span>
                <span aria-hidden>{position}</span>
              </Dialog.Description>
            </div>
            <Dialog.Close className={control} aria-label="Close photograph">
              <X aria-hidden className="size-[18px]" />
            </Dialog.Close>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[44px_minmax(0,1fr)_44px] items-stretch gap-2 px-3 pb-4 min-[768px]:gap-4 min-[768px]:px-6 min-[768px]:pb-6">
            {total > 1 ? (
              <div className="flex items-center">
                <button type="button" className={control} aria-label="Previous photograph" onClick={() => onStep(-1)}>
                  <ChevronLeft aria-hidden className="size-[18px]" />
                </button>
              </div>
            ) : (
              <span />
            )}
            <div className="relative min-h-[220px]">
              <LightboxFrame key={photo.id} photo={photo} />
            </div>
            {total > 1 ? (
              <div className="flex items-center">
                <button type="button" className={control} aria-label="Next photograph" onClick={() => onStep(1)}>
                  <ChevronRight aria-hidden className="size-[18px]" />
                </button>
              </div>
            ) : (
              <span />
            )}
          </div>

          <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" aria-hidden>
            {neighbors.map((item) => (
              <Image key={item.id} src={item.fullSrc} alt="" width={item.width} height={item.height} sizes="100vw" />
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
