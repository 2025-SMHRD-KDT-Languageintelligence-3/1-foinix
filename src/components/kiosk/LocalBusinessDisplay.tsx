
"use client";

import type { LocalBusiness } from '@/types/kiosk';
import { LocalBusinessCard } from './LocalBusinessCard';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';
import type { Language, t as TFunction } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface LocalBusinessDisplayProps {
  businesses?: LocalBusiness[];
  lang: Language;
  t: typeof TFunction;
}

const mockBusinessesData: Omit<LocalBusiness, 'name' | 'type' | 'description' | 'distance'> & { nameKey: string; typeKey: string; descriptionKey: string; distanceKey: string }[] = [
  { id: '1', nameKey: 'localBusiness.cafe.name', typeKey: 'localBusiness.cafe.type', descriptionKey: 'localBusiness.cafe.description', logoUrl: 'https://placehold.co/300x200.png', dataAiHint:'cafe coffee', distanceKey: 'localBusiness.cafe.distance' },
  { id: '2', nameKey: 'localBusiness.mart.name', typeKey: 'localBusiness.mart.type', descriptionKey: 'localBusiness.mart.description', logoUrl: 'https://placehold.co/300x200.png', dataAiHint:'grocery store', distanceKey: 'localBusiness.mart.distance' },
  { id: '3', nameKey: 'localBusiness.bookstore.name', typeKey: 'localBusiness.bookstore.type', descriptionKey: 'localBusiness.bookstore.description', logoUrl: 'https://placehold.co/300x200.png', dataAiHint:'bookstore library', distanceKey: 'localBusiness.bookstore.distance' },
  // Keep only 3 for initial display
];

const BUSINESSES_PER_PAGE = 3;

export function LocalBusinessDisplay({ businesses, lang, t }: LocalBusinessDisplayProps) {
  const router = useRouter();
  const sourceBusinesses = businesses || mockBusinessesData;

  const actualBusinesses: LocalBusiness[] = useMemo(() => {
    return sourceBusinesses.map(b => ({
      ...b,
      name: t((b as any).nameKey || b.name),
      type: t((b as any).typeKey || b.type),
      description: t((b as any).descriptionKey || b.description),
      distance: (b as any).distanceKey ? t((b as any).distanceKey) : b.distance,
    }));
  }, [sourceBusinesses, t]);

  const displayedBusinesses = actualBusinesses.slice(0, BUSINESSES_PER_PAGE);

  const handleBusinessCardClick = (business: LocalBusiness) => {
    router.push(`/store-map?businessId=${business.id}`);
  };

  const handleShowAllOnMap = () => {
    router.push('/store-map');
  };

  return (
    <div className="w-full">
      <div className={cn(
            "relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          )}
        >
          {displayedBusinesses.map(business => (
            <LocalBusinessCard
              key={business.id}
              business={business}
              onClick={() => handleBusinessCardClick(business)}
            />
          ))}
        </div>
      {actualBusinesses.length > 0 && ( // Show "More" button even if only 3 are displayed initially
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={handleShowAllOnMap}
            className="bg-card text-primary border-primary hover:bg-primary/10 text-lg py-3 px-6" // Larger button
          >
            {t("localBusiness.button.more")}
            <Map className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
