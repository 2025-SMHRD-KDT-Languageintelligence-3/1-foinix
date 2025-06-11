
"use client";

import Image from 'next/image';
import { Car } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { CarBrand } from '@/types/kiosk';
import { Card } from '@/components/ui/card';
import type { Language, t as TFunction } from '@/lib/translations';

interface SelectCarBrandScreenProps {
  brands: CarBrand[];
  onBrandSelect: (brandId: string) => void;
  onCancel: () => void;
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

export function SelectCarBrandScreen({ brands, onBrandSelect, onCancel, lang, t, onLanguageSwitch }: SelectCarBrandScreenProps) {
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
      title={t("selectCarBrand.title")}
      bottomCenterAccessory={languageButton}
    >
      <Car size={80} className="text-primary mb-6" />
      <p className="text-xl sm:text-2xl text-center mb-10 text-muted-foreground">
        {t("selectCarBrand.instruction")}
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mb-10">
        {brands.map((brand) => (
          <Card 
            key={brand.id} 
            className="p-4 flex flex-col items-center justify-center hover:shadow-lg cursor-pointer aspect-square transition-all hover:bg-muted/50"
            onClick={() => onBrandSelect(brand.id)}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onBrandSelect(brand.id)}
            aria-label={t(brand.name)}
          >
            <Image 
              src={brand.logoUrl} 
              alt={t(brand.name) + " " + t("logo")} 
              width={100} 
              height={100} 
              className="object-contain"
              data-ai-hint={brand.dataAiHint || 'car logo'}
            />
            <p className="mt-3 text-lg font-semibold text-center">{t(brand.name)}</p>
          </Card>
        ))}
      </div>

      <KioskButton onClick={onCancel} label={t("selectCarBrand.button.cancel")} variant="outline" className="max-w-sm" />
    </FullScreenCard>
  );
}
