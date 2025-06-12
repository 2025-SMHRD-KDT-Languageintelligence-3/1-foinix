
"use client";

import { useEffect, useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { Button } from '@/components/ui/button';
import { LocalBusinessDisplay } from './LocalBusinessDisplay';
import type { Language, t as TFunction } from '@/lib/translations';

interface VacateSlotReminderScreenProps {
  onDismiss: () => void; 
  lang: Language;
  t: typeof TFunction;
  isQueueNotEmpty?: boolean; 
  onLanguageSwitch: () => void;
}

const AUTO_DISMISS_SECONDS = 3 * 60;

export function VacateSlotReminderScreen({ onDismiss, lang, t, isQueueNotEmpty, onLanguageSwitch }: VacateSlotReminderScreenProps) {
  const [countdown, setCountdown] = useState(AUTO_DISMISS_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // onDismiss is handled by KioskPage's general timer
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); 

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timeDisplay = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

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
      title={t("vacateSlot.title")}
      bottomCenterAccessory={languageButton}
    >
      <div className="w-full flex flex-col items-center">
        <AlertTriangle size={60} className="text-yellow-500 mb-3" />
        <p className="text-2xl font-bold text-center mb-1">{t("vacateSlot.static.actionNeededText")}</p>
        
        <p className="text-xl sm:text-2xl text-center mb-4 text-muted-foreground mt-6">
          {t("vacateSlot.message.vacateIn", { time: timeDisplay })}
        </p>

        <div className="w-full max-w-5xl px-4">
          <LocalBusinessDisplay lang={lang} t={t} />
        </div>
        
        <p className="mt-8 text-lg text-muted-foreground text-center">
          {t("vacateSlot.tip.enjoySnack")}
        </p>

        <div className="flex items-center text-sm text-muted-foreground mt-6">
          <Clock size={16} className="mr-2"/>
          <span>{t("vacateSlot.message.autoClose")}</span>
        </div>
      </div>
    </FullScreenCard>
  );
}
