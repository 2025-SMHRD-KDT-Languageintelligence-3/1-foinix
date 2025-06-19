'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SelectCarModelScreen } from '@/components/kiosk/SelectCarModelScreen';
import { Language, t as translateFunction } from '@/lib/translations';
import { MOCK_CAR_BRANDS } from '@/lib/mockData';

export default function SelectCarModelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Language>('ko');
  const [isClient, setIsClient] = useState(false);
  const [brandId, setBrandId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const storedLang = localStorage.getItem('kioskLanguage') as Language | null;
    if (storedLang) {
      setLang(storedLang);
      document.documentElement.lang = storedLang;
    } else {
      document.documentElement.lang = 'ko';
    }
    const paramId = searchParams.get('brand');
    if (paramId) {
      setBrandId(paramId);
      sessionStorage.setItem('selectedBrandId', paramId);
    } else {
      const stored = sessionStorage.getItem('selectedBrandId');
      if (stored) {
        setBrandId(stored);
      }
    }
  }, [searchParams]);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    return translateFunction(lang, key, params);
  }, [lang]);

  const handleLanguageSwitch = useCallback(() => {
    const newLang = lang === 'ko' ? 'en' : 'ko';
    setLang(newLang);
    localStorage.setItem('kioskLanguage', newLang);
    document.documentElement.lang = newLang;
  }, [lang]);

  const handleModelSelect = useCallback(() => {
    router.push('/preauth');
  }, [router]);

  const handleCancel = useCallback(() => {
    router.push('/select-car-brand');
  }, [router]);

  const brand = brandId ? MOCK_CAR_BRANDS.find(b => b.id === brandId) : undefined;

  if (!isClient) {
    return null;
  }

  return (
    <SelectCarModelScreen
      brand={brand}
      onModelSelect={handleModelSelect}
      onCancel={handleCancel}
      lang={lang}
      t={t}
      onLanguageSwitch={handleLanguageSwitch}
    />
  );
}
