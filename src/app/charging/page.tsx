
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChargingInProgressScreen } from '@/components/kiosk/ChargingInProgressScreen';
import type { BillDetails, ChargingSlot } from '@/types/kiosk';
import { Language, t as translateFunction } from '@/lib/translations';
import { useToast } from "@/hooks/use-toast";

// Default data for props needed by ChargingInProgressScreen
const DEFAULT_SLOTS_DATA: ChargingSlot[] = [
  { id: 'S1', status: 'occupied', vehicle: { licensePlate: "KIOSK-001", model:"carModel.tesla.model_y"}, estimatedCompletionTime: "...", currentChargeKW: 0, user:"KIOSK-001" },
  { id: 'S2', status: 'available' },
];

const DEFAULT_ASSIGNED_SLOT_ID = 'S1';
const DEFAULT_SELECTED_CONNECTOR = 'ccs_combo_2'; 
const DEFAULT_ESTIMATED_TIME_MINUTES = 30; 

export default function ChargingPage() {
  const router = useRouter();
  const { toast } = useToast();
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

  const handleStopCharging = (finalBill: BillDetails) => {
    try {
      if (typeof window !== 'undefined') {
        // Clear session-specific progress
        sessionStorage.removeItem('kioskChargingProgressState');

        // Set localStorage for KioskPage to pick up
        localStorage.setItem('kioskNextState', 'CHARGING_COMPLETE_PAYMENT');
        
        // Ensure finalBill is a valid object before stringifying.
        const billToStore: BillDetails = finalBill && typeof finalBill.totalCost === 'number' 
          ? finalBill 
          : { kwhUsed: 0, durationMinutes: 0, totalCost: 0, ...finalBill }; // Spread to keep other fields if they exist, ensure core fields
        
        localStorage.setItem('kioskFinalBill', JSON.stringify(billToStore));
      }

      // Display toast to user
      const displayCost = finalBill && typeof finalBill.totalCost === 'number' ? finalBill.totalCost : 0;
      toast({
        title: t("payment.title.complete"), // "Charging Complete!"
        description: `${t("payment.finalBill.total")}: ₩${displayCost.toLocaleString()}`, // "Total Amount: ₩..."
      });

      // Navigate to the main page, KioskPage will handle rendering PaymentScreen
      if (router) {
        // Using setTimeout to potentially avoid race conditions with localStorage/state updates
        // and router's internal state.
        setTimeout(() => {
          router.push('/');
        }, 50); // A small delay
      } else {
        console.error("Router instance is not available in /charging/page.tsx handleStopCharging");
        // Fallback if router is somehow not available
        if (typeof window !== 'undefined') window.location.href = '/';
      }
    } catch (error) {
      console.error("Error in handleStopCharging:", error);
      const errorDescriptionKey = typeof error === 'string' ? error : (error instanceof Error ? error.message : "An unknown error occurred.");
      toast({
        title: t("error.genericTitle"),
        description: `${t("toast.chargingStopped.description")} ${errorDescriptionKey}`,
        variant: "destructive"
      });
      // Attempt a fallback navigation to home page
      if (router) {
        setTimeout(() => { router.push('/'); }, 50);
      } else if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  const handleChargingComplete = (finalBill: BillDetails) => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('kioskChargingProgressState');
    }
    toast({
      title: t("payment.title.complete"),
      description: `${t("payment.finalBill.total")}: ₩${finalBill.totalCost.toLocaleString()}`,
    });
    localStorage.setItem('kioskNextState', 'CHARGING_COMPLETE_PAYMENT');
    localStorage.setItem('kioskFinalBill', JSON.stringify(finalBill));
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
    localStorage.setItem('kioskNextState', 'CHARGING_ERROR');
    localStorage.setItem('kioskChargingErrorMessage', t(errorMessageKey));
    router.push('/'); // Navigate to main page, KioskPage will show error screen
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
