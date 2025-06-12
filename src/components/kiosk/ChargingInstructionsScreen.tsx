
"use client";

import { Zap, Info } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { ChargingInstructions } from '@/types/kiosk';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import type { Language, t as TFunction } from '@/lib/translations';


interface ChargingInstructionsScreenProps {
  slotNumber: string;
  instructions: ChargingInstructions;
  vehicleModel: string;
  onStartCharging: () => void;
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

const CHARGER_TYPES = {
  AC: "AC 충전기",
  DC: "DC 급속 충전기",
} as const;

type ChargerTypeValue = typeof CHARGER_TYPES[keyof typeof CHARGER_TYPES];


export function ChargingInstructionsScreen({ slotNumber, instructions, vehicleModel, onStartCharging, lang, t, onLanguageSwitch }: ChargingInstructionsScreenProps) {
  const [selectedChargerType, setSelectedChargerType] = useState<ChargerTypeValue>((instructions.chargerType === "AC" || instructions.chargerType === "AC Charger") ? CHARGER_TYPES.AC : CHARGER_TYPES.DC);

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
      title={\`\${slotNumber}번 슬롯으로 진행하세요\`}
      bottomCenterAccessory={languageButton}
    >
      <Zap size={80} className="text-primary mb-6" />
      <p className="text-xl sm:text-2xl text-center mb-8 text-muted-foreground">
        <span className="font-bold text-primary">{vehicleModel}</span>에 대한 다음 지침을 따르십시오:
      </p>
      
      <Card className="w-full max-w-2xl mb-10 bg-background shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Info size={28} className="text-secondary"/>
            충전 가이드
          </CardTitle>
          <CardDescription>차량 및 충전에 대한 주요 세부 정보입니다. (이 화면은 새 흐름에서 제거/통합될 수 있습니다)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-lg font-semibold text-primary">충전기 유형:</p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setSelectedChargerType(CHARGER_TYPES.AC)}
                variant={selectedChargerType === CHARGER_TYPES.AC ? "default" : "outline"}
                className="text-base py-6 h-auto"
              >
                {CHARGER_TYPES.AC}
                <span className="block text-xs font-normal mt-1">(예: 레벨 2)</span>
              </Button>
              <Button
                onClick={() => setSelectedChargerType(CHARGER_TYPES.DC)}
                variant={selectedChargerType === CHARGER_TYPES.DC ? "default" : "outline"}
                className="text-base py-6 h-auto"
              >
                {CHARGER_TYPES.DC}
                 <span className="block text-xs font-normal mt-1">(예: 레벨 3)</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              AI 추천: <span className="font-medium">{(instructions.chargerType === "AC" || instructions.chargerType === "AC Charger") ? CHARGER_TYPES.AC : CHARGER_TYPES.DC}</span>
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                작동 지침
              </AccordionTrigger>
              <AccordionContent className="text-base whitespace-pre-line leading-relaxed p-2 bg-muted/30 rounded-md">
                {instructions.operationalInstructions}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <KioskButton onClick={onStartCharging} label="플러그를 꽂았습니다, 충전 시작" />
    </FullScreenCard>
  );
}
