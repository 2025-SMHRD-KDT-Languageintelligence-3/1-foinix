"use client";

import { CreditCard, Smartphone, CheckCircle, Plug } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import type { BillDetails } from '@/types/kiosk'; // types/kiosk.ts 파일도 수정했음을 가정
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import type { Language } from '@/lib/translations'; // translations.ts 파일도 수정했음을 가정
import { useTTS } from '@/hooks/useTTS';
import { useAutoSTT } from '@/hooks/useAutoSTT';

interface PaymentScreenProps {
  bill: BillDetails;
  onPaymentProcessed: (receiptChoice: 'sms' | 'none') => void;
  lang: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
  onLanguageSwitch: () => void;
}

type PaymentMethod = 'card' | 'nfc' | null;

export function PaymentScreen({ bill, onPaymentProcessed, lang, t, onLanguageSwitch }: PaymentScreenProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success'>('pending');
  const { speak } = useTTS();

  useEffect(() => {
    if (paymentStatus === 'pending') {
      speak(`${t('payment.title.complete')} ${t('payment.instruction.disconnect')}`);
    }
  }, [paymentStatus, t]);

  useEffect(() => {
    if (paymentStatus === 'success') {
      speak(t('payment.success.title'));
    }
  }, [paymentStatus, t]);

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
    }, 2000);
  };

  useAutoSTT({
    '결제해줘': () => handlePaymentMethodSelect('card'),
    '카드로결제': () => handlePaymentMethodSelect('card'),
  });
  
  const languageButton = (
    <Button
      onClick={onLanguageSwitch}
      variant="outline"
      className="bg-white text-[#1b1f3b] border border-gray-300 rounded-lg text-sm font-bold py-2 px-4 shadow-md hover:bg-gray-100"
    >
      {t("button.languageSwitch")}
    </Button>
  );

  if (paymentStatus === 'processing') {
    return (
      <FullScreenCard title={t("payment.processing.title")} bottomCenterAccessory={languageButton}>
        <CreditCard size={80} className="animate-pulse text-primary mb-6" />
        <p className="text-xl text-center mb-4">{t("payment.processing.message")}</p>
        {/* Removed QrCode icon as QR payment is removed */}
      </FullScreenCard>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <FullScreenCard title={t("payment.success.title")} bottomCenterAccessory={languageButton}>
        <CheckCircle size={80} className="text-green-500 mb-6" />
        <Card className="w-full max-w-md mb-8 bg-secondary/10 border-secondary shadow-inner">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-headline">{t("payment.finalBill.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-center">
            <p className="text-lg">{t("payment.finalBill.energy")}: <span className="font-bold text-primary">{bill.kwhUsed.toFixed(2)} kWh</span></p>
            <p className="text-lg">{t("payment.finalBill.duration")}: <span className="font-bold text-primary">{bill.durationMinutes.toFixed(2)} {t('payment.finalBill.durationMinutesUnit', {count: bill.durationMinutes})}</span></p>
            <p className="text-2xl font-bold text-primary mt-1">{t("payment.finalBill.total")}: ₩{bill.totalCost.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <p className="text-xl text-center mb-4 text-muted-foreground">{t("payment.receipt.question")}</p>
        <div className="w-full max-w-md space-y-4">
          {/* SMS 영수증 받기 버튼을 영수증 출력 버튼으로 변경 */}
          <KioskButton
            onClick={() => onPaymentProcessed('sms')}
            label={t("payment.receipt.print")}
            icon={<Plug />}
          />
          {/* 기존 영수증 안 받기 버튼 */}
          <KioskButton 
            onClick={() => onPaymentProcessed('none')} 
            label={t("payment.receipt.none")} 
            variant="ghost" 
          />
        </div>
      </FullScreenCard>
    );
  }

  return (
    <FullScreenCard title={t("payment.title.complete")} bottomCenterAccessory={languageButton}>
      <Plug size={80} className="text-primary mb-6" />
      <p className="text-xl sm:text-2xl text-center mb-4 text-muted-foreground">
        {t("payment.instruction.disconnect")}
      </p>
      <Card className="w-full max-w-md mb-8 bg-secondary/20 border-secondary shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-headline">{t("payment.finalBill.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-center">
          <p className="text-xl">{t("payment.finalBill.energy")}: <span className="font-bold text-primary">{bill.kwhUsed.toFixed(2)} kWh</span></p>
          <p className="text-xl">{t("payment.finalBill.duration")}: <span className="font-bold text-primary">{bill.durationMinutes.toFixed(2)} {t('payment.finalBill.durationMinutesUnit', {count: bill.durationMinutes})}</span></p>
          <p className="text-3xl font-bold text-primary mt-2">{t("payment.finalBill.total")}: ₩{bill.totalCost.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <p className="text-xl text-center mb-6 font-semibold text-primary">{t("payment.selectMethod")}</p>
      <div className="w-full max-w-md space-y-4">
        <KioskButton onClick={() => handlePaymentMethodSelect('card')} label={t("payment.button.payByCard")} icon={<CreditCard />} />
        <KioskButton onClick={() => handlePaymentMethodSelect('nfc')} label={t("payment.button.payByNFC")} icon={<Smartphone />} />
      </div>
    </FullScreenCard>
  );
}