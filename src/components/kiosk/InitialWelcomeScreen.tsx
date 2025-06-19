
"use client";

import { Handshake, PlayCircle } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { Language } from '@/lib/translations';
import { useEffect } from 'react';
import { useTTS } from '@/hooks/useTTS';
import { useRouter } from 'next/navigation';

interface InitialWelcomeScreenProps {
  onProceedStandard: () => void;
  lang: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
  onLanguageSwitch: () => void;
}

export function InitialWelcomeScreen({ onProceedStandard, lang, t, onLanguageSwitch }: InitialWelcomeScreenProps) {
  const router = useRouter();
  const { speak } = useTTS();
  useEffect(() => {
    speak("EV 충전 서비스를 시작합니다. 화면을 터치하거나 ‘시작’이라고 말씀해주세요.");
  }, []);
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
        <Button
          onClick={() => router.push('/manual-plate-input')}
          className="w-full text-white bg-blue-800 hover:bg-blue-700"
        >
          ⚡ 빠른 시작
        </Button>
      </div>
      {/* Removed the auto-switch message paragraph */}
    </FullScreenCard>
  );
}
