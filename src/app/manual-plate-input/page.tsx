'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ManualPlateInputScreen } from '@/components/kiosk/ManualPlateInputScreen';
import { Language, t as translateFunction } from '@/lib/translations';
import { findVehicleByPlate } from '@/lib/vehicleLookup';

export default function ManualPlateInputPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('ko');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedLang = localStorage.getItem('kioskLanguage') as Language | null;
    if (storedLang) {
      setLang(storedLang);
      document.documentElement.lang = storedLang;
    } else {
      document.documentElement.lang = 'ko';
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return translateFunction(lang, key, params);
    },
    [lang]
  );

  const handleLanguageSwitch = useCallback(() => {
    const newLang = lang === 'ko' ? 'en' : 'ko';
    setLang(newLang);
    localStorage.setItem('kioskLanguage', newLang);
    document.documentElement.lang = newLang;
  }, [lang]);

  const handleSubmit = useCallback(
    (plate: string) => {
      console.log('License plate submitted:', plate);
      const vehicle = findVehicleByPlate(plate);
      if (vehicle) {
        router.push('/preauth', { scroll: false });
      } else {
        router.push('/select-car-brand', { scroll: false });
      }
    },
    [router]
  );

  const handleCancel = useCallback(() => {
    router.push('/', { scroll: false });
  }, [router]);

  if (!isClient) {
    return null;
  }

  return (
    <ManualPlateInputScreen
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      lang={lang}
      t={t}
      onLanguageSwitch={handleLanguageSwitch}
    />
  );
}
