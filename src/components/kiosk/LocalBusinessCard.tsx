
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { LocalBusiness } from '@/types/kiosk';
import { Building, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocalBusinessCardProps {
  business: LocalBusiness;
  onClick?: () => void;
  className?: string; 
}

export function LocalBusinessCard({ business, onClick, className }: LocalBusinessCardProps) {
  return (
    <Card 
      className={cn(
        "w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card",
        onClick && "cursor-pointer",
        className 
      )}
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-40 bg-muted flex items-center justify-center">
          {business.logoUrl ? (
            <Image 
              src={business.logoUrl} 
              alt={`${business.name} logo`} 
              fill={true}
              style={{objectFit:"cover"}}
              data-ai-hint={business.dataAiHint || 'store shop'} />
          ) : (
            <Building size={64} className="text-muted-foreground" data-ai-hint={business.dataAiHint || 'store shop'}/>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl font-headline">{business.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">{business.type}</CardDescription>
        <p className="text-base mt-2 h-16 overflow-hidden text-ellipsis">{business.description}</p>
      </CardContent>
      {business.distance && (
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center text-sm text-primary">
            <MapPin size={16} className="mr-1" />
            <span>{business.distance}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
