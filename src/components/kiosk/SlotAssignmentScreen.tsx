
"use client";

import { Loader2 } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { Language, t as TFunction } from '@/lib/translations';

interface SlotAssignmentScreenProps {
  isQueue?: boolean;
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

export function SlotAssignmentScreen({ isQueue = false, lang, t, onLanguageSwitch }: SlotAssignmentScreenProps) {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 15));
    }, 400);
    return () => clearInterval(timer);
  }, []);
  
  const title = isQueue ? t("slotAssignment.title.queueCheck") : t("slotAssignment.title.assigning");
  const message = isQueue 
    ? t("slotAssignment.message.queueCheck")
    : t("slotAssignment.message.assigning");

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
      title={title} 
      bottomCenterAccessory={languageButton}
    >
      <Loader2 size={80} className="animate-spin text-primary mb-6" />
      <p className="text-xl sm:text-2xl text-center mb-12 text-muted-foreground">
        {message}
      </p>
      <div className="w-full max-w-md">
        <Progress value={progress} className="h-6 rounded-lg" />
      </div>
      <p className="text-sm text-muted-foreground mt-4 animate-pulse">{t("label.pleaseWait")}</p>
    </FullScreenCard>
  );
}
