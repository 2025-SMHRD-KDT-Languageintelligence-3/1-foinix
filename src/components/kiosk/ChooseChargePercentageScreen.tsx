
"use client";

import { BatteryCharging } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { Language, t as TFunction } from '@/lib/translations';

interface ChooseChargePercentageScreenProps {
  onPercentageSelect: (percentage: 80 | 90 | 100) => void;
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

export function ChooseChargePercentageScreen({ onPercentageSelect, lang, t, onLanguageSwitch }: ChooseChargePercentageScreenProps) {
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
      title={t("목표 충전량 선택 (사용되지 않음)")}
      bottomCenterAccessory={languageButton}
    >
      <BatteryCharging size={80} className="text-primary mb-6" />
      <p className="text-xl sm:text-2xl text-center mb-10 text-muted-foreground">
        이 화면은 더 이상 사용되지 않습니다.
      </p>
      
      <div className="w-full max-w-md space-y-6">
        <KioskButton onClick={() => onPercentageSelect(80)} label="80%에서 중지" variant="outline" className="text-2xl py-8"/>
        <KioskButton onClick={() => onPercentageSelect(90)} label="90%에서 중지" variant="outline" className="text-2xl py-8"/>
        <KioskButton onClick={() => onPercentageSelect(100)} label="100%에서 중지 (완충)" variant="outline" className="text-2xl py-8"/>
      </div>
       <p className="text-sm text-muted-foreground mt-8 text-center">
        다음 화면에서 언제든지 수동으로 충전을 중지할 수 있습니다.
      </p>
    </FullScreenCard>
  );
}
