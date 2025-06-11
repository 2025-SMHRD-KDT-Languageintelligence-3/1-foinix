
"use client";

import { useState } from 'react';
import { HelpCircle, Phone } from 'lucide-react';
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
import { useToast } from "@/hooks/use-toast";
import type { Language, t as TFunction } from '@/lib/translations';

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
  t: typeof TFunction;
}

export function TroubleshootingGuide({ lang, t }: TroubleshootingGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleCallStaff = () => {
    toast({
      title: t("troubleshooting.toast.staffCalled.title"),
      description: t("troubleshooting.toast.staffCalled.description"),
      duration: 5000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
          <HelpCircle className="mr-2 h-6 w-6" />
          {t("chargingInProgress.troubleshootingButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 flex flex-col h-[80vh] max-h-[700px]">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-headline">{t("troubleshooting.title")}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 pb-2">
          <Accordion type="single" collapsible className="w-full">
            {troubleshootingItemKeys.map((item) => (
              <AccordionItem value={item.id} key={item.id}>
                <AccordionTrigger
                  className="text-lg py-3 text-left hover:no-underline"
                >
                  {t(item.questionKey)}
                </AccordionTrigger>
                <AccordionContent className="text-base whitespace-pre-line p-3 bg-muted/30 rounded-md">
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
      </DialogContent>
    </Dialog>
  );
}

    