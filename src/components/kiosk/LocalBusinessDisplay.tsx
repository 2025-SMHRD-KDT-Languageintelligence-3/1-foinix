
"use client";

import type { LocalBusiness } from '@/types/kiosk';
import { LocalBusinessCard } from './LocalBusinessCard';
import { MapModal } from './MapModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Language, t as TFunction } from '@/lib/translations';

interface LocalBusinessDisplayProps {
  businesses?: LocalBusiness[];
  lang: Language;
  t: typeof TFunction;
}

const mockBusinessesData: Omit<LocalBusiness, 'name' | 'type' | 'description' | 'distance'> & { nameKey: string; typeKey: string; descriptionKey: string; distanceKey: string }[] = [
  { id: '1', nameKey: 'localBusiness.cafe.name', typeKey: 'localBusiness.cafe.type', descriptionKey: 'localBusiness.cafe.description', logoUrl: 'https://placehold.co/300x200.png', dataAiHint:'cafe coffee', distanceKey: 'localBusiness.cafe.distance' },
  { id: '2', nameKey: 'localBusiness.mart.name', typeKey: 'localBusiness.mart.type', descriptionKey: 'localBusiness.mart.description', logoUrl: 'https://placehold.co/300x200.png', dataAiHint:'grocery store', distanceKey: 'localBusiness.mart.distance' },
  { id: '3', nameKey: 'localBusiness.bookstore.name', typeKey: 'localBusiness.bookstore.type', descriptionKey: 'localBusiness.bookstore.description', logoUrl: 'https://placehold.co/300x200.png', dataAiHint:'bookstore library', distanceKey: 'localBusiness.bookstore.distance' },
  { id: '4', nameKey: 'localBusiness.bakery.name', typeKey: 'localBusiness.bakery.type', descriptionKey: 'localBusiness.bakery.description', logoUrl: 'https://placehold.co/300x200.png', dataAiHint:'bakery bread', distanceKey: 'localBusiness.bakery.distance' },
  { id: '5', nameKey: 'localBusiness.pharmacy.name', typeKey: 'localBusiness.pharmacy.type', descriptionKey: 'localBusiness.pharmacy.description', logoUrl: 'https://placehold.co/300x200.png', dataAiHint:'pharmacy medicine', distanceKey: 'localBusiness.pharmacy.distance' },
];

const MAX_ITEMS_TO_SHOW_INITIALLY = 3;

export function LocalBusinessDisplay({ businesses, lang, t }: LocalBusinessDisplayProps) {
  const [selectedBusinessForMap, setSelectedBusinessForMap] = useState<LocalBusiness | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const sourceBusinesses = businesses || mockBusinessesData;

  const actualBusinesses: LocalBusiness[] = sourceBusinesses.map(b => ({
    ...b,
    name: t((b as any).nameKey || b.name), 
    type: t((b as any).typeKey || b.type),
    description: t((b as any).descriptionKey || b.description),
    distance: (b as any).distanceKey ? t((b as any).distanceKey) : b.distance,
  }));

  const businessesToDisplay = isExpanded ? actualBusinesses : actualBusinesses.slice(0, MAX_ITEMS_TO_SHOW_INITIALLY);
  const showExpandButton = actualBusinesses.length > MAX_ITEMS_TO_SHOW_INITIALLY;

  const handleBusinessCardClick = (business: LocalBusiness) => {
    setSelectedBusinessForMap(business);
    setIsMapModalOpen(true);
  };

  const handleCloseMapModal = () => {
    setIsMapModalOpen(false);
    setSelectedBusinessForMap(null);
  };

  return (
    <div className="w-full mt-8">
      <h3 className="text-2xl font-headline font-semibold mb-4 text-center text-primary">{t("localBusiness.title")}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {businessesToDisplay.map(business => (
          <LocalBusinessCard 
            key={business.id}
            business={business} 
            onClick={() => handleBusinessCardClick(business)}
            className="animate-fade-in"
          />
        ))}
      </div>
      {showExpandButton && (
        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary border-primary hover:bg-primary/10"
          >
            {isExpanded ? t("localBusiness.button.showLess") : t("localBusiness.button.showMore")}
            {isExpanded ? <ChevronUp className="ml-2 h-5 w-5" /> : <ChevronDown className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      )}
      {selectedBusinessForMap && (
        <MapModal
          isOpen={isMapModalOpen}
          onClose={handleCloseMapModal}
          business={selectedBusinessForMap}
          lang={lang}
          t={t}
        />
      )}
    </div>
  );
}

    
