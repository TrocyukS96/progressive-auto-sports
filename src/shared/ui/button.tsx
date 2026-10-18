import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import type {ButtonHTMLAttributes} from 'react';
import {cn} from '@/src/shared/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-[8px] whitespace-nowrap rounded-full border text-[14px] font-medium leading-none no-underline transition-colors duration-[400ms] cursor-pointer motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] disabled:pointer-events-none',
  {
    variants: {
      variant: {
        outline:
          'border-[#F8F8F8] bg-transparent text-[#F8F8F8] hover:bg-[#F8F8F8] hover:text-[#111315] focus-visible:outline-[#F8F8F8]',
        accent:
          'border-transparent bg-[#CD202B] text-[#FFFFFF] hover:bg-[#B01C26] focus-visible:outline-[#F8F8F8]',
        ghost:
          'border-transparent bg-transparent text-[#F8F8F8] hover:bg-white/10 focus-visible:outline-[#F8F8F8]',
      },
      size: {
        default: 'h-[44px] px-[18px]',
        icon: 'h-[44px] w-[44px] p-0',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({className, variant, size, asChild = false, type, ...props}: ButtonProps) {
  const classes = cn(buttonVariants({variant, size}), className);
  if (asChild) {
    return <Slot className={classes} {...props} />;
  }
  return <button className={classes} type={type ?? 'button'} {...props} />;
}
