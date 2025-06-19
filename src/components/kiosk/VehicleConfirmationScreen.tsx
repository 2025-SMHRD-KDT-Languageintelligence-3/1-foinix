"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Edit3 } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { VehicleInfo } from '@/types/kiosk';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Language } from '@/lib/translations';
import { useTTS } from '@/hooks/useTTS';

interface VehicleConfirmationScreenProps {
  vehicleInfo: VehicleInfo;
  onConfirm: (confirmedVehicleInfo: VehicleInfo) => void;
  onSelectCarModelManually: () => void; // 🔥 부모 컴포넌트에서 필수로 넘겨줘야 함
  lang: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
  onLanguageSwitch: () => void;
}

export function VehicleConfirmationScreen({
  vehicleInfo,
  onConfirm,
  onSelectCarModelManually,
  lang,
  t,
  onLanguageSwitch,
}: VehicleConfirmationScreenProps) {
  const router = useRouter();
  const [isManualEntryMode, setIsManualEntryMode] = useState(false);
  const [manualPlateInput, setManualPlateInput] = useState("");
  const { speak } = useTTS();
  useEffect(() => {
    speak("차량 번호가 맞으신가요? 예 또는 아니요를 눌러주세요.");
  }, []);

  const handleManualSubmit = () => {
  if (manualPlateInput.trim() === "") return;

  const updatedVehicle: VehicleInfo = {
    ...vehicleInfo,
    licensePlate: manualPlateInput.trim().toUpperCase(),
    confidence: 1.0,
  };

  onConfirm(updatedVehicle); // 상태 저장
  onSelectCarModelManually(); // 곧바로 차종 선택 화면 이동
};

  const vehicleModelDisplay = vehicleInfo.model
    ? t(vehicleInfo.model)
    : t('selectCarModel.unknownModel');

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
        <Card className="w-full max-w-lg mb-10 bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-headline text-card-foreground">
              {t("vehicleConfirmation.manualEntryTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <Input
              type="text"
              placeholder={t("vehicleConfirmation.placeholder.plate")}
              value={manualPlateInput}
              onChange={(e) => setManualPlateInput(e.target.value.toUpperCase())}
              className="text-2xl text-center h-14 font-mono tracking-wider bg-input text-card-foreground border-border placeholder:text-muted-foreground"
              aria-label={t("vehicleConfirmation.manualEntryTitle")}
            />
          </CardContent>
        </Card>

       <div className="w-full max-w-md space-y-4">
          <KioskButton
              onClick={handleManualSubmit}
              label={`${t("vehicleConfirmation.button.submitPlate")} → ${t("vehicleConfirmation.button.selectModel")}`}
              icon={<CheckCircle2 />}
            />
          {/* 이 버튼은 병합하지 않고 그대로 유지 */}
          <KioskButton
            onClick={() => setIsManualEntryMode(false)}
            label={t("vehicleConfirmation.button.backToScan")}
            variant="outline"
          />
        </div>
      </FullScreenCard>
    );
  }

  return (
    <FullScreenCard title={t("vehicleConfirmation.title")} bottomCenterAccessory={languageButton}>
      <CheckCircle2 size={80} className="text-green-500 mb-6" />
      <Card className="w-full max-w-lg mb-10 bg-input border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-headline text-card-foreground">
            {t("vehicleConfirmation.question")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-4xl font-bold font-mono text-primary tracking-wider">
            {vehicleInfo.licensePlate}
          </p>
          <p className="text-xl text-card-foreground">
            {t("vehicleConfirmation.label.model")}: {vehicleModelDisplay}
          </p>
          {vehicleInfo.confidence !== undefined && (
            <p className="text-sm text-card-foreground">
              {t("vehicleConfirmation.label.confidence")}: {(vehicleInfo.confidence * 100).toFixed(0)}%
            </p>
          )}
        </CardContent>
      </Card>

      <div className="w-full max-w-md space-y-4">
        <KioskButton onClick={() => onConfirm(vehicleInfo)} label={t("vehicleConfirmation.button.confirm")} icon={<CheckCircle2 />} />
        <KioskButton
          onClick={() => router.push('/manual-plate-input')}
          label={t("vehicleConfirmation.button.manualEntry")}
          variant="outline"
          icon={<Edit3 />}
        />
      </div>
    </FullScreenCard>
  );
}