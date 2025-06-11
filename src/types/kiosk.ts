
import type { Language } from '@/lib/translations';

export interface VehicleInfo {
  licensePlate: string;
  model: string; // This could be a translation key like "carModel.hyundai.ioniq5"
  confidence?: number;
  portSide?: 'left' | 'right' | 'front' | 'rear';
  portLocationDescription?: string; // This could also be a translation key or dynamic
  connectionImageUrl?: string;
  dataAiHint?: string;
  recommendedConnectorType?: string;
}

export interface ChargingInstructions { // This seems unused
  chargerType: string;
  operationalInstructions: string;
}

export interface ChargingSlot {
  id: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance' | 'almost_done';
  vehicle?: VehicleInfo; // Vehicle model within this might be a translation key
  estimatedCompletionTime?: string; // e.g., "10분" or "10 minutes" - needs i18n formatting
  currentChargeKW?: number;
  user?: string;
}

export interface LocalBusiness {
  id: string;
  name: string; // translation key e.g., "localBusiness.cafe.name"
  type: string; // translation key e.g., "localBusiness.cafe.type"
  description: string; // translation key e.g., "localBusiness.cafe.description"
  logoUrl?: string;
  dataAiHint?: string;
  distance?: string; // translation key e.g., "localBusiness.cafe.distance"
}

export interface BillDetails {
  kwhUsed: number;
  durationMinutes: number;
  totalCost: number;
}

export interface ConnectorTypeInfo {
  id: string;
  name: string; // translation key e.g., "connector.ac_type_1.name"
  imageUrl: string;
  dataAiHint?: string;
  description?: string; // translation key e.g., "connector.ac_type_1.description"
}

export interface CarModel {
  id: string; // e.g. 'ioniq5'
  name: string; // translation key e.g., "carModel.hyundai.ioniq5"
  imageUrl: string;
  dataAiHint?: string;
}

export interface CarBrand {
  id: string; // e.g. 'hyundai'
  name: string; // translation key e.g., "carBrand.hyundai"
  logoUrl: string;
  dataAiHint?: string;
  models: CarModel[];
}

export interface NoticeItem {
  id: string;
  title: string; // translation key e.g., "notice1.title"
  content: string; // translation key e.g., "notice1.content"
  date: string;
  imageUrl?: string;
  dataAiHint?: string;
}


export type KioskState =
  | 'INITIAL_WELCOME'
  | 'DATA_CONSENT'
  | 'WELCOME'
  | 'VEHICLE_CONFIRMATION'
  | 'QUEUE'
  | 'PRE_PAYMENT_AUTH'
  | 'INITIAL_PROMPT_CONNECT'
  | 'SELECT_CONNECTOR_TYPE'
  | 'DETECTING_CONNECTION'
  | 'CONFIRM_START_CHARGING'
  | 'CHARGING_IN_PROGRESS'
  | 'CHARGING_COMPLETE_PAYMENT'
  | 'VACATE_SLOT_REMINDER'
  | 'PAYMENT'
  | 'THANK_YOU'
  | 'SCANNING'
  | 'ASSIGNING_SLOT'
  | 'SELECT_CAR_BRAND'
  | 'SELECT_CAR_MODEL'
  | 'CHARGING_ERROR';

export type OperatingMode = 'standard' | 'quick';

export interface AppData {
  vehicleInfo: VehicleInfo | null;
  chargingInstructions: ChargingInstructions | null;
  assignedSlotId: string | null;
  currentSlots: ChargingSlot[];
  selectedConnectorType: string | null;
  finalBill: BillDetails | null;
  receiptPreference?: 'sms' | 'qr' | 'none';
  isQueueNotEmpty?: boolean;
  consentSkipped?: boolean; // True if user explicitly skipped consent in standard mode
  selectedBrandId?: string | null;
  language: Language;
  currentMode: OperatingMode;
  chargingErrorMessage: string | null;
}

    
