
"use client";

import Image from 'next/image';
import { ReceiptText, Smile, Clock, Map } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Language, t as TFunction } from '@/lib/translations';

interface ThankYouScreenProps {
  receiptType?: 'sms' | 'none';
  onNewSession: () => void;
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

const AUTO_RESET_SECONDS = 60;

export function ThankYouScreen({ receiptType, onNewSession, lang, t, onLanguageSwitch }: ThankYouScreenProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(AUTO_RESET_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  let receiptMessageKey = "thankYou.message.enjoyCharge";
  if (receiptType === 'sms') {
    receiptMessageKey = "thankYou.message.smsSent";
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

  const handleMore = () => {
    router.push('/map', { shallow: true });
  };

  return (
    <FullScreenCard 
      title={t("thankYou.title")} 
      bottomCenterAccessory={languageButton}
    >
      <Smile size={80} className="text-primary mb-6"/>
      <p className="text-xl sm:text-2xl text-center mb-8 text-muted-foreground">
        {t(receiptMessageKey)}
      </p>
      
      {/* QR Code display logic removed */}

      <ReceiptText size={100} className="text-secondary mb-10 opacity-50" />

      <KioskButton onClick={onNewSession} label={t("thankYou.button.newSession")} />
      <Button
        variant="outline"
        onClick={handleMore}
        className="bg-card text-primary border-primary hover:bg-primary/10 text-lg py-3 px-6 mt-4 flex items-center gap-2"
      >
        {t("thankYou.button.more")}
        <Map className="ml-2 h-5 w-5" />
      </Button>
      
      <div className="flex items-center text-sm text-muted-foreground mt-6">
        <Clock size={16} className="mr-2"/>
        <span>{t("thankYou.autoResetMessage", { seconds: Math.max(0, countdown) })}</span>
      </div>
    </FullScreenCard>
  );
}
