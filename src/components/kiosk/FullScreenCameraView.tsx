
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Language, t as TFunction } from '@/lib/translations';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CameraOff } from 'lucide-react';
import { KioskButton } from './KioskButton';


interface FullScreenCameraViewProps {
  lang: Language;
  t: TFunction;
  onProceedWithoutCamera?: () => void; 
}

export function FullScreenCameraView({ lang, t, onProceedWithoutCamera }: FullScreenCameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null); 
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof navigator.mediaDevices?.getUserMedia !== 'function') {
        console.error("Camera API not supported in this browser/context.");
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
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
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

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black z-[200] flex flex-col items-center justify-center"> 
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline 
      />
      
       { hasCameraPermission === false && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md p-4 flex flex-col items-center gap-4">
            <Alert variant="destructive" className="w-full">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>{t('liveCameraFeed.error.accessDenied.title')}</AlertTitle>
              <AlertDescription>
                {t('liveCameraFeed.noCameraInstruction')}
              </AlertDescription>
            </Alert>
            {onProceedWithoutCamera && (
              <KioskButton
                onClick={onProceedWithoutCamera}
                label={t('fullScreenCamera.button.proceedWithoutCamera')}
                icon={<CameraOff size={24} />}
                variant="secondary"
                className="w-full max-w-xs" 
              />
            )}
        </div>
        )
      }
    </div>
  );
}
