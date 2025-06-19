"use client";

import { useState } from 'react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit3 } from 'lucide-react';
import type { Language, t as TFunction } from '@/lib/translations';

interface ManualPlateInputScreenProps {
  onSubmit: (plate: string) => void;
  onCancel: () => void;
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

export function ManualPlateInputScreen({ onSubmit, onCancel, lang, t, onLanguageSwitch }: ManualPlateInputScreenProps) {
  const [plate, setPlate] = useState('');

  const languageButton = (
    <Button
      onClick={onLanguageSwitch}
      variant="outline"
      className="bg-white text-[#1b1f3b] border border-gray-300 rounded-lg text-sm font-bold py-2 px-4 shadow-md hover:bg-gray-100"
    >
      {t("button.languageSwitch")}
    </Button>
  );

  const handleSubmit = () => {
    const trimmed = plate.trim().toUpperCase();
    if (trimmed) {
      onSubmit(trimmed);
    }
  };

  return (
    <FullScreenCard title={t('manualPlateInput.title')} bottomCenterAccessory={languageButton}>
      <Edit3 size={80} className="text-primary mb-6" />
      <p className="text-xl sm:text-2xl text-center mb-6 text-muted-foreground">
        {t('manualPlateInput.instruction')}
      </p>
      <div className="w-full max-w-lg mb-8">
        <Input
          type="text"
          placeholder={t('manualPlateInput.placeholder.plate')}
          value={plate}
          onChange={(e) => setPlate(e.target.value.toUpperCase())}
          className="text-2xl text-center h-14 font-mono tracking-wider bg-input text-card-foreground border-border placeholder:text-muted-foreground"
          aria-label={t('manualPlateInput.title')}
        />
      </div>
      <div className="w-full max-w-md space-y-4">
        <KioskButton onClick={handleSubmit} label={t('manualPlateInput.button.submit')} />
        <KioskButton onClick={onCancel} label={t('button.cancel')} variant="outline" />
      </div>
    </FullScreenCard>
  );
}

