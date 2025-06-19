
"use client";

import { Lightbulb, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import type { Language } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface Tip {
  icon: React.ReactNode;
  textKey: string; 
}

const tips: Tip[] = [
  { icon: <Lightbulb className="text-yellow-500" />, textKey: "chargingTips.tip1" },
  { icon: <Leaf className="text-green-500" />, textKey: "chargingTips.tip2" },
  { icon: <Lightbulb className="text-yellow-500" />, textKey: "chargingTips.tip3" },
  { icon: <Leaf className="text-green-500" />, textKey: "chargingTips.tip4" },
  { icon: <Lightbulb className="text-yellow-500" />, textKey: "chargingTips.tip5" },
];

interface ChargingTipsDisplayProps {
  lang: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
  className?: string;
}

export function ChargingTipsDisplay({ lang, t, className }: ChargingTipsDisplayProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 7000); 

    return () => clearInterval(tipInterval);
  }, []);

  const currentTip = tips[currentTipIndex];

  return (
    <Card className={cn("w-full bg-card shadow-lg flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-primary font-headline">
          {currentTip.icon}
          {t("chargingTips.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <p className="text-base text-card-foreground whitespace-pre-line">{t(currentTip.textKey)}</p>
      </CardContent>
    </Card>
  );
}
