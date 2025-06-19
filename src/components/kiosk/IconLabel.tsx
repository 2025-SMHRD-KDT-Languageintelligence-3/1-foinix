import { cn } from '@/lib/utils';
import React from 'react';

interface IconLabelProps {
  icon: React.ReactNode;
  label: string | React.ReactNode;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
}

export function IconLabel({ icon, label, className, iconClassName, labelClassName }: IconLabelProps) {
  return (
    <div className={cn('flex items-center gap-3 text-lg', className)}>
      <div className={cn('text-primary', iconClassName)}>
        {React.cloneElement(icon as React.ReactElement, { size: 28 })}
      </div>
      <span className={cn('font-medium', labelClassName)}>{label}</span>
    </div>
  );
}
