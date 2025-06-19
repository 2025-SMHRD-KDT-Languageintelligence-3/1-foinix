  "use client";

  import React, { useEffect, useRef, useState } from 'react';
  import { useToast } from "@/hooks/use-toast";
  import type { Language } from '@/lib/translations';
  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
  import { AlertTriangle, CameraOff } from 'lucide-react';
  import { KioskButton } from './KioskButton';

  interface FullScreenCameraViewProps {
    lang: Language;
    t: (key: string, params?: Record<string, string | number>) => string;
    onProceedWithoutCamera?: () => void;
  }

  export function FullScreenCameraView({ lang, t, onProceedWithoutCamera }: FullScreenCameraViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null); 
    const { toast } = useToast();

    const captureAndSendToBackend = async () => {
      if (!videoRef.current) return;

      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (!context) return;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        try {
          const res = await fetch("http://localhost:8000/api/ocr/upload", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          toast({
            title: "OCR 결과",
            description: data.result,
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "FastAPI 서버 오류",
            description: "FastAPI에 연결하지 못했습니다.",
          });
          console.error("FastAPI 연결 실패:", error);
        }
      }, "image/jpeg");
    };

    useEffect(() => {
      const setupCamera = async () => {
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

        const DROIDCAM_DEVICE_ID: string | null = null;

        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          console.log('사용 가능한 비디오 입력 장치:', videoDevices);

          const videoConstraints: MediaStreamConstraints['video'] = DROIDCAM_DEVICE_ID
            ? { deviceId: { exact: DROIDCAM_DEVICE_ID } }
            : true;

          const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasCameraPermission(true);
        } catch (error) {
          console.error('카메라 접근 오류:', error);
          setHasCameraPermission(false);
          let descriptionKey = 'liveCameraFeed.error.accessDenied.description';

          if (error instanceof Error) {
            if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
              descriptionKey = DROIDCAM_DEVICE_ID ? 'liveCameraFeed.error.accessDenied.description' : 'liveCameraFeed.noCameraInstruction';
            } else if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
              descriptionKey = 'liveCameraFeed.error.accessDenied.description';
            } else {
              console.error(`Unexpected camera error: ${error.message}`);
            }
          }

          toast({
            variant: 'destructive',
            title: t('liveCameraFeed.error.accessDenied.title'), 
            description: t(descriptionKey),
          });
        }
      };

      setupCamera();

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

      {hasCameraPermission === true && (
        <KioskButton
          onClick={captureAndSendToBackend}
          label="촬영 및 서버 전송"
          className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
        />
      )}

        
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
                className="w-full max-w-xs bg-sky-200 text-sky-700 hover:bg-sky-300 focus-visible:ring-sky-400 dark:bg-sky-200 dark:text-sky-700 dark:hover:bg-sky-300 dark:focus-visible:ring-sky-400" 
              />
            )}
          </div>
        )}
      </div>
    );
  }
