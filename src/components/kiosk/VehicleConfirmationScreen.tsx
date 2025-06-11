
"use client";

import { useState } from 'react';
import { CheckCircle2, Edit3 } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { VehicleInfo } from '@/types/kiosk';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Language, t as TFunction } from '@/lib/translations';

interface VehicleConfirmationScreenProps {
  vehicleInfo: VehicleInfo;
  onConfirm: (confirmedVehicleInfo: VehicleInfo) => void;
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

export function VehicleConfirmationScreen({ vehicleInfo, onConfirm, lang, t, onLanguageSwitch }: VehicleConfirmationScreenProps) {
  const [isManualEntryMode, setIsManualEntryMode] = useState(false);
  const [manualPlateInput, setManualPlateInput] = useState("");

  const handleManualSubmit = () => {
    if (manualPlateInput.trim() === "") {
      return;
    }
    onConfirm({
      ...vehicleInfo, 
      licensePlate: manualPlateInput.trim().toUpperCase(),
      confidence: 1.0, 
    });
  };
  
  const vehicleModelDisplay = vehicleInfo.model ? t(vehicleInfo.model) : t('selectCarModel.unknownModel');
  
  const languageButton = (
    <Button
      onClick={onLanguageSwitch}
      variant="outline"
      className="bg-white text-[#1b1f3b] border border-gray-300 rounded-lg text-sm font-bold py-2 px-4 shadow-md hover:bg-gray-100"
    >
      {t("button.languageSwitch")}
    </Button>
  );

  if (isManualEntryMode) {
    return (
      <FullScreenCard title={t("vehicleConfirmation.manualEntryTitle")} bottomCenterAccessory={languageButton}>
        <Edit3 size={80} className="text-primary mb-6" />
        <Card className="w-full max-w-lg mb-10 bg-secondary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-headline">{t("vehicleConfirmation.manualEntryTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <Input
              type="text"
              placeholder={t("vehicleConfirmation.placeholder.plate")}
              value={manualPlateInput}
              onChange={(e) => setManualPlateInput(e.target.value.toUpperCase())}
              className="text-2xl text-center h-14 font-mono tracking-wider"
              aria-label={t("vehicleConfirmation.manualEntryTitle")}
            />
          </CardContent>
        </Card>
        
        <div className="w-full max-w-md space-y-4">
          <KioskButton onClick={handleManualSubmit} label={t("vehicleConfirmation.button.submitPlate")} icon={<CheckCircle2 />} />
          <KioskButton onClick={() => setIsManualEntryMode(false)} label={t("vehicleConfirmation.button.backToScan")} variant="outline" />
        </div>
      </FullScreenCard>
    );
  }

  return (
    <FullScreenCard title={t("vehicleConfirmation.title")} bottomCenterAccessory={languageButton}>
      <CheckCircle2 size={80} className="text-green-500 mb-6" />
      <Card className="w-full max-w-lg mb-10 bg-secondary/20 border-secondary shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-headline">{t("vehicleConfirmation.question")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-4xl font-bold font-mono text-primary tracking-wider">{vehicleInfo.licensePlate}</p>
          <p className="text-xl text-muted-foreground">{t("vehicleConfirmation.label.model")}: {vehicleModelDisplay}</p>
          {vehicleInfo.confidence !== undefined && (
             <p className="text-sm text-muted-foreground">{t("vehicleConfirmation.label.confidence")}: {(vehicleInfo.confidence * 100).toFixed(0)}%</p>
          )}
        </CardContent>
      </Card>
      
      <div className="w-full max-w-md space-y-4">
        <KioskButton onClick={() => onConfirm(vehicleInfo)} label={t("vehicleConfirmation.button.confirm")} icon={<CheckCircle2 />} />
        <KioskButton onClick={() => setIsManualEntryMode(true)} label={t("vehicleConfirmation.button.manualEntry")} variant="outline" icon={<Edit3 />} />
      </div>
    </FullScreenCard>
  );
}
