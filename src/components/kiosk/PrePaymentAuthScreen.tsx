
"use client";

import { CreditCard, Nfc } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { Language, t as TFunction } from '@/lib/translations';

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
      <p className="text-xl sm:text-2xl text-center mb-8 text-muted-foreground">
        {t("prePaymentAuth.instruction")}
      </p>
      
      <div className="w-full max-w-lg space-y-8 mb-10">
        <div className="p-6 border-2 border-dashed border-primary rounded-lg bg-muted/30 text-center">
          <CreditCard size={48} className="text-primary mx-auto mb-3" />
          <h3 className="text-xl font-semibold mb-2">{t("prePaymentAuth.cardReader.title")}</h3>
          <p className="text-muted-foreground">{t("prePaymentAuth.cardReader.instruction")}</p>
        </div>
        
        <div className="p-6 border-2 border-dashed border-secondary rounded-lg bg-muted/30 text-center">
          <Nfc size={48} className="text-secondary mx-auto mb-3" />
          <h3 className="text-xl font-semibold mb-2">{t("prePaymentAuth.contactless.title")}</h3>
          <p className="text-muted-foreground">{t("prePaymentAuth.contactless.instruction")}</p>
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        <KioskButton 
          onClick={() => handleSimulatePayment('card')} 
          label={t("prePaymentAuth.button.authWithCard")}
          icon={<CreditCard />} 
        />
        <KioskButton 
          onClick={() => handleSimulatePayment('nfc')} 
          label={t("prePaymentAuth.button.authWithNFC")}
          icon={<Nfc />} 
          variant="secondary"
        />
        <KioskButton onClick={onCancel} label={t("button.cancel")} variant="outline" className="mt-6" />
      </div>
    </FullScreenCard>
  );
}
