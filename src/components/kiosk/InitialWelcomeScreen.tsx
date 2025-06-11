
"use client";

import { Handshake, PlayCircle, Zap } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { Language, t as TFunction } from '@/lib/translations';

interface InitialWelcomeScreenProps {
  onProceedStandard: () => void;
  onProceedQuick: () => void;
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

export function InitialWelcomeScreen({ onProceedStandard, onProceedQuick, lang, t, onLanguageSwitch }: InitialWelcomeScreenProps) {
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
      title={t("initialWelcome.title")}
      className="animate-fade-in"
      bottomCenterAccessory={languageButton}
    >
      <Handshake size={80} className="text-primary my-8" />
      <p className="text-2xl sm:text-3xl text-center mb-10 text-muted-foreground">
        {t("initialWelcome.greeting")}
      </p>
      <div className="w-full max-w-md space-y-4 mb-6">
        <KioskButton
          onClick={onProceedStandard}
          label={t("initialWelcome.proceedButtonStandard")}
          icon={<PlayCircle />}
        />
        <KioskButton
          onClick={onProceedQuick}
          label={t("initialWelcome.proceedButtonQuick")}
          icon={<Zap />}
          variant="secondary"
        />
      </div>
      <p className="text-lg text-muted-foreground animate-pulse">
        {t("initialWelcome.autoSwitchMessage")}
      </p>
    </FullScreenCard>
  );
}
