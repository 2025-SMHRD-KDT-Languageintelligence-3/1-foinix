
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { KioskState, VehicleInfo, ChargingSlot, AppData, ConnectorTypeInfo, CarBrand, CarModel, BillDetails, OperatingMode } from '@/types/kiosk';
import { useToast } from "@/hooks/use-toast";
import { Language, t as translateFunction } from '@/lib/translations';

import { InitialWelcomeScreen } from '@/components/kiosk/InitialWelcomeScreen';
import { DataConsentScreen } from '@/components/kiosk/DataConsentScreen';
import { SelectCarBrandScreen } from '@/components/kiosk/SelectCarBrandScreen';
import { SelectCarModelScreen } from '@/components/kiosk/SelectCarModelScreen';
import { PrePaymentAuthScreen } from '@/components/kiosk/PrePaymentAuthScreen';
import { InitialPromptConnectScreen } from '@/components/kiosk/InitialPromptConnectScreen';
import { SelectConnectorTypeScreen } from '@/components/kiosk/SelectConnectorTypeScreen';
import { DetectConnectionScreen } from '@/components/kiosk/DetectConnectionScreen';
import { ConfirmStartChargingScreen } from '@/components/kiosk/ConfirmStartChargingScreen';
import { VacateSlotReminderScreen } from '@/components/kiosk/VacateSlotReminderScreen';
import { VehicleConfirmationScreen } from '@/components/kiosk/VehicleConfirmationScreen';
import { WelcomeScreen } from '@/components/kiosk/WelcomeScreen';
import { SlotAssignmentScreen } from '@/components/kiosk/SlotAssignmentScreen';
import { QueueScreen } from '@/components/kiosk/QueueScreen';
import { ChargingInProgressScreen } from '@/components/kiosk/ChargingInProgressScreen';
import { PaymentScreen } from '@/components/kiosk/PaymentScreen';
import { ThankYouScreen } from '@/components/kiosk/ThankYouScreen';
import { ChargingErrorScreen } from '@/components/kiosk/ChargingErrorScreen';


const MOCK_CAR_MODELS_HYUNDAI: CarModel[] = [
  { id: 'ioniq5', name: 'carModel.hyundai.ioniq5', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Hyundai Ioniq5' },
  { id: 'kona_ev', name: 'carModel.hyundai.kona_ev', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Hyundai KonaEV' },
];
const MOCK_CAR_MODELS_KIA: CarModel[] = [
  { id: 'ev6', name: 'carModel.kia.ev6', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Kia EV6' },
  { id: 'niro_ev', name: 'carModel.kia.niro_ev', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Kia NiroEV' },
];
const MOCK_CAR_MODELS_KG: CarModel[] = [
  { id: 'torres_evx', name: 'carModel.kgm.torres_evx', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'KG Mobility TorresEVX' },
  { id: 'korando_emotion', name: 'carModel.kgm.korando_emotion', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'KG Korando eMotion' },
];
const MOCK_CAR_MODELS_TESLA: CarModel[] = [
  { id: 'model_3', name: 'carModel.tesla.model_3', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Tesla Model3' },
  { id: 'model_y', name: 'carModel.tesla.model_y', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Tesla ModelY' },
];

const MOCK_CAR_BRANDS: CarBrand[] = [
  { id: 'hyundai', name: 'carBrand.hyundai', logoUrl: 'https://placehold.co/150x150.png', dataAiHint: 'Hyundai logo', models: MOCK_CAR_MODELS_HYUNDAI },
  { id: 'kia', name: 'carBrand.kia', logoUrl: 'https://placehold.co/150x150.png', dataAiHint: 'Kia logo', models: MOCK_CAR_MODELS_KIA },
  { id: 'kgm', name: 'carBrand.kgm', logoUrl: 'https://placehold.co/150x150.png', dataAiHint: 'KGMobility logo', models: MOCK_CAR_MODELS_KG },
  { id: 'tesla', name: 'carBrand.tesla', logoUrl: 'https://placehold.co/150x150.png', dataAiHint: 'Tesla logo', models: MOCK_CAR_MODELS_TESLA },
];

const MOCK_VEHICLE_DATA: VehicleInfo = {
  licensePlate: `데모-${Math.floor(Math.random() * 900) + 100}`,
  model: "carModel.tesla.model_y",
  portLocationDescription: "selectCarModel.portLocationGeneric",
  connectionImageUrl: 'https://placehold.co/600x400.png',
  dataAiHint: "vehicle charging port",
  confidence: 0.95,
  recommendedConnectorType: 'ccs_combo_2',
};

const MOCK_AVAILABLE_CONNECTORS: ConnectorTypeInfo[] = [
  { id: 'ac_type_1', name: 'connector.ac_type_1.name', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'AC Type1 connector', description: 'connector.ac_type_1.description' },
  { id: 'ccs_combo_2', name: 'connector.ccs_combo_2.name', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'CCS2 DC connector', description: 'connector.ccs_combo_2.description' },
  { id: 'chademo', name: 'connector.chademo.name', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'CHAdeMO DC connector', description: 'connector.chademo.description' },
];

const MOCK_SLOTS_DATA: ChargingSlot[] = [
  { id: 'A1', status: 'available' },
  { id: 'A2', status: 'occupied', vehicle: { licensePlate: "기존-EV", model:"Nissan Leaf"}, estimatedCompletionTime: "10분", currentChargeKW: 60, user:"기존-EV" },
  { id: 'B1', status: 'available' },
  { id: 'B2', status: 'maintenance' },
];

const MOCK_INITIAL_APP_DATA: AppData = {
  vehicleInfo: null,
  chargingInstructions: null,
  assignedSlotId: null,
  currentSlots: MOCK_SLOTS_DATA,
  selectedConnectorType: null,
  finalBill: null,
  receiptPreference: undefined,
  isQueueNotEmpty: false,
  consentSkipped: false,
  selectedBrandId: null,
  language: 'ko',
  currentMode: 'standard',
  chargingErrorMessage: null,
};


export default function KioskPage() {
  const [kioskState, setKioskState] = useState<KioskState>('INITIAL_WELCOME');
  const [appData, setAppData] = useState<AppData>(MOCK_INITIAL_APP_DATA);
  const [disagreeTapCount, setDisagreeTapCount] = useState(0);
  const { toast } = useToast();
  const generalTimerRef = useRef<NodeJS.Timeout | null>(null);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    return translateFunction(appData.language, key, params);
  }, [appData.language]);

  const clearGeneralTimer = useCallback(() => {
    if (generalTimerRef.current) {
      clearTimeout(generalTimerRef.current);
      generalTimerRef.current = null;
    }
  }, []);

  const resetToInitialWelcome = useCallback(() => {
    clearGeneralTimer();
    const freshSlots = MOCK_SLOTS_DATA.map(s => {
        if (s.id === 'A2' && s.status === 'occupied') {
            const currentLang = appData ? appData.language : 'ko';
            const translatedCalculating = translateFunction(currentLang, 'waitTimeDisplay.calculating');
            return {...s, estimatedCompletionTime: translatedCalculating};
        }
        return {...s, status: s.id !== 'B2' ? 'available' : 'maintenance', vehicle: undefined, user: undefined };
    });

    setAppData(prev => ({
      ...MOCK_INITIAL_APP_DATA,
      language: prev.language, // Keep current language on reset
      currentMode: 'standard', // Default to standard mode
      currentSlots: freshSlots,
      consentSkipped: false,
      selectedBrandId: null,
      chargingErrorMessage: null, // Reset error message
    }));
    setDisagreeTapCount(0);
    setKioskState('INITIAL_WELCOME');
  }, [clearGeneralTimer, appData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = appData.language;
      document.title = t(appData.language === 'ko' ? 'layout.title.ko' : 'layout.title.en');
    }
  }, [appData.language, t]);


  useEffect(() => {
    if (kioskState === 'INITIAL_WELCOME' && appData.currentMode === 'standard') {
      clearGeneralTimer();
      generalTimerRef.current = setTimeout(() => {
        setKioskState('DATA_CONSENT');
      }, 10000); 
    }
    return () => {
      if (generalTimerRef.current) {
        clearGeneralTimer();
      }
    };
  }, [kioskState, appData.currentMode, clearGeneralTimer]);


  useEffect(() => {
    if (kioskState === 'WELCOME') {
      clearGeneralTimer();
      generalTimerRef.current = setTimeout(async () => {
        const vehicleWithPortInfo: VehicleInfo = {
          ...MOCK_VEHICLE_DATA,
          licensePlate: `${t('selectCarModel.manualEntryLicensePlate')}-${Math.floor(Math.random() * 900) + 100}`,
          model: MOCK_VEHICLE_DATA.model, 
        };
        setAppData(prev => ({
          ...prev,
          vehicleInfo: vehicleWithPortInfo,
        }));

        if (appData.currentMode === 'quick' && !appData.consentSkipped) {
          toast({ title: t('vehicleConfirmation.quickModeAutoConfirm') });
          console.log('Firebase Log (simulated): quick_mode_vehicle_auto_confirmed, timestamp:', new Date().toISOString(), 'language:', appData.language);
          handleVehicleConfirmed(vehicleWithPortInfo); 
        } else {
          setKioskState('VEHICLE_CONFIRMATION');
        }
      }, 1500);
    }
    return () => clearGeneralTimer();
  }, [kioskState, clearGeneralTimer, t, appData.currentMode, appData.language, appData.consentSkipped]); 


  useEffect(() => {
    if (kioskState === 'THANK_YOU' || kioskState === 'VACATE_SLOT_REMINDER') {
      clearGeneralTimer();
      generalTimerRef.current = setTimeout(resetToInitialWelcome, kioskState === 'VACATE_SLOT_REMINDER' ? (3 * 60 * 1000) : 60000); 
    }
    return () => clearGeneralTimer();
  }, [kioskState, resetToInitialWelcome, clearGeneralTimer]);

  const handleLanguageSwitch = useCallback(() => {
    setAppData(prev => ({
      ...prev,
      language: prev.language === 'ko' ? 'en' : 'ko',
    }));
  }, []);

  const handleQuickStart = () => {
    clearGeneralTimer();
    console.log('Firebase Log (simulated): mode_selected_intent, mode: quick, timestamp:', new Date().toISOString(), 'language:', appData.language);
    setAppData(prev => ({ ...prev, currentMode: 'quick', consentSkipped: false })); 
    setKioskState('DATA_CONSENT'); 
  };

  const handleProceedFromInitialWelcome = () => { 
    clearGeneralTimer();
    setAppData(prev => ({ ...prev, currentMode: 'standard' }));
    setKioskState('DATA_CONSENT');
  };

  const handleConsentAgree = () => { 
    setDisagreeTapCount(0);
    setAppData(prev => ({ ...prev, consentSkipped: false })); 
    console.log('Firebase Log (simulated): consent_agreed, mode:', appData.currentMode, 'timestamp:', new Date().toISOString(), 'language:', appData.language);
    setKioskState('WELCOME');
  };

  const handleConsentDisagree = () => {
    const currentMode = appData.currentMode;
    if (disagreeTapCount === 0) {
        setDisagreeTapCount(1);
        if (currentMode === 'quick') {
            toast({
                title: t('quickMode.disagreeWarning.title'),
                description: t('quickMode.disagreeWarning.description'),
                variant: "destructive",
                duration: 7000,
            });
            console.log('Firebase Log (simulated): quick_mode_consent_disagree_first_tap, timestamp:', new Date().toISOString(), 'language:', appData.language);
        } else { 
            toast({
                title: t('dataConsent.toast.disagreeWarning.title'),
                description: t('dataConsent.toast.disagreeWarning.description'),
                variant: "destructive",
                duration: 7000,
            });
            console.log('Firebase Log (simulated): standard_mode_consent_disagree_first_tap, timestamp:', new Date().toISOString(), 'language:', appData.language);
        }
    } else { 
        setAppData(prev => ({ ...prev, consentSkipped: true, currentMode: 'standard' })); 
        console.log('Firebase Log (simulated): consent_skipped_proceed_manual (forced_standard), timestamp:', new Date().toISOString(), 'language:', appData.language);
        toast({
            title: t('dataConsent.toast.consentSkipped.title'),
            description: t('dataConsent.toast.consentSkipped.description'),
            duration: 5000,
        });
        setDisagreeTapCount(0);
        setKioskState('SELECT_CAR_BRAND'); 
    }
};

  const handleBrandSelected = (brandId: string) => {
    const brand = MOCK_CAR_BRANDS.find(b => b.id === brandId);
    setAppData(prev => ({ ...prev, selectedBrandId: brandId }));
    const brandName = brand ? t(brand.name) : brandId;
    console.log('Firebase Log (simulated): brand_selected, brand:', brandName, 'timestamp:', new Date().toISOString(), 'language:', appData.language);
    toast({
      title: t('selectCarBrand.toast.brandSelected.title'),
      description: t('selectCarBrand.toast.brandSelected.description', { brandName }),
      duration: 3000,
    });
    setKioskState('SELECT_CAR_MODEL');
  };

  const handleModelSelected = (modelInfo: Partial<VehicleInfo>) => {
    const modelName = modelInfo.model ? t(modelInfo.model) : t('selectCarModel.unknownModel');
    console.log('Firebase Log (simulated): model_selected, model:', modelName, 'timestamp:', new Date().toISOString(), 'language:', appData.language);
    toast({
      title: t('selectCarModel.toast.modelSelected.title'),
      description: t('selectCarModel.toast.modelSelected.description', { modelName }),
      duration: 3000,
    });

    let recommendedConnector: string | undefined = modelInfo.recommendedConnectorType;

    if (appData.selectedBrandId) {
      switch (appData.selectedBrandId) {
        case 'hyundai':
        case 'kia':
        case 'tesla': 
          recommendedConnector = 'ccs_combo_2';
          break;
        case 'kgm':
          recommendedConnector = 'chademo'; 
          break;
        default:
          recommendedConnector = 'ccs_combo_2'; 
      }
    }

    setAppData(prev => ({
      ...prev,
      vehicleInfo: {
        licensePlate: modelInfo.licensePlate || t('selectCarModel.manualEntryLicensePlate'),
        model: modelInfo.model || 'selectCarModel.unknownModel',
        confidence: modelInfo.confidence || 1.0,
        portLocationDescription: modelInfo.portLocationDescription || "selectCarModel.portLocationGeneric",
        connectionImageUrl: modelInfo.connectionImageUrl || 'https://placehold.co/600x400.png',
        dataAiHint: modelInfo.dataAiHint || "electric vehicle",
        recommendedConnectorType: recommendedConnector,
      },
    }));
    setKioskState('PRE_PAYMENT_AUTH');
  };

  const handleVehicleConfirmed = (confirmedVehicleInfo: VehicleInfo) => {
    setAppData(prev => ({ ...prev, vehicleInfo: confirmedVehicleInfo }));
    setKioskState('PRE_PAYMENT_AUTH');
  };

  const handlePaymentAuthSuccess = () => {
    toast({
      title: t('prePaymentAuth.toast.success.title'),
      description: t('prePaymentAuth.toast.success.description_select_connector'),
      duration: 3000,
    });
    console.log('Firebase Log (simulated): payment_auth_success, timestamp:', new Date().toISOString(), 'language:', appData.language);

    let currentAssignedSlotId = appData.assignedSlotId;
    if (!currentAssignedSlotId) {
        const availableSlot = appData.currentSlots.find(s => s.status === 'available');
        if (availableSlot) {
            currentAssignedSlotId = availableSlot.id;
            setAppData(prev => ({...prev, assignedSlotId: currentAssignedSlotId}));
        }
    }

    if (currentAssignedSlotId) {
      setKioskState('SELECT_CONNECTOR_TYPE');
    } else {
      setKioskState('QUEUE');
    }
  };

  const handleConnectorTypeSelected = (connectorTypeId: string) => {
    setAppData(prev => ({ ...prev, selectedConnectorType: connectorTypeId }));
    const connector = MOCK_AVAILABLE_CONNECTORS.find(c => c.id === connectorTypeId);
    const connectorName = connector ? t(connector.name) : connectorTypeId;
    console.log('Firebase Log (simulated): connector_selected, mode:', appData.currentMode, 'connector:', connectorName, 'timestamp:', new Date().toISOString(), 'language:', appData.language);
    setKioskState('INITIAL_PROMPT_CONNECT'); 
  };
  
  const handleChargerConnected = () => {
    setKioskState('DETECTING_CONNECTION');
  };

  const handleConnectionDetected = () => {
    if (appData.currentMode === 'quick' && !appData.consentSkipped) {
      toast({ title: t('detectConnection.quickModeAutoStart') });
      console.log('Firebase Log (simulated): quick_mode_charging_auto_start, timestamp:', new Date().toISOString(), 'language:', appData.language);
      handleStartChargingConfirmed(); 
    } else {
      setKioskState('CONFIRM_START_CHARGING');
    }
  };

  const handleStartChargingConfirmed = () => {
    if (appData.assignedSlotId && appData.vehicleInfo && appData.selectedConnectorType) {
      const updatedSlots = appData.currentSlots.map(s =>
        s.id === appData.assignedSlotId
        ? { ...s, status: 'occupied' as 'occupied', vehicle: appData.vehicleInfo, user: appData.vehicleInfo.licensePlate, currentChargeKW: 0, estimatedCompletionTime: t('waitTimeDisplay.calculating') }
        : s
      );
      setAppData(prev => ({ ...prev, currentSlots: updatedSlots }));
      console.log('Firebase Log (simulated): charging_started, mode:', appData.currentMode, 'slot:', appData.assignedSlotId, 'connector:', appData.selectedConnectorType, 'timestamp:', new Date().toISOString(), 'language:', appData.language);
      setKioskState('CHARGING_IN_PROGRESS');
    } else {
      toast({ title: t('toast.error.noSlotInfo.title'), description: t('toast.error.noSlotInfo.description'), variant: "destructive" });
      resetToInitialWelcome();
    }
  };

  const handleChargingStoppedOrCompleted = (bill: BillDetails) => {
    setAppData(prev => ({ ...prev, finalBill: bill }));
    if (appData.assignedSlotId) {
      const updatedSlots = appData.currentSlots.map(s =>
        s.id === appData.assignedSlotId
        ? { ...s, status: 'available' as 'available', vehicle: undefined, user: undefined, currentChargeKW: undefined, estimatedCompletionTime: undefined }
        : s
      );
      const isOtherWaiting = updatedSlots.some(s => s.status === 'occupied'); 
      setAppData(prev => ({ ...prev, currentSlots: updatedSlots, isQueueNotEmpty: isOtherWaiting }));
    }
    console.log('Firebase Log (simulated): charging_completed, mode:', appData.currentMode, 'slot:', appData.assignedSlotId, 'bill_total:', bill.totalCost, 'timestamp:', new Date().toISOString(), 'language:', appData.language);
    setKioskState('CHARGING_COMPLETE_PAYMENT');
  };

  const handlePaymentProcessed = (receiptChoice: 'sms' | 'qr' | 'none') => {
     setAppData(prev => ({ ...prev, receiptPreference: receiptChoice }));
     if (receiptChoice === 'sms') {
      toast({ title: t('payment.toast.smsDemo.title'), description: t('payment.toast.smsDemo.description') });
    }
    console.log('Firebase Log (simulated): payment_processed, mode:', appData.currentMode, 'receipt:', receiptChoice, 'timestamp:', new Date().toISOString(), 'language:', appData.language);
    if (appData.isQueueNotEmpty) { 
        setKioskState('VACATE_SLOT_REMINDER');
    } else {
        setKioskState('THANK_YOU');
    }
  };

  const handleSimulateChargingError = (errorMessageKey: string) => {
    const translatedErrorMessage = t(errorMessageKey);
    setAppData(prev => ({ ...prev, chargingErrorMessage: translatedErrorMessage }));
    setKioskState('CHARGING_ERROR');
    console.log('Firebase Log (simulated): charging_error_simulated, message:', translatedErrorMessage, 'timestamp:', new Date().toISOString(), 'language:', appData.language);
  };

  const handleChargingErrorRetry = () => {
    setAppData(prev => ({ ...prev, chargingErrorMessage: null }));
    // Decide a sensible retry point. Connector selection is often a good place after a charging attempt fails.
    setKioskState('SELECT_CONNECTOR_TYPE'); 
  };


  const renderKioskScreen = () => {
    const screenProps = { lang: appData.language, t, onLanguageSwitch: handleLanguageSwitch };
    switch (kioskState) {
      case 'INITIAL_WELCOME':
        return <InitialWelcomeScreen {...screenProps} onProceedStandard={handleProceedFromInitialWelcome} onProceedQuick={handleQuickStart} />;
      case 'DATA_CONSENT':
        return <DataConsentScreen {...screenProps} onAgree={handleConsentAgree} onDisagree={handleConsentDisagree} disagreeTapCount={disagreeTapCount} />;
      case 'SELECT_CAR_BRAND':
        return <SelectCarBrandScreen {...screenProps} brands={MOCK_CAR_BRANDS} onBrandSelect={handleBrandSelected} onCancel={resetToInitialWelcome} />;
      case 'SELECT_CAR_MODEL':
        const selectedBrand = MOCK_CAR_BRANDS.find(b => b.id === appData.selectedBrandId);
        return <SelectCarModelScreen {...screenProps} brand={selectedBrand} onModelSelect={handleModelSelected} onCancel={() => setKioskState('SELECT_CAR_BRAND')} />;
      case 'WELCOME':
        return <WelcomeScreen {...screenProps} quickMode={appData.currentMode === 'quick' && !appData.consentSkipped} />;
      case 'VEHICLE_CONFIRMATION':
        if (!appData.vehicleInfo) return <WelcomeScreen {...screenProps} quickMode={appData.currentMode === 'quick' && !appData.consentSkipped} />;
        return <VehicleConfirmationScreen {...screenProps} vehicleInfo={appData.vehicleInfo} onConfirm={handleVehicleConfirmed} />;
      case 'PRE_PAYMENT_AUTH':
        return <PrePaymentAuthScreen {...screenProps} onAuthSuccess={handlePaymentAuthSuccess} onCancel={resetToInitialWelcome} />;
      case 'SELECT_CONNECTOR_TYPE':
        return <SelectConnectorTypeScreen {...screenProps} vehicleInfo={appData.vehicleInfo} availableConnectors={MOCK_AVAILABLE_CONNECTORS} onConnectorSelect={handleConnectorTypeSelected} onCancel={resetToInitialWelcome} />;
      case 'INITIAL_PROMPT_CONNECT':
        if (!appData.vehicleInfo || !appData.assignedSlotId) {
             console.warn("Missing vehicle or slot info for INITIAL_PROMPT_CONNECT, showing SlotAssignment or Queue");
             return <SlotAssignmentScreen {...screenProps} isQueue={!appData.assignedSlotId}/>; 
        }
        if(appData.currentMode === 'standard' && (appData.consentSkipped || (appData.vehicleInfo.confidence === undefined || appData.vehicleInfo.confidence < 1.0) )) {
            console.log('Firebase Log (simulated): entered_connect_screen (manual_flow_or_after_payment_auth), timestamp:', new Date().toISOString(), 'language:', appData.language);
        }
        return <InitialPromptConnectScreen {...screenProps} vehicleInfo={appData.vehicleInfo} slotNumber={appData.assignedSlotId} onChargerConnected={handleChargerConnected} />;
      case 'DETECTING_CONNECTION':
        if (!appData.vehicleInfo) { 
             console.warn("Missing vehicle info for DETECTING_CONNECTION, showing SlotAssignment.");
             return <SlotAssignmentScreen {...screenProps} isQueue={!appData.currentSlots.some(s => s.status === 'available')} />;
        }
        return <DetectConnectionScreen {...screenProps} vehicleModelKey={appData.vehicleInfo.model} onDetectionComplete={handleConnectionDetected} />;
      case 'CONFIRM_START_CHARGING':
        return <ConfirmStartChargingScreen {...screenProps} onStart={handleStartChargingConfirmed} onCancel={resetToInitialWelcome} />;
      case 'CHARGING_IN_PROGRESS':
        if (!appData.assignedSlotId || !appData.selectedConnectorType) {
          toast({ title: t('toast.error.noSlotInfo.title'), description: t('toast.error.noSlotInfo.description'), variant: "destructive" });
          resetToInitialWelcome();
          return <SlotAssignmentScreen {...screenProps} isQueue={!appData.currentSlots.some(s => s.status === 'available')} />;
        }
        return <ChargingInProgressScreen
                  {...screenProps}
                  slotNumber={appData.assignedSlotId}
                  selectedConnectorType={appData.selectedConnectorType}
                  initialBill={{ kwhUsed: 0, durationMinutes: 0, totalCost: 0 }}
                  estimatedTotalTimeMinutes={30} 
                  onStopCharging={handleChargingStoppedOrCompleted}
                  onChargingComplete={handleChargingStoppedOrCompleted}
                  onSimulateError={handleSimulateChargingError}
                  allSlots={appData.currentSlots}
               />;
      case 'CHARGING_COMPLETE_PAYMENT':
         if (!appData.finalBill) {
             console.error("Final bill is null in CHARGING_COMPLETE_PAYMENT state. Resetting.");
             toast({ title: t('error.genericTitle'), description: "Error processing payment details.", variant: "destructive" });
             resetToInitialWelcome();
             return <SlotAssignmentScreen {...screenProps} isQueue={!appData.currentSlots.some(s => s.status === 'available')} />;
         }
        return <PaymentScreen {...screenProps} bill={appData.finalBill} onPaymentProcessed={handlePaymentProcessed} />;
      case 'VACATE_SLOT_REMINDER':
        return <VacateSlotReminderScreen {...screenProps} onDismiss={resetToInitialWelcome} isQueueNotEmpty={appData.isQueueNotEmpty} />;
      case 'THANK_YOU':
        return <ThankYouScreen {...screenProps} receiptType={appData.receiptPreference} onNewSession={resetToInitialWelcome} />;
      case 'QUEUE':
        return <QueueScreen {...screenProps} queuePosition={1} estimatedWaitTimeKey="queue.defaultWaitTime" onCancel={resetToInitialWelcome} />;
      case 'CHARGING_ERROR':
        return <ChargingErrorScreen {...screenProps} errorMessage={appData.chargingErrorMessage} onRetry={handleChargingErrorRetry} onCancel={resetToInitialWelcome} />;
      case 'SCANNING':
      case 'ASSIGNING_SLOT':
        return <SlotAssignmentScreen {...screenProps} isQueue={!appData.currentSlots.some(s => s.status === 'available')} />;
      default:
        console.warn(`Unhandled kiosk state: ${kioskState}, resetting to initial welcome.`);
        resetToInitialWelcome();
        return <InitialWelcomeScreen {...screenProps} onProceedStandard={handleProceedFromInitialWelcome} onProceedQuick={handleQuickStart} />;
    }
  };
  
  return (
    <main className="w-screen h-screen overflow-hidden">
      {renderKioskScreen()}
    </main>
  );
}
