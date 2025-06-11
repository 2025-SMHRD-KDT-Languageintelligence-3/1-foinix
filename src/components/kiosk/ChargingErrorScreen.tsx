
"use client";

import { AlertTriangle } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { Language, t as TFunction } from '@/lib/translations';

interface ChargingErrorScreenProps {
  errorMessage: string | null;
  onRetry: () => void;
  onCancel: () => void;
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

export function ChargingErrorScreen({ 
  errorMessage, 
  onRetry, 
  onCancel, 
  lang, 
  t,
  onLanguageSwitch 
}: ChargingErrorScreenProps) {
  
  const displayMessage = errorMessage || t("chargingError.messageDefault");

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
      title={t("chargingError.title")}
      bottomCenterAccessory={languageButton}
    >
      <AlertTriangle size={80} className="text-destructive mb-6" />
      <p className="text-xl sm:text-2xl text-center my-8 text-muted-foreground">
        {displayMessage}
      </p>
      
      <div className="w-full max-w-md space-y-4">
        <KioskButton 
          onClick={onRetry} 
          label={t("chargingError.button.retry")} 
          variant="default" 
        />
        <KioskButton 
          onClick={onCancel} 
          label={t("button.cancel")} 
          variant="outline" 
        />
      </div>
    </FullScreenCard>
  );
}
