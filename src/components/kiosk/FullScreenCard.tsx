
import { cn } from '@/lib/utils';
import React from 'react';

interface FullScreenCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string | React.ReactNode;
  bottomCenterAccessory?: React.ReactNode; // New prop for bottom centered content
}

export function FullScreenCard({ children, className, title, bottomCenterAccessory }: FullScreenCardProps) {
  return (
    <div className={cn(
      'w-full h-full flex flex-col bg-card text-card-foreground animate-fade-in', // Root is flex-col
      className
    )}>
      {/* Main scrollable content area */}
      <div className="flex-grow w-full flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
        {title && <h1 className="text-4xl sm:text-5xl font-headline font-bold mb-8 text-center">{title}</h1>}
        <div className="w-full flex flex-col items-center">
          {children}
        </div>
      </div>

      {/* Bottom center accessory area */}
      {bottomCenterAccessory && (
        <div className="w-full py-4 px-6 flex justify-center items-center border-t border-border/30 shrink-0">
          {bottomCenterAccessory}
        </div>
      )}
    </div>
  );
}
