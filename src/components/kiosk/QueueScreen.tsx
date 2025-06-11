
"use client";

import { Hourglass } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { Language, t as TFunction } from '@/lib/translations';

interface QueueScreenProps {
  queuePosition: number;
  estimatedWaitTimeKey: string; 
  onCancel: () => void;
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

export function QueueScreen({ queuePosition, estimatedWaitTimeKey, onCancel, lang, t, onLanguageSwitch }: QueueScreenProps) {
  const estimatedWaitTimeDisplay = t(estimatedWaitTimeKey);

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
      title={t("queue.title")} 
      bottomCenterAccessory={languageButton}
    >
      <Hourglass size={80} className="text-primary mb-6" />
      <p className="text-xl sm:text-2xl text-center mb-6 text-muted-foreground">
        {t("queue.message.allOccupied")}
      </p>
      <div className="text-center mb-10 p-6 bg-secondary/20 rounded-lg">
        <p className="text-2xl font-semibold" dangerouslySetInnerHTML={{ __html: t("queue.position", { position: queuePosition }) }} />
        <p className="text-xl mt-2" dangerouslySetInnerHTML={{ __html: t("queue.estimatedWaitTime", { time: estimatedWaitTimeDisplay}) }} />
      </div>
      <p className="text-lg text-center mb-10 text-muted-foreground">
        {t("queue.notificationSoon")}
      </p>
      <KioskButton onClick={onCancel} label={t("queue.button.cancel")} variant="outline" />
    </FullScreenCard>
  );
}
