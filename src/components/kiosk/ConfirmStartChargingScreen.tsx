
"use client";

import { useEffect, useState, useRef } from 'react';
import { PlayCircle, Timer } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { Language, t as TFunction } from '@/lib/translations';

interface ConfirmStartChargingScreenProps {
  onStart: () => void;
  onCancel: () => void;
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

const COUNTDOWN_SECONDS = 10;

export function ConfirmStartChargingScreen({ onStart, onCancel, lang, t, onLanguageSwitch }: ConfirmStartChargingScreenProps) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          onStart(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onStart]);

  const handleManualStart = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onStart();
  };

  const handleManualCancel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onCancel();
  }

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
      title={t("confirmStartCharging.title")}
      bottomCenterAccessory={languageButton}
    >
      <PlayCircle size={80} className="text-primary mb-6" />
      <p className="text-xl sm:text-2xl text-center mb-6 text-muted-foreground">
        {t("confirmStartCharging.instruction")}
      </p>
      
      <div className="my-8 p-6 bg-secondary/20 rounded-lg shadow-md w-full max-w-xs text-center">
        <Timer size={48} className="text-primary mx-auto mb-2" />
        <p className="text-5xl font-bold text-primary">{countdown}</p>
        <p className="text-lg text-muted-foreground">{t("confirmStartCharging.autoStartMessage")}</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <KioskButton onClick={handleManualStart} label={t("confirmStartCharging.button.startNow")} className="bg-green-600 hover:bg-green-700"/>
        <KioskButton onClick={handleManualCancel} label={t("button.cancel")} variant="outline" />
      </div>
    </FullScreenCard>
  );
}
