
"use client";

import { Suspense } from 'react';
import StoreMapContent from '../../components/kiosk/StoreMapContent';
import { Loader2 } from 'lucide-react';

export default function StoreMapPage() {
  return (
    <Suspense 
      fallback={
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-xl text-muted-foreground">Loading map data...</p>
        </div>
      }
    >
      <StoreMapContent />
    </Suspense>
  );
}
