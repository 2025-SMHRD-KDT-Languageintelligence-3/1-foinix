
"use client";

import Image from 'next/image';
import { CarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { CarBrand, VehicleInfo } from '@/types/kiosk';
import { Card } from '@/components/ui/card';
import type { Language } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface SelectCarModelScreenProps {
  brand: CarBrand | undefined;
  onModelSelect: (modelInfo: Partial<VehicleInfo>) => void;
  onCancel: () => void;
  lang: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
  onLanguageSwitch: () => void;
}

export function SelectCarModelScreen({ brand, onModelSelect, onCancel, lang, t, onLanguageSwitch }: SelectCarModelScreenProps) {
  const router = useRouter();
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
  const numModels = brand.models.length;

  const gridContainerClasses = cn(
    "grid gap-4 w-full max-w-5xl mb-8", // Reduced gap and mb
    numModels === 1 && "grid-cols-1 justify-items-center",
    numModels === 2 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-2",
    numModels >= 3 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
  );

  const cardClasses = cn(
    "p-2 flex flex-col items-center justify-between hover:shadow-xl cursor-pointer transition-all hover:bg-muted/50", // Reduced p
    numModels === 1 && "w-full max-w-xs sm:max-w-sm" 
  );

  return (
    <FullScreenCard 
      title={t("selectCarModel.title", { brandName })}
      bottomCenterAccessory={languageButton}
    >
       <Image 
            src={brand.logoUrl} 
            alt={brandName + " " + t("logo")}
            width={70} // Reduced width
            height={70} // Reduced height
            className="object-contain rounded-md mb-4" // Reduced mb
            data-ai-hint={brand.dataAiHint || 'car logo'}
        />
      <p className="text-lg sm:text-xl text-center mb-8 text-muted-foreground"> 
        {/* Reduced text size and mb */}
        {t("selectCarModel.instruction")}
      </p>
      
      <div className={gridContainerClasses}>
        {brand.models.map((model) => {
          const modelDisplayName = t(model.name);
          return (
            <Card
              key={model.id}
              className={cardClasses}
              onClick={() => {
                onModelSelect({
                  model: model.name,
                  licensePlate: 'selectCarModel.manualEntryLicensePlate',
                  confidence: 1.0,
                  portLocationDescription: "selectCarModel.portLocationGeneric",
                  connectionImageUrl: 'https://placehold.co/600x400.png', // Placeholder image, actual image size can vary
                  dataAiHint: model.dataAiHint || "electric vehicle",
                });
                router.push('/preauth');
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onModelSelect({ model: model.name, licensePlate: 'selectCarModel.manualEntryLicensePlate' });
                  router.push('/preauth');
                }
              }}
              aria-label={modelDisplayName}
            >
              <div className="w-full h-32 relative mb-1"> 
                  {/* Reduced h and mb */}
                  <Image 
                    src={model.imageUrl} 
                    alt={modelDisplayName}
                    fill
                    className="object-contain rounded-md"
                    data-ai-hint={model.dataAiHint || 'electric car'}
                  />
              </div>
              <p className="mt-1 text-lg font-semibold text-center">{/* Reduced mt and text size */ modelDisplayName}</p>
            </Card>
          );
        })}
      </div>

      <KioskButton onClick={onCancel} label={t("selectCarModel.button.cancel")} variant="outline" className="max-w-sm" />
    </FullScreenCard>
  );
}
