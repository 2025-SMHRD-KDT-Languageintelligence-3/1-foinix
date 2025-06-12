
"use client";

import type { ChargingSlot } from '@/types/kiosk'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; 
import { Clock, UserCircle } from 'lucide-react'; 
import React from 'react';
import { cn } from '@/lib/utils'; 
import type { Language, t as TFunction } from '@/lib/translations';

interface WaitTimeDisplayProps {
  slots?: ChargingSlot[]; 
  currentSlotId?: string; 
  lang: Language;
  t: typeof TFunction;
}

const mockSlotsData: ChargingSlot[] = [ 
  { id: 'A1', status: 'occupied', vehicle: { model: 'carModel.tesla.model_y', licensePlate: '12가3456' }, estimatedCompletionTime: '25분', currentChargeKW: 50, user: 'USER1' },
  { id: 'A2', status: 'available' },
  { id: 'B1', status: 'maintenance' },
];

export function WaitTimeDisplay({ slots = mockSlotsData, currentSlotId, lang, t }: WaitTimeDisplayProps) {
  return (
    <>
      <div className="w-full h-full flex flex-col">
        
        <div className="grid grid-cols-1 gap-6 flex-grow">
          {slots.map(slot => {
            const isActiveSlot = slot.id === currentSlotId;
            const isAlmostDone = slot.status === 'almost_done';
            const chargePercentage = slot.status === 'occupied' ? Math.min(99, ((slot.currentChargeKW || 0) / 70) * 100) : 0;

            if (!isActiveSlot && currentSlotId) return null; 

            const vehicleModelDisplay = slot.vehicle?.model ? t(slot.vehicle.model) : "";
            const estimatedCompletionTimeDisplay = slot.estimatedCompletionTime || t('waitTimeDisplay.calculating');


            return (
              <Card
                key={slot.id}
                className={cn(
                  "shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] h-full flex flex-col",
                  isActiveSlot ? 'border-2 border-primary ring-2 ring-primary bg-primary/5' : 'bg-card',
                  isAlmostDone ? 'bg-yellow-100 dark:bg-yellow-800 border-yellow-500' : '',
                  !isActiveSlot && slot.status === 'occupied' ? 'opacity-70' : ''
                )}
              >
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="flex justify-between items-center text-lg lg:text-xl font-headline">
                    <span>{t("waitTimeDisplay.slot")} {slot.id}</span>
                    {slot.status === 'occupied' && <UserCircle className="text-muted-foreground" size={24}/>}
                    {slot.status === 'available' && <span className="text-green-500 font-semibold text-base">{t("waitTimeDisplay.status.available")}</span>}
                    {slot.status === 'maintenance' && <span className="text-orange-500 font-semibold text-base">{t("waitTimeDisplay.status.maintenance")}</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3 space-y-2 flex-grow"> 
                  {slot.status === 'occupied' && slot.vehicle && (
                    <>
                      <p className="text-sm">{t("waitTimeDisplay.vehicleInfo")}: {vehicleModelDisplay} ({slot.vehicle.licensePlate})</p>
                      <div className="flex items-center text-sm">
                        <Clock size={18} className="mr-2 text-secondary" />
                        <span>{t("waitTimeDisplay.estimatedCompletion")}: {estimatedCompletionTimeDisplay}</span>
                      </div>
                       <div className="mt-2">
                        <Progress value={chargePercentage} className="h-5 rounded-md" />
                        <p className="text-center text-xs mt-1 text-primary font-medium">{Math.round(chargePercentage)}{t("waitTimeDisplay.chargedPercentage")}</p>
                      </div>
                      {isAlmostDone && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium mt-1">{t("waitTimeDisplay.almostDone")}</p>
                      )}
                    </>
                  )}
                  {slot.status === 'available' && (
                    <p className="text-base text-green-600 py-3 text-center">{t("waitTimeDisplay.connectAndCharge")}</p>
                  )}
                   {slot.status === 'maintenance' && (
                    <p className="text-base text-orange-600 py-3 text-center">{t("waitTimeDisplay.underMaintenance")}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
