
"use client";

import { Zap, Hourglass, AlertCircle } from 'lucide-react';
import { FullScreenCard } from './FullScreenCard';
import { KioskButton } from './KioskButton';
import { Button } from '@/components/ui/button';
import { LocalBusinessDisplay } from './LocalBusinessDisplay';
import { WaitTimeDisplay } from './WaitTimeDisplay';
import { ChargingTipsDisplay } from './ChargingTipsDisplay';
import { TroubleshootingGuide } from './TroubleshootingGuide';
import { NoticesDisplay } from './NoticesDisplay';
import type { BillDetails, ChargingSlot } from '@/types/kiosk';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState, useRef } from 'react';
import type { Language, t as TFunction } from '@/lib/translations';

interface ChargingInProgressScreenProps {
  slotNumber: string;
  initialBill: BillDetails;
  estimatedTotalTimeMinutes: number;
  onStopCharging: (finalBill: BillDetails) => void;
  onChargingComplete: (finalBill: BillDetails) => void;
  onSimulateError: (errorMessageKey: string) => void;
  allSlots: ChargingSlot[];
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
  selectedConnectorType: string;
}

const KWH_PER_SECOND = 0.01; 

export function ChargingInProgressScreen({ 
  slotNumber, 
  initialBill, 
  estimatedTotalTimeMinutes, 
  onStopCharging,
  onChargingComplete,
  onSimulateError,
  allSlots,
  lang,
  t,
  onLanguageSwitch,
  selectedConnectorType
}: ChargingInProgressScreenProps) {
  const [currentBill, setCurrentBill] = useState(initialBill);
  const [elapsedTime, setElapsedTime] = useState(0); 
  const [currentChargePercentage, setCurrentChargePercentage] = useState(0);
  
  const chargeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const finalBillRef = useRef(initialBill); 

  let costPerKwh: number;
  switch (selectedConnectorType) {
    case 'ac_type_1':
      costPerKwh = 200; 
      break;
    case 'ccs_combo_2':
    case 'chademo':
      costPerKwh = 300; 
      break;
    default:
      console.warn(`Unknown connector type: ${selectedConnectorType} for cost calculation. Defaulting to 300 KRW/kWh.`);
      costPerKwh = 300; 
  }

  useEffect(() => {
    finalBillRef.current = currentBill;
  }, [currentBill]);

  useEffect(() => {
    const updateCharge = () => {
      setElapsedTime(prevTime => prevTime + 1);
      
      setCurrentBill(prevBill => {
        const newKwh = prevBill.kwhUsed + KWH_PER_SECOND;
        return {
          kwhUsed: parseFloat(newKwh.toFixed(2)),
          durationMinutes: parseFloat(((elapsedTime + 1) / 60).toFixed(2)),
          totalCost: parseFloat((newKwh * costPerKwh).toFixed(0)), 
        };
      });

      const chargeRatePerSecond = 100 / (estimatedTotalTimeMinutes * 60); 
      setCurrentChargePercentage(prevPercent => {
        const newPercent = prevPercent + chargeRatePerSecond;
        if (newPercent >= 100) {
          if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
          setTimeout(() => onChargingComplete(finalBillRef.current), 100); 
          return 100; 
        }
        return parseFloat(newPercent.toFixed(2));
      });
    };

    chargeIntervalRef.current = setInterval(updateCharge, 1000);
    return () => {
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    };
  }, [elapsedTime, onChargingComplete, estimatedTotalTimeMinutes, costPerKwh]);

  const handleManualStop = () => {
    if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    onStopCharging(finalBillRef.current);
  };

  const handleSimulateErrorClick = () => {
    if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    onSimulateError("chargingError.messageCableDisconnect"); 
  };

  const displayPercentage = Math.min(currentChargePercentage, 100); 
  const remainingTimeMinutes = Math.max(0, estimatedTotalTimeMinutes * ( (100 - currentChargePercentage) / 100 ) );

  const currentSlotDetails = allSlots.find(slot => slot.id === slotNumber);
  const slotsToShow = currentSlotDetails ? [currentSlotDetails] : [];

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
      title={t("chargingInProgress.title", { slotNumber })}
      bottomCenterAccessory={languageButton}
    >
      <div className="absolute top-6 right-6 sm:top-10 sm:right-10 z-10 flex items-center space-x-3">
        <NoticesDisplay lang={lang} t={t} />
        <TroubleshootingGuide lang={lang} t={t} />
      </div>
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
          <div className="lg:col-span-1 space-y-6 flex flex-col items-center">
            <Card className="w-full bg-secondary/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center font-headline text-primary">{t("chargingInProgress.currentSession")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="my-6">
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="text-border/50"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeWidth="3.5"
                      />
                      <path
                        className="text-primary"
                        strokeDasharray={`${displayPercentage}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-bold text-primary">{Math.round(displayPercentage)}%</span>
                      <span className="text-sm sm:text-base text-muted-foreground mt-1">{t("chargingInProgress.label.charged")}</span>
                    </div>
                  </div>
                </div>

                <p className="text-lg">{t("chargingInProgress.label.energySupplied")}: <span className="font-bold text-primary">{currentBill.kwhUsed} kWh</span></p>
                <p className="text-lg">{t("chargingInProgress.label.chargingTime")}: <span className="font-bold text-primary">{currentBill.durationMinutes} {t('payment.finalBill.durationMinutesUnit', {count: currentBill.durationMinutes})}</span></p>
                <p className="text-lg">{t("chargingInProgress.label.estimatedCost")}: <span className="font-bold text-primary">₩{currentBill.totalCost.toLocaleString()}</span></p>
                <div className="flex items-center justify-center text-lg text-foreground pt-2">
                  <Hourglass size={22} className="mr-2 text-primary"/>
                  <span>{t("chargingInProgress.label.remainingTime", { minutes: Math.ceil(remainingTimeMinutes) })}</span>
                </div>
              </CardContent>
            </Card>
            <KioskButton onClick={handleManualStop} label={t("chargingInProgress.button.stopCharging")} variant="destructive" className="w-full" />
            <KioskButton 
              onClick={handleSimulateErrorClick} 
              label={t("chargingError.simulateErrorButton")} 
              variant="outline" 
              icon={<AlertCircle size={24} />}
              className="w-full border-amber-500 text-amber-600 hover:bg-amber-500/10" 
            />
            <ChargingTipsDisplay lang={lang} t={t} />
          </div>

          <div className="lg:col-span-2 space-y-6 sm:space-y-8 flex flex-col">
            <WaitTimeDisplay slots={slotsToShow} currentSlotId={slotNumber} lang={lang} t={t} />
            <LocalBusinessDisplay lang={lang} t={t} />
          </div>
        </div>
      </div>
    </FullScreenCard>
  );
}
