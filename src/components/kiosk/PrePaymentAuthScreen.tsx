
"use client";

import { CreditCard, Nfc } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import type { Language, t as TFunction } from '@/lib/translations';
import { useTTS } from '@/hooks/useTTS';

interface PrePaymentAuthScreenProps {
  onAuthSuccess: () => void;
  onCancel: () => void;
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

export function PrePaymentAuthScreen({ onAuthSuccess, onCancel, lang, t, onLanguageSwitch }: PrePaymentAuthScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMethod, setProcessingMethod] = useState<'card' | 'nfc' | null>(null);
  const { speak } = useTTS();
  useEffect(() => {
    speak("결제를 진행하기 전에 인증을 완료해 주세요.");
  }, []);

  const handleSimulatePayment = (method: 'card' | 'nfc') => {
    setProcessingMethod(method);
    setIsProcessing(true);
    setTimeout(() => {
      onAuthSuccess();
      setIsProcessing(false); 
      setProcessingMethod(null);
    }, 2000);
  };
  
  const languageButton = (
    <Button
      onClick={onLanguageSwitch}
      variant="outline"
      className="bg-white text-[#1b1f3b] border border-gray-300 rounded-lg text-sm font-bold py-2 px-4 shadow-md hover:bg-gray-100"
    >
      {t("button.languageSwitch")}
    </Button>
  );

  if (isProcessing) {
    const ProcessingIcon = processingMethod === 'card' ? CreditCard : Nfc;
    return (
      <FullScreenCard 
        title={t("prePaymentAuth.processingTitle")}
        bottomCenterAccessory={languageButton}
      >
        <ProcessingIcon size={80} className="animate-ping text-primary mb-6" />
        <p className="text-xl sm:text-2xl text-center mb-10 text-muted-foreground">
          {t("prePaymentAuth.processingMessage")}
        </p>
        <div className="w-full max-w-xs">
            <div className="animate-pulse flex flex-col items-center space-y-4">
                <ProcessingIcon size={64} className="text-primary" />
                <p className="text-lg text-muted-foreground">{t("prePaymentAuth.processingSecurityCheck")}</p>
            </div>
        </div>
      </FullScreenCard>
    );
  }

  return (
    <FullScreenCard 
      title={t("prePaymentAuth.title")}
      bottomCenterAccessory={languageButton}
    >
      <CreditCard size={80} className="text-primary mb-6" />
      <p className="text-xl sm:text-2xl text-center mb-8 text-muted-foreground px-4">
        {t("prePaymentAuth.instruction")}
      </p>
      
      <div className="w-full flex flex-col sm:flex-row justify-center items-stretch gap-6 mb-10 px-4 sm:px-0">
        <div className="w-full sm:max-w-md p-6 border-2 border-dashed border-primary rounded-lg bg-input text-center">
          <CreditCard size={48} className="text-primary mx-auto mb-3" />
          <h3 className="text-xl font-semibold mb-2 text-card-foreground">{t("prePaymentAuth.cardReader.title")}</h3>
          <p className="text-card-foreground">{t("prePaymentAuth.cardReader.instruction")}</p>
        </div>
        
        <div className="w-full sm:max-w-md p-6 border-2 border-dashed border-primary rounded-lg bg-input text-center">
          <Nfc size={48} className="text-primary mx-auto mb-3" />
          <h3 className="text-xl font-semibold mb-2 text-card-foreground">{t("prePaymentAuth.contactless.title")}</h3>
          <p className="text-card-foreground">{t("prePaymentAuth.contactless.instruction")}</p>
        </div>
      </div>

      <div className="w-full space-y-4 flex flex-col items-center px-4 sm:px-0">
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-center" style={{ maxWidth: 'calc(2 * 28rem + 1rem)' }}> {/* 2*max-w-md + gap-4 (1rem) */}
          <KioskButton 
            onClick={() => handleSimulatePayment('card')} 
            label={t("prePaymentAuth.button.authWithCard")}
            icon={<CreditCard />} 
            className="w-full sm:flex-1" // KioskButton has max-w-md
          />
          <KioskButton 
            onClick={() => handleSimulatePayment('nfc')} 
            label={t("prePaymentAuth.button.authWithNFC")}
            icon={<Nfc />} 
            variant="secondary"
            className="w-full sm:flex-1" // KioskButton has max-w-md
          />
        </div>
        <div className="w-full" style={{ maxWidth: '28rem' }}> {/* Wrapper to ensure cancel button respects max-w-md for centering */}
          <KioskButton onClick={onCancel} label={t("button.cancel")} variant="outline" /> {/* KioskButton is w-full max-w-md */}
        </div>
      </div>
    </FullScreenCard>
  );
}
