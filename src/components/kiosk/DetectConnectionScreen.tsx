
"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { Language, t as TFunction } from '@/lib/translations';

interface DetectConnectionScreenProps {
  vehicleModelKey: string; 
  onDetectionComplete: () => void;
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

export function DetectConnectionScreen({ vehicleModelKey, onDetectionComplete, lang, t, onLanguageSwitch }: DetectConnectionScreenProps) {
  const [status, setStatus] = useState<'detecting' | 'success'>('detecting');
  const [progressValue, setProgressValue] = useState(10); 

  const vehicleModelDisplay = t(vehicleModelKey);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;
    if (status === 'detecting') {
      const increment = 100 / (4 / 0.5); 
      timer = setInterval(() => {
        setProgressValue((prev) => {
          if (prev >= 95) { 
            if(timer) clearInterval(timer);
            setStatus('success');
            setTimeout(onDetectionComplete, 1500); 
            return 100;
          }
          return prev + increment;
        });
      }, 500);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [status, onDetectionComplete]);

  const CurrentIcon = status === 'detecting' ? Loader2 : CheckCircle;
  const iconClassName = status === 'detecting' ? "animate-spin text-primary" : "text-green-500";

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
      title={status === 'detecting' ? t("detectConnection.title.detecting") : t("detectConnection.title.success")}
      bottomCenterAccessory={languageButton}
    >
      <CurrentIcon size={80} className={`${iconClassName} mb-6`} />
      {status === 'detecting' ? (
        <>
          <p className="text-xl sm:text-2xl text-center mb-10 text-muted-foreground">
            {t("detectConnection.message.detecting", { vehicleModel: vehicleModelDisplay })}
          </p>
          <div className="w-full max-w-md">
            <Progress value={progressValue} className="h-6 rounded-lg" />
          </div>
        </>
      ) : (
        <>
          <p className="text-xl sm:text-2xl text-center mb-10 text-green-600">
            {t("detectConnection.message.success", { vehicleModel: vehicleModelDisplay })}
          </p>
          <p className="text-lg text-muted-foreground animate-pulse">{t("detectConnection.message.proceeding")}</p>
        </>
      )}
    </FullScreenCard>
  );
}
