import Image from 'next/image';
import {ArrowDownRight} from 'lucide-react';
import type {WheelCatalogItem} from '../model/types';

type WheelDesignCardProps = {
  item: WheelCatalogItem;
  onOpen: (trigger: HTMLButtonElement) => void;
};

export function WheelDesignCard({item, onOpen}: WheelDesignCardProps) {
  const named = item.kind === 'named-design';
  const action = named ? 'View design' : 'View image';

  return (
    <article className="h-full overflow-hidden rounded-[12px] border border-[#DADAD6] bg-white">
      <button
        type="button"
        onClick={(event) => onOpen(event.currentTarget)}
        aria-haspopup="dialog"
        className="flex h-full w-full cursor-pointer flex-col border-0 bg-white p-0 text-left text-[#111315]"
      >
        <span className="relative block aspect-square bg-white">
          <span className="absolute inset-[9%]">
            <Image
              src={item.image}
              alt=""
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 480px) 46vw, 92vw"
              quality={80}
              className="object-contain"
            />
          </span>
        </span>
        <span className="flex flex-1 flex-col px-[16px] pt-[2px] pb-[16px]">
          {named ? (
            <span className="text-[20px] leading-[1.15] font-medium break-words text-[#111315] [font-family:var(--font-display),sans-serif]">
              {item.label}
            </span>
          ) : null}
          {named && item.categoryLabel ? (
            <span className="mt-[4px] text-[14px] leading-[1.35] text-[#55595E]">{item.categoryLabel}</span>
          ) : null}
          <span className="mt-auto flex items-center justify-between gap-[12px] pt-[12px]">
            <span className="text-[15px] font-medium text-[#111315]">{action}</span>
            <span className="inline-flex size-[40px] shrink-0 items-center justify-center rounded-full border border-[#DADAD6] text-[#111315]">
              <ArrowDownRight aria-hidden className="size-[16px]" />
            </span>
          </span>
        </span>
      </button>
    </article>
  );
}
