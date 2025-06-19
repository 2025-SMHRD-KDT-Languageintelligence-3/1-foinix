
"use client";

import { useState, useEffect, useRef } from 'react';
import { HelpCircle, Phone, Loader2, PhoneCall, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { KioskButton } from './KioskButton';
// Removed useToast as it's no longer used directly here for staff call.
import type { Language } from '@/lib/translations';

interface TroubleshootingItem {
  id: string;
  questionKey: string;
  answerKey: string;
}

const troubleshootingItemKeys: TroubleshootingItem[] = [
  { id: 'ts1', questionKey: 'ts1.question', answerKey: 'ts1.answer' },
  { id: 'ts2', questionKey: 'ts2.question', answerKey: 'ts2.answer' },
  { id: 'ts3', questionKey: 'ts3.question', answerKey: 'ts3.answer' },
  { id: 'ts4', questionKey: 'ts4.question', answerKey: 'ts4.answer' },
  { id: 'ts5', questionKey: 'ts5.question', answerKey: 'ts5.answer' },
];

interface TroubleshootingGuideProps {
  lang: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export function TroubleshootingGuide({ lang, t }: TroubleshootingGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const callTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear timeout if component unmounts or dialog closes while connecting
    return () => {
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
      }
    };
  }, []);

  const handleCallStaff = () => {
    setCallStatus('connecting');
    if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
    callTimeoutRef.current = setTimeout(() => {
      setCallStatus('connected');
    }, 2500); // Simulate connection time
  };

  const handleHangUp = () => {
    if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
    setCallStatus('idle');
    // Optionally, you might want to close the dialog here too,
    // but current behavior is to stay in the dialog.
    // setIsOpen(false); 
  };

  // Reset call status when dialog is closed
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
      setCallStatus('idle');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="bg-card text-primary border-primary hover:bg-primary/10">
          <HelpCircle className="mr-2 h-6 w-6" />
          {t("chargingInProgress.troubleshootingButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 flex flex-col h-[80vh] max-h-[700px]">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-headline">
            {callStatus === 'idle' && t("troubleshooting.title")}
            {(callStatus === 'connecting' || callStatus === 'connected') && t("troubleshooting.title.callingStaff")}
          </DialogTitle>
        </DialogHeader>

        {callStatus === 'idle' && (
          <>
            <ScrollArea className="flex-grow px-6 pb-2">
              <Accordion type="single" collapsible className="w-full">
                {troubleshootingItemKeys.map((item) => (
                  <AccordionItem value={item.id} key={item.id}>
                    <AccordionTrigger
                      className="text-lg py-4 text-left hover:no-underline" // Increased py-3 to py-4 for more space, kept text-lg
                    >
                      {t(item.questionKey)}
                    </AccordionTrigger>
                    <AccordionContent className="text-base whitespace-pre-line p-3 bg-muted/30 rounded-md leading-relaxed"> 
                      {/* Added leading-relaxed for better readability of content */}
                      {t(item.answerKey)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
            <div className="p-6 border-t border-border flex flex-col items-center">
              <KioskButton
                onClick={handleCallStaff}
                label={t("troubleshooting.button.callStaff")}
                icon={<Phone size={24} />}
                className="w-full max-w-xs"
              />
            </div>
          </>
        )}

        {callStatus === 'connecting' && (
          <div className="flex flex-col items-center justify-center flex-grow p-6 space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-xl text-muted-foreground">{t("troubleshooting.status.connecting")}</p>
          </div>
        )}

        {callStatus === 'connected' && (
          <div className="flex flex-col items-center justify-center flex-grow p-6 space-y-8">
            <PhoneCall className="h-20 w-20 text-green-500" />
            <p className="text-2xl font-semibold">{t("troubleshooting.status.connected")}</p>
            <KioskButton
              onClick={handleHangUp}
              label={t("troubleshooting.button.hangUp")}
              icon={<PhoneOff size={24} />}
              variant="destructive"
              className="w-full max-w-xs"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
