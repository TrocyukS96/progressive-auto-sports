'use client';

import * as Dialog from '@radix-ui/react-dialog';
import {X} from 'lucide-react';
import type {ComponentProps} from 'react';
import {cn} from '@/src/shared/lib/cn';

export function Sheet(props: ComponentProps<typeof Dialog.Root>) {
  return <Dialog.Root {...props} />;
}

export function SheetTrigger(props: ComponentProps<typeof Dialog.Trigger>) {
  return <Dialog.Trigger {...props} />;
}

type SheetContentProps = ComponentProps<typeof Dialog.Content> & {
  title: string;
};

export function SheetContent({className, children, title, ...props}: SheetContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/60" />
      <Dialog.Content
        className={cn(
          'fixed top-0 right-0 z-[80] flex h-full w-[min(100%,320px)] flex-col bg-[#111315] px-[24px] py-[20px] text-[#F8F8F8] focus:outline-none',
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <Dialog.Title className="m-0 text-[18px] font-medium text-[#F8F8F8] [font-family:var(--font-display),sans-serif]">
            {title}
          </Dialog.Title>
          <Dialog.Close
            className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#F8F8F8]"
            aria-label="Close menu"
          >
            <X aria-hidden className="size-[20px]" />
          </Dialog.Close>
        </div>
        <Dialog.Description className="sr-only">Primary navigation</Dialog.Description>
        <div className="mt-[24px] flex flex-col">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
