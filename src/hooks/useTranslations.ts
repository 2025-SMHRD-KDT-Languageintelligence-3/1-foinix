import { useCallback, useEffect, useState } from 'react';
import { Language, t as translate } from '@/lib/translations';

/**
 * Simple hook to provide translation function based on language stored in
 * localStorage ("kioskLanguage"). Falls back to Korean ("ko").
 */
export function useTranslations() {
  const [lang, setLang] = useState<Language>('ko');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kioskLanguage') as Language | null;
      if (stored) {
        setLang(stored);
      }
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) =>
      translate(lang, key, params),
    [lang]
  );

  return { t, lang, setLang };
}
