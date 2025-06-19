
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Loader2, AlertTriangle } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Language } from '@/lib/translations';
import { useToast } from "@/hooks/use-toast";
import { KioskButton } from './KioskButton';

interface LiveCameraFeedScreenProps {
  onScanComplete: () => void;
  lang: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
  onLanguageSwitch: () => void;
}

export function LiveCameraFeedScreen({ onScanComplete, lang, t, onLanguageSwitch }: LiveCameraFeedScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof navigator.mediaDevices?.getUserMedia !== 'function') {
        console.warn("Camera API not supported in this browser/context.");
        setHasCameraPermission(false); 
        toast({
          variant: 'destructive',
          title: t('liveCameraFeed.error.apiNotSupported.title'),
          description: t('liveCameraFeed.error.apiNotSupported.description'),
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: t('liveCameraFeed.error.accessDenied.title'),
          description: t('liveCameraFeed.error.accessDenied.description'),
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [t, toast]);

  const languageButton = (
    <Button
      onClick={onLanguageSwitch}
      variant="outline"
      className="bg-white text-[#1b1f3b] border border-gray-300 rounded-lg text-sm font-bold py-2 px-4 shadow-md hover:bg-gray-100"
    >
      {t("button.languageSwitch")}
    </Button>
  );

  return (
    <FullScreenCard
      title={t("liveCameraFeed.title")}
      bottomCenterAccessory={languageButton}
    >
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="relative w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden shadow-lg mb-6">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          {hasCameraPermission === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white p-4">
              <Camera size={64} className="mb-4 text-red-400" />
              <p className="text-lg font-semibold">{t('liveCameraFeed.noCameraAccess')}</p>
              <p className="text-sm text-center">{t('liveCameraFeed.noCameraInstruction')}</p>
            </div>
          )}
           {hasCameraPermission === null && ( 
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
              <Loader2 size={48} className="animate-spin mb-4" />
              <p>{t('liveCameraFeed.initializingCamera')}</p>
            </div>
          )}
        </div>
        
        <KioskButton
          onClick={onScanComplete}
          label={t("liveCameraFeed.button.simulateScan")}
          className="mt-4"
        />
        
      </div>
    </FullScreenCard>
  );
}
