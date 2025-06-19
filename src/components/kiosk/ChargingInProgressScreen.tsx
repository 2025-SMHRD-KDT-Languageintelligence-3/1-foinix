
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
import { WeatherWidget } from './WeatherWidget';
import { useEffect, useState, useRef } from 'react';
import type { Language } from '@/lib/translations';
import { t as TFunction } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface ChargingInProgressScreenProps {
  slotNumber: string;
  initialBill: BillDetails;
  estimatedTotalTimeMinutes: number;
  onStopCharging: (finalBill: BillDetails) => void;
  onChargingComplete: (finalBill: BillDetails) => void;
  onSimulateError: (errorMessageKey: string) => void;
  allSlots: ChargingSlot[];
  lang: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
  onLanguageSwitch: () => void;
  selectedConnectorType: string;
}
interface ChargingTipsDisplayProps {
  lang: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const KWH_PER_SECOND = 0.01;
const MAX_KW_CAPACITY_FOR_PROGRESS_BAR = 70;
const SESSION_STORAGE_KEY = 'kioskChargingProgressState';

interface StoredChargingState {
  currentBill: BillDetails;
  elapsedTime: number;
  currentChargePercentage: number;
}

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
  const loadStateFromSessionStorage = (): StoredChargingState | null => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved) as StoredChargingState;
        } catch (e) {
          console.error("Failed to parse charging state from sessionStorage", e);
          sessionStorage.removeItem(SESSION_STORAGE_KEY); 
          return null;
        }
      }
    }
    return null;
  };

  const [currentBill, setCurrentBill] = useState<BillDetails>(() => {
    const savedState = loadStateFromSessionStorage();
    return savedState?.currentBill || initialBill;
  });

  const [elapsedTime, setElapsedTime] = useState<number>(() => {
    const savedState = loadStateFromSessionStorage();
    return savedState?.elapsedTime || 0;
  });

  const [currentChargePercentage, setCurrentChargePercentage] = useState<number>(() => {
    const savedState = loadStateFromSessionStorage();
    return savedState?.currentChargePercentage || 0;
  });

  const [isInternallyComplete, setIsInternallyComplete] = useState<boolean>(() => {
    const savedState = loadStateFromSessionStorage();
    return savedState?.currentChargePercentage !== undefined ? savedState.currentChargePercentage >= 100 : false;
  });

  const chargeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const finalBillForCompletionRef = useRef(currentBill); 

  const onChargingCompleteRef = useRef(onChargingComplete);
  const onStopChargingRef = useRef(onStopCharging);
  const onSimulateErrorRef = useRef(onSimulateError);

  useEffect(() => {
    onChargingCompleteRef.current = onChargingComplete;
  }, [onChargingComplete]);

  useEffect(() => {
    onStopChargingRef.current = onStopCharging;
  }, [onStopCharging]);

  useEffect(() => {
    onSimulateErrorRef.current = onSimulateError;
  }, [onSimulateError]);

  
  const [isStateLoaded, setIsStateLoaded] = useState(false);

  const [showConnectorWarning, setShowConnectorWarning] = useState(false);

  useEffect(() => {
    setShowConnectorWarning(true);
    const timer = setTimeout(() => setShowConnectorWarning(false), 20000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as StoredChargingState;
          if (parsed.currentBill) setCurrentBill(parsed.currentBill);
          if (typeof parsed.elapsedTime === 'number') setElapsedTime(parsed.elapsedTime);
          if (typeof parsed.currentChargePercentage === 'number') {
            setCurrentChargePercentage(parsed.currentChargePercentage);
            setIsInternallyComplete(parsed.currentChargePercentage >= 100);
          }
        } catch (e) {
          console.error('충전 상태 복원 실패:', e);
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
      setIsStateLoaded(true);
    }
  }, []);
  
  useEffect(() => {
    if (!isStateLoaded) return;
    if (typeof window !== 'undefined') {
      const stateToSave: StoredChargingState = {
        currentBill,
        elapsedTime,
        currentChargePercentage,
      };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [currentBill, elapsedTime, currentChargePercentage, isStateLoaded]);
  ;


  let costPerKwh: number;
  switch (selectedConnectorType) {
    case 'ac_type_1':
      costPerKwh = 200;
      break;
    case 'ccs_combo_2':
      costPerKwh = 300;
      break;
    default:
      costPerKwh = 300;
  }

  useEffect(() => {
    finalBillForCompletionRef.current = currentBill;
  }, [currentBill]);

  useEffect(() => {
    if (isInternallyComplete || estimatedTotalTimeMinutes <= 0) {
      if (chargeIntervalRef.current) {
        clearInterval(chargeIntervalRef.current);
        chargeIntervalRef.current = null;
      }
      return;
    }

    const updateCharge = () => {
      let newElapsedTimeAfterUpdate = 0;
      setElapsedTime(prevTime => {
        newElapsedTimeAfterUpdate = prevTime + 1;
        return newElapsedTimeAfterUpdate;
      });

      setCurrentBill(prevBill => {
        const newKwh = prevBill.kwhUsed + KWH_PER_SECOND;
        return {
          kwhUsed: parseFloat(newKwh.toFixed(2)),
          durationMinutes: parseFloat((newElapsedTimeAfterUpdate / 60).toFixed(2)),
          totalCost: parseFloat((newKwh * costPerKwh).toFixed(0)),
        };
      });

      setCurrentChargePercentage(prevPercent => {
        const newPercent = prevPercent + (100 / (estimatedTotalTimeMinutes * 60));
        if (newPercent >= 100) {
          if (chargeIntervalRef.current) {
            clearInterval(chargeIntervalRef.current);
            chargeIntervalRef.current = null;
          }
          
          if (!isInternallyComplete) { 
            setIsInternallyComplete(true);
            
            finalBillForCompletionRef.current = { // Recalculate final bill for natural completion
                kwhUsed: parseFloat((currentBill.kwhUsed + KWH_PER_SECOND).toFixed(2)),
                durationMinutes: parseFloat(((elapsedTime + 1) / 60).toFixed(2)),
                totalCost: parseFloat(((currentBill.kwhUsed + KWH_PER_SECOND) * costPerKwh).toFixed(0)),
            };
            setTimeout(() => onChargingCompleteRef.current(finalBillForCompletionRef.current), 0);
          }
          return 100;
        }
        return parseFloat(newPercent.toFixed(2));
      });
    };

    if (chargeIntervalRef.current) {
        clearInterval(chargeIntervalRef.current);
    }
    chargeIntervalRef.current = setInterval(updateCharge, 1000);

    return () => {
      if (chargeIntervalRef.current) {
        clearInterval(chargeIntervalRef.current);
        chargeIntervalRef.current = null;
      }
    };
  }, [estimatedTotalTimeMinutes, costPerKwh, isInternallyComplete, currentBill.kwhUsed, elapsedTime]); 

  const handleManualStop = () => {
    if (chargeIntervalRef.current) {
      clearInterval(chargeIntervalRef.current);
      chargeIntervalRef.current = null;
    }
    
    if (!isInternallyComplete) { 
      setIsInternallyComplete(true);
      // Pass the most recent currentBill state directly for manual stop
      setTimeout(() => onStopChargingRef.current(currentBill), 0);
    }
  };

  const handleSimulateErrorClick = () => {
    if (chargeIntervalRef.current) {
      clearInterval(chargeIntervalRef.current);
      chargeIntervalRef.current = null;
    }
    if (!isInternallyComplete) {
      setIsInternallyComplete(true); 
    }
    
    onSimulateErrorRef.current("chargingError.messageCableDisconnect");
  };

  const displayPercentage = Math.min(currentChargePercentage, 100);
  const remainingTimeMinutes = Math.max(0, estimatedTotalTimeMinutes * ( (100 - displayPercentage) / 100 ) );


  const originalCurrentSlotData = allSlots.find(slot => slot.id === slotNumber);
  let activeSlotForWaitTimeDisplay: ChargingSlot | undefined;

  if (originalCurrentSlotData) {
    const liveChargeKW = (displayPercentage / 100) * MAX_KW_CAPACITY_FOR_PROGRESS_BAR;

    let liveEstimatedCompletionTimeString: string;
    if (displayPercentage >= 100) {
      liveEstimatedCompletionTimeString = t('waitTimeDisplay.completedStatus');
    } else if (displayPercentage > 0 && remainingTimeMinutes < 1 && remainingTimeMinutes > 0) {
      liveEstimatedCompletionTimeString = t('waitTimeDisplay.almostDone');
    } else if (remainingTimeMinutes >= 1) {
      liveEstimatedCompletionTimeString = t('waitTimeDisplay.minutesRemaining', { minutes: Math.ceil(remainingTimeMinutes) });
    } else {
      liveEstimatedCompletionTimeString = t('waitTimeDisplay.calculating');
    }

    activeSlotForWaitTimeDisplay = {
      ...originalCurrentSlotData,
      currentChargeKW: liveChargeKW,
      estimatedCompletionTime: liveEstimatedCompletionTimeString,
    };
  }

  const slotsToShowForWaitTimeDisplay = activeSlotForWaitTimeDisplay ? [activeSlotForWaitTimeDisplay] : [];


  const languageButton = (
    <Button
      onClick={onLanguageSwitch}
      variant="outline"
      className="bg-white text-primary border-primary dark:bg-card dark:text-card-foreground dark:border-border dark:hover:bg-muted hover:bg-primary/10"
    >
      {t("button.languageSwitch")}
    </Button>
  );

  return (
    <FullScreenCard
      bottomCenterAccessory={languageButton}
    >
      {showConnectorWarning && (
        <div className="absolute top-4 right-4 bg-red-100 text-red-800 px-4 py-2 rounded shadow-md z-50">
          <strong>⚠️ 경고:</strong><br />
          커넥터를 강제로 분리하지 마세요.<br />
          충전 완료 후 분리해 주세요.
        </div>
      )}
      <div className="absolute top-6 right-6 sm:top-10 sm:right-10 z-10 flex items-center space-x-3">
        <NoticesDisplay lang={lang} t={t} />
        <TroubleshootingGuide lang={lang} t={t} />
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-y-3 sm:gap-y-4">
        {/* MAIN CONTENT ROW */}
        <div className="flex flex-col lg:flex-row gap-x-6 sm:gap-x-8 gap-y-3 sm:gap-y-4">
          {/* Left Column (Current Session, Buttons, Weather) */}
          <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col items-center gap-y-3 sm:gap-y-4">
            <Card className="w-full bg-secondary/10 dark:bg-card/80 shadow-lg flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-center font-headline text-primary">{t("chargingInProgress.currentSession")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-center pt-2 pb-3 flex-grow">
                <div className="my-2">
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="text-border/50 dark:text-border/30"
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
                <div className="flex items-center justify-center text-lg text-card-foreground pt-1">
                  <Hourglass size={20} className="mr-2 text-primary"/>
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
              className="w-full border-amber-500 text-amber-600 hover:bg-amber-500/10 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-400/10"
            />
            <WeatherWidget lang={lang} t={t} className="w-full mt-2" />
          </div>

          {/* Right Column (Slot Info, Stores, Tips) */}
          <div className="flex-grow flex flex-col gap-y-3 sm:gap-y-4">
            <WaitTimeDisplay slots={slotsToShowForWaitTimeDisplay} currentSlotId={slotNumber} lang={lang} t={t} className="w-full" />
            <LocalBusinessDisplay lang={lang} t={t} from="charging" />
            <ChargingTipsDisplay lang={lang} t={t} className="w-full min-h-[140px] sm:min-h-[160px]" />
          </div>
        </div>
      </div>
    </FullScreenCard>
  );
}
