
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChargingInProgressScreen } from '@/components/kiosk/ChargingInProgressScreen';
import type { BillDetails, ChargingSlot } from '@/types/kiosk';
import { Language, t as translateFunction } from '@/lib/translations';
import { useToast } from "@/hooks/use-toast";

// Default data for props needed by ChargingInProgressScreen
// These are used if the page is accessed directly or context isn't fully available.
// ChargingInProgressScreen itself loads core progress (kWh, time, %) from its own sessionStorage.
const DEFAULT_SLOTS_DATA: ChargingSlot[] = [
  { id: 'S1', status: 'occupied', vehicle: { licensePlate: "KIOSK-001", model:"carModel.tesla.model_y"}, estimatedCompletionTime: "...", currentChargeKW: 0, user:"KIOSK-001" },
  { id: 'S2', status: 'available' },
];

const DEFAULT_ASSIGNED_SLOT_ID = 'S1';
const DEFAULT_SELECTED_CONNECTOR = 'ccs_combo_2'; // A common default
const DEFAULT_ESTIMATED_TIME_MINUTES = 30; // Default estimated time

export default function ChargingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [lang, setLang] = useState<Language>('ko');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure component only renders on client for sessionStorage/localStorage access
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

  const handleStopCharging = (finalBill: BillDetails) => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('kioskChargingProgressState');
    }
    toast({
      title: t("toast.chargingStopped.title"),
      description: t("toast.chargingStopped.description"),
    });
    router.push('/charging/complete');
  };

  const handleChargingComplete = (finalBill: BillDetails) => {
    // This function remains as is, navigating to the main page's payment flow
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('kioskChargingProgressState');
    }
    toast({
      title: t("payment.title.complete"),
      description: `${t("payment.finalBill.total")}: ₩${finalBill.totalCost.toLocaleString()}`,
    });
    // Typically, you'd navigate to a payment screen or main page.
    // For now, let's assume the main page handles the next step post-completion from this dedicated charging page.
    // If the main KioskPage (at '/') handles payment, redirect there.
    // Or if there's a specific payment page for this /charging route, navigate there.
    // For simplicity, if ChargingInProgressScreen on this page leads to completion,
    // it might need to transition to a payment screen specific to this context or signal the main app.
    // Let's redirect to main page for now, assuming it handles the 'CHARGING_COMPLETE_PAYMENT' state.
    localStorage.setItem('kioskNextState', 'CHARGING_COMPLETE_PAYMENT'); // Signal main page
    localStorage.setItem('kioskFinalBill', JSON.stringify(finalBill)); // Pass bill
    router.push('/'); 
  };

  const handleSimulateError = (errorMessageKey: string) => {
     toast({
      title: t("chargingError.title"),
      description: t(errorMessageKey),
      variant: "destructive",
    });
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('kioskChargingProgressState');
    }
     // Similar to completion, signal main page or handle error state locally.
    localStorage.setItem('kioskNextState', 'CHARGING_ERROR');
    localStorage.setItem('kioskChargingErrorMessage', t(errorMessageKey));
    router.push('/');
  };
  
  if (!isClient) {
    return null; 
  }

  const slotNumber = DEFAULT_ASSIGNED_SLOT_ID;
  const initialBill: BillDetails = { kwhUsed: 0, durationMinutes: 0, totalCost: 0 };
  const estimatedTotalTimeMinutes = DEFAULT_ESTIMATED_TIME_MINUTES;
  const allSlots = DEFAULT_SLOTS_DATA;
  const selectedConnectorType = DEFAULT_SELECTED_CONNECTOR;

  return (
    <main className="w-screen h-screen overflow-hidden bg-card text-card-foreground">
      <ChargingInProgressScreen
        slotNumber={slotNumber}
        initialBill={initialBill}
        estimatedTotalTimeMinutes={estimatedTotalTimeMinutes}
        onStopCharging={handleStopCharging}
        onChargingComplete={handleChargingComplete}
        onSimulateError={handleSimulateError}
        allSlots={allSlots}
        lang={lang}
        t={t}
        onLanguageSwitch={handleLanguageSwitch}
        selectedConnectorType={selectedConnectorType}
      />
    </main>
  );
}
