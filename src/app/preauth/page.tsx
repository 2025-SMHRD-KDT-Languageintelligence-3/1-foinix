'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PrePaymentAuthScreen } from '@/components/kiosk/PrePaymentAuthScreen';
import { Language, t as translateFunction } from '@/lib/translations';

export default function PrePaymentAuthPage() {
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

  const handleAuthSuccess = useCallback(() => {
    router.push('/charging');
  }, [router]);

  const handleCancel = useCallback(() => {
    router.push('/select-car-model');
  }, [router]);

  if (!isClient) {
    return null;
  }

  return (
    <PrePaymentAuthScreen
      onAuthSuccess={handleAuthSuccess}
      onCancel={handleCancel}
      lang={lang}
      t={t}
      onLanguageSwitch={handleLanguageSwitch}
    />
  );
}
