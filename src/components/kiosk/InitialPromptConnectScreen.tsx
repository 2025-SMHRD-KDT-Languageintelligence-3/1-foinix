
"use client";

import Image from 'next/image';
import { PlugZap } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { VehicleInfo } from '@/types/kiosk';
import type { Language } from '@/lib/translations';
import { useEffect } from 'react';
import { useTTS } from '@/hooks/useTTS';
import { useAutoSTT } from '@/hooks/useAutoSTT';

interface InitialPromptConnectScreenProps {
  vehicleInfo: VehicleInfo;
  slotNumber: string;
  onChargerConnected: () => void;
  lang: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
  onLanguageSwitch: () => void;
}

export function InitialPromptConnectScreen({ vehicleInfo, slotNumber, onChargerConnected, lang, t, onLanguageSwitch }: InitialPromptConnectScreenProps) {
  const vehicleModelDisplayRaw = vehicleInfo.model ? t(vehicleInfo.model) : t('selectCarModel.unknownModel');
  const vehicleModelDisplay =
    vehicleModelDisplayRaw === '모델 Y' ? '니로' : vehicleModelDisplayRaw;
  const portLocationDisplay = vehicleInfo.portLocationDescription ? t(vehicleInfo.portLocationDescription) : "";
  const { speak } = useTTS();
  useAutoSTT({ '연결했어': onChargerConnected });
  useEffect(() => {
    let message = t("initialPromptConnect.instruction", { vehicleModel: vehicleModelDisplay });
    if (portLocationDisplay) {
      message += " " + t("initialPromptConnect.portLocation", { portLocationDescription: portLocationDisplay });
    }
    speak(message);
  }, [t, vehicleModelDisplay, portLocationDisplay]);

   let connectionImagePath = vehicleInfo.connectionImageUrl;

  if (!connectionImagePath) {
  const modelKey = vehicleInfo.model?.split('.').pop()?.toLowerCase(); // 예: model_y
  connectionImagePath = modelKey
    ? `/images/portLocations/${modelKey}.png`
    : 'https://placehold.co/600x400.png'; // fallback 이미지
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
      title={t("initialPromptConnect.title", { slotNumber })}
      bottomCenterAccessory={languageButton}
    >
      <PlugZap size={80} className="text-primary mb-6" />
      <p className="text-xl sm:text-2xl text-center mb-6 text-card-foreground"> {/* Changed text-muted-foreground to text-card-foreground */}
        {t("initialPromptConnect.instruction", { vehicleModel: vehicleModelDisplay })}
      </p>
      {portLocationDisplay && (
        <p className="text-lg text-center mb-4 text-card-foreground"> {/* Ensured this also uses card-foreground for clarity */}
          {t("initialPromptConnect.portLocation", { portLocationDescription: portLocationDisplay })}
        </p>
      )}
      
      <div className="w-full max-w-lg my-8 p-4 ">
        <Image 
          src={connectionImagePath} 
          alt={t("initialPromptConnect.alt.connectionImage")}
          width={400} 
          height={500} 
          className="rounded-md object-contain mx-auto"
          data-ai-hint={vehicleInfo.dataAiHint || "charger connection vehicle"}
        />
      </div>

      <KioskButton onClick={onChargerConnected} label={t("initialPromptConnect.button.connected")} />
    </FullScreenCard>
  );
}
