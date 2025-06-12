
"use client";

import { ScanLine } from 'lucide-react'; // Removed Loader2 as it's not used for displayIcon default
import { FullScreenCard } from './FullScreenCard';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { Language, t as TFunction } from '@/lib/translations';
import React from 'react';

interface ScanningScreenProps {
    titleKey?: string;
    messageKey?: string;
    displayIcon?: React.ReactNode;
    lang: Language;
    t: typeof TFunction;
    onLanguageSwitch: () => void;
}

export function ScanningScreen({ 
    titleKey = "scanning.title", 
    messageKey = "scanning.message",
    displayIcon,
    lang,
    t,
    onLanguageSwitch
}: ScanningScreenProps) {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 15)); 
    }, 500);
    return () => clearInterval(timer);
  }, []);
  
  const iconToDisplay = displayIcon || <ScanLine size={80} className="text-primary mb-6" />;

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
      title={t(titleKey)} 
      bottomCenterAccessory={languageButton}
    >
      {React.cloneElement(iconToDisplay as React.ReactElement, { size: 80, className: "text-primary mb-6" })}
      <p className="text-xl sm:text-2xl text-center mb-12 text-muted-foreground">
        {t(messageKey)}
      </p>
      <div className="w-full max-w-md">
        <Progress value={progress} className="h-6 rounded-lg" />
      </div>
       <p className="text-sm text-muted-foreground mt-4 animate-pulse">{t("scanning.detecting")}</p>
    </FullScreenCard>
  );
}
