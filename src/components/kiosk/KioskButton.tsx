"use client";

import React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KioskButtonProps extends ButtonProps {
  icon?: React.ReactNode;
  label: string;
}

const KioskButton = React.forwardRef<HTMLButtonElement, KioskButtonProps>(
  ({ className, icon, label, children, variant = 'default', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'h-auto min-h-[72px] w-full max-w-md rounded-xl px-8 py-5 text-2xl font-bold shadow-lg transform active:scale-95 transition-transform duration-150 ease-in-out',
          'flex items-center justify-center gap-3',
          variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
          variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
          variant === 'outline' && 'border-2 border-primary text-primary bg-transparent hover:bg-primary/10',
          className
        )}
        {...props}
      >
        {icon}
        <span>{label}</span>
        {children}
      </Button>
    );
  }
);

KioskButton.displayName = 'KioskButton';

export { KioskButton };
