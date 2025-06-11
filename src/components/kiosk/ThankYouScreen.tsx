
"use client";

import Image from 'next/image';
import { ReceiptText, Smile, Clock } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { Language, t as TFunction } from '@/lib/translations';

interface ThankYouScreenProps {
  receiptType?: 'sms' | 'qr' | 'none';
  onNewSession: () => void;
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

const AUTO_RESET_SECONDS = 60;

export function ThankYouScreen({ receiptType, onNewSession, lang, t, onLanguageSwitch }: ThankYouScreenProps) {
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
  } else if (receiptType === 'qr') {
    receiptMessageKey = "thankYou.message.qrScan";
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
      title={t("thankYou.title")} 
      bottomCenterAccessory={languageButton}
    >
      <Smile size={80} className="text-primary mb-6"/>
      <p className="text-xl sm:text-2xl text-center mb-8 text-muted-foreground">
        {t(receiptMessageKey)}
      </p>
      
      {receiptType === 'qr' && (
        <div className="mb-10 p-4 bg-white rounded-lg shadow-md">
          <Image 
            src="https://placehold.co/250x250.png" 
            alt={t("thankYou.alt.qrCode")}
            width={250} 
            height={250} 
            data-ai-hint="qr code"
          />
        </div>
      )}

      {receiptType !== 'qr' && <ReceiptText size={100} className="text-secondary mb-10 opacity-50" />}

      <KioskButton onClick={onNewSession} label={t("thankYou.button.newSession")} />
      
      <div className="flex items-center text-sm text-muted-foreground mt-6">
        <Clock size={16} className="mr-2"/>
        <span>{t("thankYou.autoResetMessage", { seconds: Math.max(0, countdown) })}</span>
      </div>
    </FullScreenCard>
  );
}
