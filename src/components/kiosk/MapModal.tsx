
"use client";

import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Removed DialogClose
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react'; // Removed X
import type { LocalBusiness } from '@/types/kiosk';
import type { Language, t as TFunction } from '@/lib/translations';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: LocalBusiness | null;
  lang: Language;
  t: typeof TFunction;
}

export function MapModal({ isOpen, onClose, business, lang, t }: MapModalProps) {
  if (!business) return null;

  const businessName = business.name; // Use the already translated name directly

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw]"> {/* Removed p-0, default p-6 will apply */}
        <DialogHeader className="pb-2"> {/* Removed p-6, parent DialogContent provides padding */}
          <DialogTitle className="text-2xl font-headline">{t("mapModal.title", { businessName })}</DialogTitle>
        </DialogHeader>
        <div className="relative pt-0"> {/* Removed p-6, parent DialogContent provides padding. Kept relative for marker positioning. */}
          <div className="relative w-full aspect-[4/3] bg-muted rounded-md overflow-hidden mb-4">
            <Image
              src="https://placehold.co/800x600.png" 
              alt={t("mapModal.alt.mapImage", { businessName })}
              fill={true}
              style={{objectFit:"cover"}}
              data-ai-hint="map navigation"
            />
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
              title={businessName}
            >
              <MapPinIcon className="h-10 w-10 text-red-500" />
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="lg">
              <ZoomIn className="mr-2 h-5 w-5" />
              {t("mapModal.button.zoomIn")}
            </Button>
            <Button variant="outline" size="lg">
              <ZoomOut className="mr-2 h-5 w-5" />
              {t("mapModal.button.zoomOut")}
            </Button>
          </div>
        </div>
        {/* Removed custom DialogClose and Button for 'X' icon, 
            DialogContent's built-in close button will be used.
            The built-in close button is part of DialogContent's implementation
            and is automatically rendered.
        */}
      </DialogContent>
    </Dialog>
  );
}

function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

    
