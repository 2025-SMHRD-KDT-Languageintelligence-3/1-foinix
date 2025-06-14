
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FullScreenCard } from '@/components/kiosk/FullScreenCard';
import { KioskButton } from '@/components/kiosk/KioskButton';
import { Button } from '@/components/ui/button';
import { Language, t as translateFunction } from '@/lib/translations';
import { AlertOctagon, Home } from 'lucide-react';

const AUTO_REDIRECT_DELAY_SECONDS = 30;

export default function ChargingStoppedPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('ko');
  const [countdown, setCountdown] = useState(AUTO_REDIRECT_DELAY_SECONDS);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
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

  const handleReturnHome = useCallback(() => {
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
    }
  
    // 💡 결제 정보 mock 데이터 저장 (필수)
    localStorage.setItem('KioskFinalBill', JSON.stringify({
      energy: '0.00kWh',
      time: '0분',
      price: '₩0'
    }));
    localStorage.setItem('KioskNextState', 'CHARGING_COMPLETE_PAYMENT');
  
    // ✅ 충전 완료 화면으로 이동
    router.push('/complete');
  }, [router]);
  
  
  useEffect(() => {
    countdownTimerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if(countdownTimerRef.current) clearInterval(countdownTimerRef.current);
          handleReturnHome();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [handleReturnHome]);

  const languageButton = (
    <Button
      onClick={handleLanguageSwitch}
      variant="outline"
      className="bg-card text-primary border-primary hover:bg-primary/10"
    >
      {t("button.languageSwitch")}
    </Button>
  );

  return (
    <FullScreenCard
      title={t("chargingStoppedPage.title")}
      bottomCenterAccessory={languageButton}
    >
      <AlertOctagon size={80} className="text-destructive mb-6" />
      <p className="text-xl sm:text-2xl text-center mb-8 text-muted-foreground">
        {t("chargingStoppedPage.message")}
      </p>
      <KioskButton
        onClick={handleReturnHome}
        label={t("chargingStoppedPage.button.returnHome")}
        icon={<Home size={28} />}
        className="max-w-sm text-2xl py-5"
      />
      <p className="text-sm text-muted-foreground mt-6">
        {t("chargingStoppedPage.autoReturnMessage", { seconds: countdown })}
      </p>
    </FullScreenCard>
  );
}
