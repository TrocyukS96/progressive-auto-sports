'use client';

import Image from 'next/image';
import {useState, type CSSProperties} from 'react';
import type {AlbumPhoto} from '../model/album';

type PhotoTileProps = {
  photo: AlbumPhoto;
  sizes: string;
  span?: number;
  aspect?: string;
  onOpen: (source: HTMLButtonElement) => void;
};

export function PhotoTile({photo, sizes, span, aspect, onOpen}: PhotoTileProps) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const style = span ? ({'--tile-span': String(span), '--tile-aspect': aspect} as CSSProperties) : undefined;

  if (failed) {
    return (
      <div className="relative flex items-center justify-center bg-[#E7E4DE] p-4" style={style}>
        <button
          type="button"
          className="inline-flex min-h-[44px] items-center px-3 text-[14px] font-medium text-[#111315]"
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
    <button
      type="button"
      className="relative block w-full bg-[#E7E4DE] p-0"
      style={style}
      aria-label={`Open ${photo.alt}`}
      onClick={(event) => onOpen(event.currentTarget)}
    >
      <span className="absolute inset-0 overflow-hidden">
        <Image
          key={attempt}
          src={photo.src}
          alt=""
          fill
          sizes={sizes}
          className="object-cover object-center"
          draggable={false}
          onError={() => setFailed(true)}
        />
      </span>
    </button>
  );
}
