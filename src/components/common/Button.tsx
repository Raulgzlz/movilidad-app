import type { ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Variant = 'primary' | 'glass' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const sizeMap: Record<Size, string> = {
  sm: 'min-h-[38px] py-1.5 px-3.5 text-xs',
  md: 'min-h-[46px] py-2.5 px-4 text-sm',
  lg: 'min-h-[52px] py-3 px-5 text-sm sm:text-base font-semibold',
  xl: 'min-h-[60px] py-3.5 px-6 text-base font-bold',
};

const variantMap: Record<Variant, string> = {
  primary: 'btn-primary',
  glass: 'btn-glass',
  ghost: 'btn-ghost',
  danger:
    'btn bg-rose-500/90 text-white hover:bg-rose-600 shadow-[0_8px_20px_-6px_rgba(244,63,94,0.5)]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        sizeMap[size],
        variantMap[variant],
        'inline-flex items-center justify-center gap-2 text-center whitespace-normal break-words',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
