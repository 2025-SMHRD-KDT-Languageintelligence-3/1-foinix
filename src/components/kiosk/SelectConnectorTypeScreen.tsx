
"use client";

import { useEffect } from 'react';
import { Cable } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { ConnectorTypeInfo, VehicleInfo } from '@/types/kiosk';
import { Badge } from '@/components/ui/badge';
import type { Language } from '@/lib/translations';
import { useTTS } from '@/hooks/useTTS'; // ✅ TTS 훅 import
import { useAutoSTT, STTCommands } from '@/hooks/useAutoSTT';

interface SelectConnectorTypeScreenProps {
  vehicleInfo: VehicleInfo | null;
  availableConnectors: ConnectorTypeInfo[];
  onConnectorSelect: (connectorTypeId: string) => void;
  onCancel: () => void;
  lang: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
  onLanguageSwitch: () => void;
}

export function SelectConnectorTypeScreen({
  vehicleInfo,
  availableConnectors,
  onConnectorSelect,
  onCancel,
  lang,
  t,
  onLanguageSwitch
}: SelectConnectorTypeScreenProps) {
  const { speak } = useTTS();
  const commandMap: STTCommands = {};
  availableConnectors.forEach((c) => {
    const phrase = t(c.name);
    commandMap[phrase] = () => onConnectorSelect(c.id);
  });
  commandMap['취소'] = onCancel;
  useAutoSTT(commandMap);

  useEffect(() => {
    speak("차량에 맞는 충전 커넥터를 선택해 주세요.");
  }, []);

  const recommendedTypeId = vehicleInfo?.recommendedConnectorType;
  const vehicleModelDisplay = vehicleInfo?.model ? t(vehicleInfo.model) : "";

  const renderConnectorItem = (connector: ConnectorTypeInfo) => {
    const isRecommended = connector.id === recommendedTypeId;
    const connectorName = t(connector.name);
    const connectorDescription = connector.description ? t(connector.description) : "";

    return (
      <div key={connector.id} className="flex flex-col items-center w-full sm:w-auto">
        <KioskButton 
          onClick={() => onConnectorSelect(connector.id)} 
          label={connectorName}
          variant={isRecommended ? 'default' : 'outline'}
          className="w-full min-w-[280px] max-w-[320px] text-xl py-6 relative"
        >
          {isRecommended && (
            <Badge className="absolute -top-3 -right-3 bg-green-500 text-white px-2.5 py-1 text-xs font-semibold">
              {t("selectConnectorType.badge.recommended")}
            </Badge>
          )}
        </KioskButton>
        <div className="mt-3 w-60 h-40 relative p-2 rounded-sm">
          <img 
            src={connector.imageUrl}
            alt={connectorName}
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          />
        </div>
        {connectorDescription && <p className="text-sm text-muted-foreground mt-2 text-center max-w-[280px]">{connectorDescription}</p>}
      </div>
    );
  };

  return (
    <FullScreenCard 
      title={t("selectConnectorType.title")}
      bottomCenterAccessory={
        <Button
          onClick={onLanguageSwitch}
          variant="outline"
          className="bg-white text-[#1b1f3b] border border-gray-300 rounded-lg text-sm font-bold py-2 px-4 shadow-md hover:bg-gray-100"
        >
          {t("button.languageSwitch")}
        </Button>
      }
    >
      <Cable size={80} className="text-primary mb-6" />
      <p className="text-xl sm:text-2xl text-center mb-8 md:mb-10 text-muted-foreground">
        {t("selectConnectorType.instruction")}
        {vehicleModelDisplay && <span className="block text-lg mt-1">{t("selectConnectorType.vehicleModelHint", { vehicleModel: vehicleModelDisplay })}</span>}
      </p>

      <div className="w-full flex flex-col sm:flex-row items-center sm:justify-center gap-8">
        {availableConnectors.map(connector => renderConnectorItem(connector))}
      </div>

      <KioskButton onClick={onCancel} label={t("selectConnectorType.button.cancel")} variant="ghost" className="mt-12" />
    </FullScreenCard>
  );
}
