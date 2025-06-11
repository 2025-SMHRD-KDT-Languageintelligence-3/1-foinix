
"use client";

import Image from 'next/image';
import { CarIcon } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { CarBrand, VehicleInfo } from '@/types/kiosk';
import { Card } from '@/components/ui/card';
import type { Language, t as TFunction } from '@/lib/translations';

interface SelectCarModelScreenProps {
  brand: CarBrand | undefined;
  onModelSelect: (modelInfo: Partial<VehicleInfo>) => void;
  onCancel: () => void;
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

export function SelectCarModelScreen({ brand, onModelSelect, onCancel, lang, t, onLanguageSwitch }: SelectCarModelScreenProps) {
  const languageButton = (
    <Button
      onClick={onLanguageSwitch}
      variant="outline"
      className="bg-white text-[#1b1f3b] border border-gray-300 rounded-lg text-sm font-bold py-2 px-4 shadow-md hover:bg-gray-100"
    >
      {t("button.languageSwitch")}
    </Button>
  );
  
  if (!brand) {
    return (
      <FullScreenCard title={t("selectCarModel.error.noBrand")} bottomCenterAccessory={languageButton}>
        <CarIcon size={80} className="text-primary mb-6" />
        <p className="text-xl text-center mb-6">{t("selectCarModel.error.noBrandMessage")}</p>
        <KioskButton onClick={onCancel} label={t("selectCarModel.button.cancel")} />
      </FullScreenCard>
    );
  }
  
  const brandName = t(brand.name);

  return (
    <FullScreenCard 
      title={t("selectCarModel.title", { brandName })}
      bottomCenterAccessory={languageButton}
    >
       <Image 
            src={brand.logoUrl} 
            alt={brandName + " " + t("logo")}
            width={80} 
            height={80} 
            className="object-contain rounded-md mb-6"
            data-ai-hint={brand.dataAiHint || 'car logo'}
        />
      <p className="text-xl sm:text-2xl text-center mb-10 text-muted-foreground">
        {t("selectCarModel.instruction")}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
        {brand.models.map((model) => {
          const modelDisplayName = t(model.name);
          return (
            <Card 
              key={model.id} 
              className="p-3 flex flex-col items-center justify-between hover:shadow-xl cursor-pointer transition-all hover:bg-muted/50"
              onClick={() => onModelSelect({
                  model: model.name, 
                  licensePlate: 'selectCarModel.manualEntryLicensePlate', 
                  confidence: 1.0,
                  portLocationDescription: "selectCarModel.portLocationGeneric", 
                  connectionImageUrl: 'https://placehold.co/600x400.png',
                  dataAiHint: model.dataAiHint || "electric vehicle",
              })}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onModelSelect({ model: model.name, licensePlate: 'selectCarModel.manualEntryLicensePlate' })}
              aria-label={modelDisplayName}
            >
              <div className="w-full h-40 relative mb-2">
                  <Image 
                    src={model.imageUrl} 
                    alt={modelDisplayName}
                    fill
                    className="object-contain rounded-md"
                    data-ai-hint={model.dataAiHint || 'electric car'}
                  />
              </div>
              <p className="mt-2 text-lg font-semibold text-center">{modelDisplayName}</p>
            </Card>
          );
        })}
      </div>

      <KioskButton onClick={onCancel} label={t("selectCarModel.button.cancel")} variant="outline" className="max-w-sm" />
    </FullScreenCard>
  );
}
