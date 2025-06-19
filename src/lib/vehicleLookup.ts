export interface KnownVehicleInfo {
  licensePlate: string;
  brandId: string;
  modelId: string;
}

export const KNOWN_VEHICLES: KnownVehicleInfo[] = [
  { licensePlate: '12가3456', brandId: 'hyundai', modelId: 'ioniq5' },
  { licensePlate: '34나7890', brandId: 'kia', modelId: 'ev6' },
];

export function findVehicleByPlate(plate: string): KnownVehicleInfo | undefined {
  const normalized = plate.trim().toUpperCase();
  return KNOWN_VEHICLES.find(v => v.licensePlate === normalized);
}
