import type { CarBrand, CarModel } from '@/types/kiosk';

export const MOCK_CAR_MODELS_HYUNDAI: CarModel[] = [
  { id: 'ioniq5', name: 'carModel.hyundai.ioniq5', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Hyundai Ioniq5' },
  { id: 'kona_ev', name: 'carModel.hyundai.kona_ev', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Hyundai KonaEV' },
  { id: 'ioniq6', name: 'carModel.hyundai.ioniq6', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Hyundai Ioniq6' },
  { id: 'nexo', name: 'carModel.hyundai.nexo', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Hyundai Nexo' },
  { id: 'casper_ev', name: 'carModel.hyundai.casper_ev', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Hyundai CasperEV' },
  { id: 'porter_ev', name: 'carModel.hyundai.porter_ev', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Hyundai PorterEV' },
];

export const MOCK_CAR_MODELS_KIA: CarModel[] = [
  { id: 'ev6', name: 'carModel.kia.ev6', imageUrl: '/images/ev6.jpg', dataAiHint: 'Kia EV6' },
  { id: 'niro_ev', name: 'carModel.kia.niro_ev', imageUrl: '/images/niro ev.png', dataAiHint: 'Kia NiroEV' },
  { id: 'ev9', name: 'carModel.kia.ev9', imageUrl: '/images/ev9.jpg', dataAiHint: 'Kia EV9' },
  { id: 'ev4', name: 'carModel.kia.ev4', imageUrl: '/images/ev4.png', dataAiHint: 'Kia SoulEV' },
  { id: 'ray_ev', name: 'carModel.kia.ray_ev', imageUrl: '/images/Ray ev.jpg', dataAiHint: 'Kia RayEV' },
  { id: 'ev5', name: 'carModel.kia.ev5', imageUrl: '/images/ev5.jpg', dataAiHint: 'Kia BongoEV' },
];

export const MOCK_CAR_MODELS_KG: CarModel[] = [
  { id: 'torres_evx', name: 'carModel.kgm.torres_evx  ', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'KG TorresEVX' },
  { id: 'korando_emotion', name: 'carModel.kgm.korando_emotion', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'KG Korando' },
];

export const MOCK_CAR_MODELS_TESLA: CarModel[] = [
  { id: 'model_3', name: 'carModel.tesla.model_3', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Tesla Model3' },
  { id: 'model_y', name: 'carModel.tesla.model_y', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Tesla ModelY' },
  { id: 'model_s', name: 'carModel.tesla.model_s', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Tesla ModelS' },
  { id: 'model_x', name: 'carModel.tesla.model_x', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Tesla ModelX' },
  { id: 'cybertruck', name: 'carModel.tesla.cybertruck', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Tesla Cybertruck' },
  { id: 'roadster', name: 'carModel.tesla.roadster', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'Tesla Roadster' },
];

export const MOCK_CAR_BRANDS: CarBrand[] = [
  { id: 'hyundai', name: 'carBrand.hyundai', logoUrl: '/images/logos/hyundai.png', dataAiHint: 'Hyundai logo', models: MOCK_CAR_MODELS_HYUNDAI },
  { id: 'kia', name: 'carBrand.kia', logoUrl: '/images/logos/kia.png', dataAiHint: 'Kia logo', models: MOCK_CAR_MODELS_KIA },
  { id: 'kgm', name: 'carBrand.kgm', logoUrl: '/images/logos/KGM.png', dataAiHint: 'KGMobility logo', models: MOCK_CAR_MODELS_KG },
  { id: 'tesla', name: 'carBrand.tesla', logoUrl: '/images/logos/TESLR.png', dataAiHint: 'Tesla logo', models: MOCK_CAR_MODELS_TESLA },
];
