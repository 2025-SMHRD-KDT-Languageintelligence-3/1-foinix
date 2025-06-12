
"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { KioskButton } from '@/components/kiosk/KioskButton';
import type { Language } from '@/lib/translations';
import { t as translateFunction } from '@/lib/translations';
import { ArrowLeft } from 'lucide-react';

export default function StoreMapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Language>('ko');
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    const storedLang = localStorage.getItem('kioskLanguage') as Language | null;
    if (storedLang) {
      setLang(storedLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = storedLang;
      }
    } else {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = 'ko';
      }
    }

    const idFromQuery = searchParams.get('businessId');
    if (idFromQuery) {
      setBusinessId(idFromQuery);
      // You can use this businessId to highlight a specific store on your map
      console.log("Specific business to show on map:", idFromQuery);
    } else {
      console.log("Showing all nearby stores on map.");
    }
  }, [searchParams]);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    return translateFunction(lang, key, params);
  }, [lang]);

  const handleLanguageSwitch = useCallback(() => {
    const newLang = lang === 'ko' ? 'en' : 'ko';
    setLang(newLang);
    localStorage.setItem('kioskLanguage', newLang);
    if (typeof document !== 'undefined') {
        document.documentElement.lang = newLang;
    }
  }, [lang]);

  return (
    <div className="w-screen h-screen flex flex-col bg-background text-foreground">
      <header className="p-4 flex justify-between items-center border-b border-border shrink-0">
        <h1 className="text-3xl font-bold font-headline">
          {businessId ? t('storeMap.title.single', { businessName: businessId }) : t('storeMap.title.all')}
        </h1>
        <Button onClick={handleLanguageSwitch} variant="outline" className="text-lg py-2 px-4">
          {lang === 'ko' ? 'English' : '한국어'}
        </Button>
      </header>

      <main id="map-container" className="flex-grow w-full h-full bg-muted relative">
        {/* Your custom map will be rendered here */}
        {/* You can use the 'businessId' state to customize the map view if needed */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-2xl text-muted-foreground p-8 bg-background/80 rounded-lg">
            {t('storeMap.mapPlaceholder')}
          </p>
        </div>
      </main>

      <footer className="p-4 border-t border-border flex justify-center shrink-0">
        <KioskButton
          label={t('storeMap.button.back')}
          onClick={() => router.push('/charging')}
          icon={<ArrowLeft size={28} />}
          className="max-w-sm text-2xl py-5"
        />
      </footer>
    </div>
  );
}
