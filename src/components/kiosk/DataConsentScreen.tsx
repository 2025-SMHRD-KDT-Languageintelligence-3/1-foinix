
"use client";

import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { Language } from '@/lib/translations';
import type { t as TFunction } from '@/lib/translations';
import { Card, CardContent } from '@/components/ui/card'; 
// Removed CardHeader, CardTitle as they are not used for the inner card.


interface DataConsentScreenProps {
  onAgree: () => void;
  onDisagree: () => void;
  disagreeTapCount: number;
  lang: Language;
  t: TFunction;
  onLanguageSwitch: () => void;
}

export function DataConsentScreen({ onAgree, onDisagree, disagreeTapCount, lang, t, onLanguageSwitch }: DataConsentScreenProps) {
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
      title={t("dataConsent.title")}
      bottomCenterAccessory={languageButton}
    >
      <ShieldCheck size={80} className="text-primary mb-6" />
      <Card className="w-full max-w-3xl mx-auto shadow-xl bg-card dark:bg-neutral-800 p-6 rounded-xl">
        <CardContent className="pt-6 space-y-6 text-center text-lg sm:text-xl text-card-foreground dark:text-neutral-200 mb-2">
          <p>{t("dataConsent.p1")}</p>
          <p>{t("dataConsent.p2")}</p>
          <p>{t("dataConsent.p3")}</p>
          <p className="font-semibold text-primary dark:text-blue-400">
            {t("dataConsent.p4_agree")}
          </p>
          {disagreeTapCount === 1 && (
            <p className="font-semibold text-destructive dark:text-red-400 animate-pulse">
              {t("dataConsent.warning_disagreeAgain")}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="w-full max-w-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-5 mt-10">
        <KioskButton
          onClick={onAgree}
          label={t("button.agree")}
          icon={<ShieldCheck size={32} />}
          className="bg-green-600 hover:bg-green-700 text-white dark:text-white"
        />
        <KioskButton
          onClick={onDisagree}
          label={disagreeTapCount < 1 ? t("button.disagree") : t("button.skipConsentAndContinue")}
          icon={<ShieldAlert size={32} />}
          variant="destructive"
        />
      </div>
      <p className="text-sm text-muted-foreground mt-8 text-center">
        {t("dataConsent.serviceLimited")}
      </p>
    </FullScreenCard>
  );
}
