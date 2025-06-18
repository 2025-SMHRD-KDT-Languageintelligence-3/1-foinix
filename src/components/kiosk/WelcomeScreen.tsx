
"use client";

import { CarFront, Loader2 } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { Button } from '@/components/ui/button';
import type { Language, t as TFunction } from '@/lib/translations';

interface WelcomeScreenProps {
  lang: Language;
  t: typeof TFunction;
  quickMode?: boolean;
  onLanguageSwitch: () => void;
}

export function WelcomeScreen({ lang, t, quickMode = false, onLanguageSwitch }: WelcomeScreenProps) {
  const messageKey = quickMode ? "welcome.quickModeMessage" : "welcome.message";

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
      title={t("welcome.title")}
      bottomCenterAccessory={languageButton}
    >
      <CarFront size={80} className="text-primary mb-6" />
      <Loader2 size={64} className="text-primary my-8 animate-spin" />
      <p className="text-xl sm:text-2xl text-center mb-12 text-muted-foreground max-w-2xl">
        {t(messageKey)}
      </p>
    </FullScreenCard>
  );
}
