
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { KioskState, VehicleInfo, ChargingSlot, AppData, ConnectorTypeInfo, BillDetails, OperatingMode } from '@/types/kiosk';
import type { CarBrand, CarModel } from '@/types/kiosk';
import { useToast } from "@/hooks/use-toast";
import { Language, t as translateFunction } from '@/lib/translations';

import { FullScreenCameraView } from '@/components/kiosk/FullScreenCameraView';
import { InitialWelcomeScreen } from '@/components/kiosk/InitialWelcomeScreen';
import { findVehicleByPlate } from '@/lib/vehicleLookup';
// import { LiveCameraFeedScreen } from '@/components/kiosk/LiveCameraFeedScreen'; // Removed
import { DataConsentScreen } from '@/components/kiosk/DataConsentScreen';
import { ManualPlateInputScreen } from '@/components/kiosk/ManualPlateInputScreen';
import { SelectCarBrandScreen } from '@/components/kiosk/SelectCarBrandScreen';
import { SelectCarModelScreen } from '@/components/kiosk/SelectCarModelScreen';
import { PrePaymentAuthScreen } from '@/components/kiosk/PrePaymentAuthScreen';
import { InitialPromptConnectScreen } from '@/components/kiosk/InitialPromptConnectScreen';
import { SelectConnectorTypeScreen } from '@/components/kiosk/SelectConnectorTypeScreen';
import { DetectConnectionScreen } from '@/components/kiosk/DetectConnectionScreen';
import { ConfirmStartChargingScreen } from '@/components/kiosk/ConfirmStartChargingScreen';
import { VacateSlotReminderScreen } from '@/components/kiosk/VacateSlotReminderScreen';
import { VehicleConfirmationScreen } from '@/components/kiosk/VehicleConfirmationScreen';
import { SlotAssignmentScreen } from '@/components/kiosk/SlotAssignmentScreen';
import { QueueScreen } from '@/components/kiosk/QueueScreen';
import { ChargingInProgressScreen } from '@/components/kiosk/ChargingInProgressScreen';
import { PaymentScreen } from '@/components/kiosk/PaymentScreen';
import { ThankYouScreen } from '@/components/kiosk/ThankYouScreen';
import { ChargingErrorScreen } from '@/components/kiosk/ChargingErrorScreen';
import Image from 'next/image';
import chargingImage from '/public/assets/images/charging.png';
import {
  MOCK_CAR_BRANDS,
  MOCK_CAR_MODELS_HYUNDAI,
  MOCK_CAR_MODELS_KIA,
  MOCK_CAR_MODELS_KG,
  MOCK_CAR_MODELS_TESLA,
} from '@/lib/mockData';

const MOCK_VEHICLE_DATA: VehicleInfo = {
  licensePlate: `데모-${Math.floor(Math.random() * 900) + 100}`,
  model: "carModel.tesla.model_y",
  portLocationDescription: "selectCarModel.portLocationGeneric",
  connectionImageUrl: '/images/dldl.png', // 기본값을 CCS2 이미지로 설정
  dataAiHint: "vehicle charging",
  confidence: 0.95,
  recommendedConnectorType: 'ccs_combo_2',
};

const MOCK_AVAILABLE_CONNECTORS: ConnectorTypeInfo[] = [
  {
    id: 'ac_type_1',
    name: 'connector.ac_type_1.name',
    imageUrl: '/images/AC.png',
    dataAiHint: 'AC connector',
    description: 'connector.ac_type_1.description',
  },
  {
    id: 'ccs_combo_2',
    name: 'connector.ccs_combo_2.name',
    imageUrl: '/images/CCS2.png',
    dataAiHint: 'CCS2 connector',
    description: 'connector.ccs_combo_2.description',
  },
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
  currentMode: 'standard', // Default to standard as quick start button is removed
  chargingErrorMessage: null,
};

const CHARGING_PROGRESS_STORAGE_KEY = 'kioskChargingProgressState';
const RETURN_STATE_KEY = 'kioskReturnState';
const CURRENT_STATE_KEY = 'kioskCurrentState';
const CURRENT_APPDATA_KEY = 'kioskCurrentAppData';

export default function KioskPage() {
  const [kioskState, setKioskState] = useState<KioskState>('PRE_PROCESSING_CAMERA_FEED');
  const [appData, setAppData] = useState<AppData>(MOCK_INITIAL_APP_DATA);
  const [disagreeTapCount, setDisagreeTapCount] = useState(0);
  const { toast } = useToast();

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    return translateFunction(appData.language, key, params);
  }, [appData.language]);

  const resetToInitialWelcome = useCallback(() => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem(CHARGING_PROGRESS_STORAGE_KEY);
        sessionStorage.removeItem(CURRENT_STATE_KEY);
        sessionStorage.removeItem(CURRENT_APPDATA_KEY);
        localStorage.removeItem('kioskNextState');
        localStorage.removeItem('kioskFinalBill');
        localStorage.removeItem('kioskChargingErrorMessage');
        localStorage.removeItem(RETURN_STATE_KEY);
    }
    const freshSlots = MOCK_SLOTS_DATA.map(s => {
        if (s.id === 'A2' && s.status === 'occupied') {
            const translatedCalculating = translateFunction(appData.language, 'waitTimeDisplay.calculating');
            return {...s, estimatedCompletionTime: translatedCalculating};
        }
        return {...s, status: s.id !== 'B2' ? 'available' : 'maintenance', vehicle: undefined, user: undefined };
    });

    setAppData(prev => ({
      ...MOCK_INITIAL_APP_DATA,
      language: prev.language, 
      currentMode: 'standard', 
      currentSlots: freshSlots,
      consentSkipped: false, 
      selectedBrandId: null, 
      chargingErrorMessage: null, 
    }));
    setDisagreeTapCount(0);
    
    setKioskState('INITIAL_WELCOME');
  }, [appData.language]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = appData.language;
      document.title = t(appData.language === 'ko' ? 'layout.title.ko' : 'layout.title.en');
    }
  }, [appData.language, t]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(CURRENT_STATE_KEY, kioskState);
      sessionStorage.setItem(CURRENT_APPDATA_KEY, JSON.stringify(appData));
    }
  }, [kioskState, appData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const nextState = localStorage.getItem('kioskNextState');
      const finalBillString = localStorage.getItem('kioskFinalBill');
      const chargingErrorMsg = localStorage.getItem('kioskChargingErrorMessage');

      if (nextState === 'CHARGING_COMPLETE_PAYMENT' && finalBillString) {
        try {
          const finalBill: BillDetails = JSON.parse(finalBillString);
          setAppData(prev => ({ ...prev, finalBill, chargingErrorMessage: null }));
          setKioskState('CHARGING_COMPLETE_PAYMENT');
        } catch (error) {
          console.error("Error parsing finalBill from localStorage:", error);
          resetToInitialWelcome(); 
        } finally {
          localStorage.removeItem('kioskNextState');
          localStorage.removeItem('kioskFinalBill');
          localStorage.removeItem('kioskChargingErrorMessage'); 
        }
      } else if (nextState === 'CHARGING_ERROR' && chargingErrorMsg) {
        setAppData(prev => ({ ...prev, finalBill: null, chargingErrorMessage: chargingErrorMsg }));
        setKioskState('CHARGING_ERROR');
        localStorage.removeItem('kioskNextState');
        localStorage.removeItem('kioskFinalBill');
        localStorage.removeItem('kioskChargingErrorMessage');
      }
    }
  }, [resetToInitialWelcome]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const returnState = localStorage.getItem(RETURN_STATE_KEY);
      if (returnState) {
        localStorage.removeItem(RETURN_STATE_KEY);
        const savedState = sessionStorage.getItem(CURRENT_STATE_KEY);
        const savedApp = sessionStorage.getItem(CURRENT_APPDATA_KEY);
        if (savedState && savedApp) {
          try {
            const parsedApp = JSON.parse(savedApp) as AppData;
            setAppData(parsedApp);
            setKioskState(savedState as KioskState);
            return;
          } catch (e) {
            console.error('Failed to restore kiosk state from sessionStorage', e);
          }
        }
        setKioskState(returnState as KioskState);
      }
    }
  }, []);



  useEffect(() => {
    let specificResetTimer: NodeJS.Timeout | null = null;

    const initiateResetCountdown = () => {
      cancelResetCountdown(); 
      specificResetTimer = setTimeout(() => {
        resetToInitialWelcome();
      }, kioskState === 'VACATE_SLOT_REMINDER' ? (3 * 60 * 1000) : 60000); 
    };

    const cancelResetCountdown = () => {
      if (specificResetTimer) {
        clearTimeout(specificResetTimer);
        specificResetTimer = null;
      }
    };

    const handleVisibilityChange = () => {
      if (kioskState === 'THANK_YOU' || kioskState === 'VACATE_SLOT_REMINDER') {
        if (document.visibilityState === 'visible') {
          initiateResetCountdown(); 
        } else {
          cancelResetCountdown(); 
        }
      }
    };

    if (kioskState === 'THANK_YOU' || kioskState === 'VACATE_SLOT_REMINDER') {
      if (document.visibilityState === 'visible') {
        initiateResetCountdown(); 
      }
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } else {
      cancelResetCountdown(); 
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelResetCountdown(); 
    };
  }, [kioskState, resetToInitialWelcome]);


  const handleLanguageSwitch = useCallback(() => {
    setAppData(prev => ({
      ...prev,
      language: prev.language === 'ko' ? 'en' : 'ko',
    }));
  }, []);
  

  const handleProceedFromFullScreenCamera = useCallback(() => {
    setKioskState('INITIAL_WELCOME');
  }, []);
  
  const handleCameraScanComplete = useCallback(() => {
    const scannedVehicleInfo: VehicleInfo = {
      ...MOCK_VEHICLE_DATA,
      licensePlate: `AI-${Math.floor(Math.random() * 9000) + 1000}`, 
      confidence: 0.98,
    };

    setAppData(prev => ({
      ...prev,
      vehicleInfo: scannedVehicleInfo,
    }));

    console.log('Firebase Log (simulated): camera_scan_complete (generic handler), vehicle_plate:', scannedVehicleInfo.licensePlate, 'timestamp:', new Date().toISOString(), 'language:', appData.language);
    
    setKioskState('DATA_CONSENT');
  }, [appData.language]);


  const handleProceedFromInitialWelcome = () => {
    setAppData(prev => ({ ...prev, currentMode: 'standard' }));

    const scannedVehicleInfo: VehicleInfo = {
      ...MOCK_VEHICLE_DATA,
      licensePlate: `AI-STD-${Math.floor(Math.random() * 9000) + 1000}`, 
      confidence: 0.98, 
    };

    setAppData(prev => ({
      ...prev,
      vehicleInfo: scannedVehicleInfo,
    }));

    console.log('Firebase Log (simulated): standard_mode_scan_simulated, vehicle_plate:', scannedVehicleInfo.licensePlate, 'timestamp:', new Date().toISOString(), 'language:', appData.language);
    
    setKioskState('DATA_CONSENT');
  };

  const handleProceedQuickStart = () => {
    setAppData(prev => ({ ...prev, currentMode: 'quick' }));

    const scannedVehicleInfo: VehicleInfo = {
      ...MOCK_VEHICLE_DATA,
      licensePlate: `AI-QCK-${Math.floor(Math.random() * 9000) + 1000}`,
      confidence: 0.98,
    };

    setAppData(prev => ({
      ...prev,
      vehicleInfo: scannedVehicleInfo,
    }));

    console.log('Firebase Log (simulated): quick_start_scan_simulated, vehicle_plate:', scannedVehicleInfo.licensePlate, 'timestamp:', new Date().toISOString(), 'language:', appData.language);

    setKioskState('DATA_CONSENT');
  };

  const handleConsentAgree = () => {
    setDisagreeTapCount(0);
    setAppData(prev => ({ ...prev, consentSkipped: false }));
    console.log('Firebase Log (simulated): consent_agreed, mode:', appData.currentMode, 'timestamp:', new Date().toISOString(), 'language:', appData.language);
    setKioskState('VEHICLE_CONFIRMATION');
  };

const handleConsentDisagree = () => {
    toast({
        title: t('dataConsent.toast.disagreeWarning.title'),
        description: t('dataConsent.toast.disagreeWarning.description'),
        variant: 'destructive',
        duration: 7000,
    });
    console.log('Firebase Log (simulated): consent_disagreed, timestamp:', new Date().toISOString(), 'language:', appData.language);
    setDisagreeTapCount(0);
    resetToInitialWelcome();
};

  const handleManualPlateSubmitted = useCallback((plate: string) => {
    const known = findVehicleByPlate(plate);
    if (known) {
      setAppData(prev => ({
        ...prev,
        vehicleInfo: {
          licensePlate: plate,
          model: `carModel.${known.brandId}.${known.modelId}`,
          confidence: 1.0,
        },
        selectedBrandId: known.brandId,
      }));
      setKioskState('PRE_PAYMENT_AUTH');
    } else {
      setAppData(prev => ({
        ...prev,
        vehicleInfo: {
          licensePlate: plate,
          model: 'selectCarModel.unknownModel',
          confidence: 1.0,
        },
        selectedBrandId: null,
      }));
      setKioskState('SELECT_CAR_BRAND');
    }
  }, []);

  const handleBrandSelected = useCallback((brandId: string) => {
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
  }, [appData.language, t, toast]);

  const handleModelSelected = useCallback((modelInfo: Partial<VehicleInfo>) => {
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
        case 'kgm':
          recommendedConnector = 'ccs_combo_2';
          break;
        default:
          recommendedConnector = 'ccs_combo_2';
      }
    }

    setAppData(prev => ({
      ...prev,
      vehicleInfo: {
        licensePlate: modelInfo.licensePlate || prev.vehicleInfo?.licensePlate || t('selectCarModel.manualEntryLicensePlate'),
        model: modelInfo.model || 'selectCarModel.unknownModel',
        confidence: modelInfo.confidence || 1.0,
        portLocationDescription: modelInfo.portLocationDescription || "selectCarModel.portLocationGeneric",
        connectionImageUrl: modelInfo.connectionImageUrl || 'https://placehold.co/600x400.png',
        dataAiHint: modelInfo.dataAiHint || "electric vehicle",
        recommendedConnectorType: recommendedConnector,
      },
    }));
    setKioskState('PRE_PAYMENT_AUTH');
  }, [appData.selectedBrandId, appData.language, t, toast]);

  const handleVehicleConfirmed = useCallback((confirmedVehicleInfo: VehicleInfo) => {
    setAppData(prev => ({ ...prev, vehicleInfo: confirmedVehicleInfo }));
    console.log('Firebase Log (simulated): vehicle_confirmed, mode:', appData.currentMode, 'license_plate:', confirmedVehicleInfo.licensePlate, 'timestamp:', new Date().toISOString(), 'language:', appData.language);
    setKioskState('PRE_PAYMENT_AUTH');
  }, [appData.currentMode, appData.language]);

  const handlePaymentAuthSuccess = useCallback(() => {
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
            setAppData(prev => ({...prev, assignedSlotId: availableSlot.id}));
        } else {
            setKioskState('QUEUE');
            return;
        }
    }

    setKioskState('SELECT_CONNECTOR_TYPE');

  }, [appData.assignedSlotId, appData.currentSlots, appData.language, t, toast]);

  const handleConnectorTypeSelected = useCallback((connectorTypeId: string) => {
    setAppData(prev => ({ ...prev, selectedConnectorType: connectorTypeId }));
    const connector = MOCK_AVAILABLE_CONNECTORS.find(c => c.id === connectorTypeId);
    const connectorName = connector ? t(connector.name) : connectorTypeId;
    console.log('Firebase Log (simulated): connector_selected, mode:', appData.currentMode, 'connector:', connectorName, 'timestamp:', new Date().toISOString(), 'language:', appData.language);
    setKioskState('INITIAL_PROMPT_CONNECT');
  }, [appData.currentMode, appData.language, t]);

  const handleChargerConnected = useCallback(() => {
    setKioskState('DETECTING_CONNECTION');
  }, []);

  const handleStartChargingConfirmed = useCallback(() => {
    if (appData.assignedSlotId && appData.vehicleInfo && appData.selectedConnectorType) {
      const updatedSlots = appData.currentSlots.map(s =>
        s.id === appData.assignedSlotId
        ? { ...s, status: 'occupied' as 'occupied', vehicle: appData.vehicleInfo!, user: appData.vehicleInfo!.licensePlate, currentChargeKW: 0, estimatedCompletionTime: t('waitTimeDisplay.calculating') }
        : s
      );
      setAppData(prev => ({ ...prev, currentSlots: updatedSlots }));
      console.log('Firebase Log (simulated): charging_started, mode:', appData.currentMode, 'slot:', appData.assignedSlotId, 'connector:', appData.selectedConnectorType, 'timestamp:', new Date().toISOString(), 'language:', appData.language);
      setKioskState('CHARGING_IN_PROGRESS');
    } else {
      toast({ title: t('toast.error.noSlotInfo.title'), description: t('toast.error.noSlotInfo.description'), variant: "destructive" });
      resetToInitialWelcome();
    }
  }, [appData.assignedSlotId, appData.vehicleInfo, appData.selectedConnectorType, appData.currentSlots, appData.currentMode, appData.language, t, toast, resetToInitialWelcome]);

  const handleConnectionDetected = useCallback(() => {
    // Since quick mode is removed, auto-start logic is simplified or removed.
    // Assuming standard mode always requires confirmation.
    setKioskState('CONFIRM_START_CHARGING');
  }, []);


  const handleChargingStoppedOrCompleted = useCallback((bill: BillDetails) => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem(CHARGING_PROGRESS_STORAGE_KEY);
    }
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
  }, [appData.assignedSlotId, appData.currentSlots, appData.currentMode, appData.language]);

  const handlePaymentProcessed = useCallback((receiptChoice: 'sms' | 'none') => {
     setAppData(prev => ({ ...prev, receiptPreference: receiptChoice }));
     if (receiptChoice === 'sms') {
      toast({ title: t('payment.toast.smsDemo.title'), description: t('payment.toast.smsDemo.description') });
    }
    console.log('Firebase Log (simulated): payment_processed, mode:', appData.currentMode, 'receipt:', receiptChoice, 'timestamp:', new Date().toISOString(), 'language:', appData.language);

    // Always show the thank you screen after the receipt step
    setKioskState('THANK_YOU');
  }, [appData.currentMode, appData.language, t, toast]);

  const handleSimulateChargingError = useCallback((_errorMessageKey: string) => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem(CHARGING_PROGRESS_STORAGE_KEY);
    }
    const translatedErrorMessage = t(_errorMessageKey);
    setAppData(prev => ({ ...prev, chargingErrorMessage: translatedErrorMessage }));
    
    if (typeof window !== 'undefined') {
        localStorage.setItem('kioskNextState', 'CHARGING_ERROR');
        localStorage.setItem('kioskChargingErrorMessage', translatedErrorMessage);
    }
    
    setKioskState('CHARGING_ERROR'); 
    console.log('Firebase Log (user_action): "Charger Connection Error" button pressed, navigating to error screen. Timestamp:', new Date().toISOString(), 'language:', appData.language);
  }, [appData.language, t]);

  const handleChargingErrorRetry = useCallback(() => {
    setAppData(prev => ({ ...prev, chargingErrorMessage: null }));
    // Simplified as quick mode is removed. Always go to connector selection.
    setKioskState('SELECT_CONNECTOR_TYPE');
  }, [resetToInitialWelcome]);


  const renderKioskScreen = () => {
    const screenProps = { lang: appData.language, t, onLanguageSwitch: handleLanguageSwitch };
    switch (kioskState) {
      case 'PRE_PROCESSING_CAMERA_FEED':
        return <FullScreenCameraView {...screenProps} onProceedWithoutCamera={handleProceedFromFullScreenCamera} />;
      case 'INITIAL_WELCOME':
        return <InitialWelcomeScreen {...screenProps} onProceedStandard={handleProceedFromInitialWelcome} onProceedQuickStart={handleProceedQuickStart} />;
      case 'DATA_CONSENT':
        return <DataConsentScreen {...screenProps} onAgree={handleConsentAgree} onDisagree={handleConsentDisagree} disagreeTapCount={disagreeTapCount} />;
      case 'MANUAL_PLATE_INPUT':
        return <ManualPlateInputScreen {...screenProps} onSubmit={handleManualPlateSubmitted} onCancel={resetToInitialWelcome} />;
      case 'SELECT_CAR_BRAND':
        return <SelectCarBrandScreen {...screenProps} brands={MOCK_CAR_BRANDS} onBrandSelect={handleBrandSelected} onCancel={resetToInitialWelcome} />;
      case 'SELECT_CAR_MODEL':
        const selectedBrand = MOCK_CAR_BRANDS.find(b => b.id === appData.selectedBrandId);
        return <SelectCarModelScreen {...screenProps} brand={selectedBrand} onModelSelect={handleModelSelected} onCancel={() => setKioskState('SELECT_CAR_BRAND')} />;
      case 'VEHICLE_CONFIRMATION':
        if (!appData.vehicleInfo) {
             console.warn("Missing vehicleInfo for VEHICLE_CONFIRMATION. Resetting.");
             resetToInitialWelcome();
             return <InitialWelcomeScreen {...screenProps} onProceedStandard={handleProceedFromInitialWelcome} onProceedQuickStart={handleProceedQuickStart} />;
        }
        return (
          <VehicleConfirmationScreen
            {...screenProps}
            vehicleInfo={appData.vehicleInfo}
            onConfirm={handleVehicleConfirmed}
            onSelectCarModelManually={() => setKioskState('SELECT_CAR_BRAND')}
          />
        );
      case 'PRE_PAYMENT_AUTH':
        return <PrePaymentAuthScreen {...screenProps} onAuthSuccess={handlePaymentAuthSuccess} onCancel={resetToInitialWelcome} />;
      case 'SELECT_CONNECTOR_TYPE':
        return <SelectConnectorTypeScreen {...screenProps} vehicleInfo={appData.vehicleInfo} availableConnectors={MOCK_AVAILABLE_CONNECTORS} onConnectorSelect={handleConnectorTypeSelected} onCancel={resetToInitialWelcome} onSelectCarModelManually={() => setKioskState('SELECT_CAR_BRAND')} />;
      case 'INITIAL_PROMPT_CONNECT':
        if (!appData.vehicleInfo || !appData.assignedSlotId) {
             console.warn("Missing vehicle or slot info for INITIAL_PROMPT_CONNECT. Handling...");
             if (!appData.assignedSlotId) { 
                setKioskState(appData.currentSlots.find(s => s.status === 'available') ? 'SELECT_CONNECTOR_TYPE' : 'QUEUE');
                return <SlotAssignmentScreen {...screenProps} isQueue={!appData.currentSlots.some(s => s.status === 'available')}/>; 
             }
             resetToInitialWelcome();
             return <InitialWelcomeScreen {...screenProps} onProceedStandard={handleProceedFromInitialWelcome} onProceedQuickStart={handleProceedQuickStart} />;
        }
        return <InitialPromptConnectScreen {...screenProps} vehicleInfo={appData.vehicleInfo} slotNumber={appData.assignedSlotId} onChargerConnected={handleChargerConnected} />;
      case 'DETECTING_CONNECTION':
        if (!appData.vehicleInfo) { 
             console.warn("Missing vehicle info for DETECTING_CONNECTION, showing SlotAssignment.");
             resetToInitialWelcome(); 
             return <InitialWelcomeScreen {...screenProps} onProceedStandard={handleProceedFromInitialWelcome} onProceedQuickStart={handleProceedQuickStart} />;
        }
        return <DetectConnectionScreen {...screenProps} vehicleModelKey={appData.vehicleInfo.model} onDetectionComplete={handleConnectionDetected} />;
      case 'CONFIRM_START_CHARGING':
        return <ConfirmStartChargingScreen {...screenProps} onStart={handleStartChargingConfirmed} onCancel={resetToInitialWelcome} />;
      case 'CHARGING_IN_PROGRESS':
        if (!appData.assignedSlotId || !appData.selectedConnectorType || !appData.vehicleInfo) {
          toast({ title: t('toast.error.noSlotInfo.title'), description: t('toast.error.noSlotInfo.description'), variant: "destructive" });
          resetToInitialWelcome();
          return <InitialWelcomeScreen {...screenProps} onProceedStandard={handleProceedFromInitialWelcome} onProceedQuickStart={handleProceedQuickStart} />;
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
             return <InitialWelcomeScreen {...screenProps} onProceedStandard={handleProceedFromInitialWelcome} onProceedQuickStart={handleProceedQuickStart} />;
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
        console.warn('Unhandled kiosk state: ' + kioskState + ', resetting to initial welcome.');
        resetToInitialWelcome(); 
        return <InitialWelcomeScreen {...screenProps} onProceedStandard={handleProceedFromInitialWelcome} onProceedQuickStart={handleProceedQuickStart} />;
    }
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-card text-card-foreground">
      {renderKioskScreen()}
    </main>
  );
}
