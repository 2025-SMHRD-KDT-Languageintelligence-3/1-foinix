'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SelectCarBrandScreen } from '@/components/kiosk/SelectCarBrandScreen';
import { Language, t as translateFunction } from '@/lib/translations';
import { MOCK_CAR_BRANDS } from '@/lib/mockData';

export default function SelectCarBrandPage() {
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

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    return translateFunction(lang, key, params);
  }, [lang]);

  const handleLanguageSwitch = useCallback(() => {
    const newLang = lang === 'ko' ? 'en' : 'ko';
    setLang(newLang);
    localStorage.setItem('kioskLanguage', newLang);
    document.documentElement.lang = newLang;
  }, [lang]);

  const handleBrandSelect = useCallback((brandId: string) => {
    router.push(`/select-car-model?brand=${brandId}`, { scroll: false });
  }, [router]);

  const handleCancel = useCallback(() => {
    router.push('/manual-plate-input', { scroll: false });
  }, [router]);

  if (!isClient) {
    return null;
  }

  return (
    <SelectCarBrandScreen
      brands={MOCK_CAR_BRANDS}
      onBrandSelect={handleBrandSelect}
      onCancel={handleCancel}
      lang={lang}
      t={t}
      onLanguageSwitch={handleLanguageSwitch}
    />
  );
}
