"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import React from 'react';

interface MapModalProps {
  children?: React.ReactNode;
}

export function MapModal({ children }: MapModalProps) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
        {children}
        <div className="mt-4 flex justify-end">
          <Button onClick={() => router.back()}>뒤로가기</Button>
        </div>
      </div>
    </div>
  );
}
