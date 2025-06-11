
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Megaphone, CalendarDays, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { NoticeItem } from '@/types/kiosk';
import type { Language, t as TFunction } from '@/lib/translations';

const mockNoticeKeys: Omit<NoticeItem, 'title' | 'content'> & { titleKey: string; contentKey: string }[] = [
  {
    id: 'notice1',
    titleKey: 'notice1.title',
    contentKey: 'notice1.content',
    date: '2024-08-10',
    imageUrl: 'https://placehold.co/400x200.png',
    dataAiHint: 'maintenance system',
  },
  {
    id: 'notice2',
    titleKey: 'notice2.title',
    contentKey: 'notice2.content',
    date: '2024-08-05',
  },
  {
    id: 'notice3',
    titleKey: 'notice3.title',
    contentKey: 'notice3.content',
    date: '2024-07-01',
    imageUrl: 'https://placehold.co/400x200.png',
    dataAiHint: 'discount promotion',
  },
  {
    id: 'notice4',
    titleKey: 'notice4.title',
    contentKey: 'notice4.content',
    date: '2024-07-25',
  }
];

interface NoticesDisplayProps {
  lang: Language;
  t: typeof TFunction;
}

export function NoticesDisplay({ lang, t }: NoticesDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  const translatedNotices: NoticeItem[] = mockNoticeKeys.map(n => ({
    ...n,
    title: t(n.titleKey),
    content: t(n.contentKey),
  }));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
          <Megaphone className="mr-2 h-6 w-6" />
          {t("chargingInProgress.noticesButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 flex flex-col h-[85vh] max-h-[800px]">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-headline flex items-center">
            <Megaphone className="mr-3 h-7 w-7 text-primary" />
            {t("notices.dialogTitle")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow p-6">
          <div className="space-y-6">
            {translatedNotices.length > 0 ? (
              translatedNotices.map((notice) => (
                <Card key={notice.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">{notice.title}</CardTitle>
                    <div className="text-xs text-muted-foreground flex items-center pt-1">
                      <CalendarDays size={14} className="mr-1.5" />
                      <span>{t("notices.postedDate")}: {notice.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {notice.imageUrl && (
                      <div className="mb-4 relative w-full aspect-[2/1] rounded-md overflow-hidden bg-muted">
                        <Image
                          src={notice.imageUrl}
                          alt={notice.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          data-ai-hint={notice.dataAiHint || 'announcement illustration'}
                        />
                      </div>
                    )}
                    <p className="text-base whitespace-pre-line leading-relaxed">{notice.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-10">
                <Info size={48} className="text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">{t("notices.noNotices")}</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogClose asChild>
          <div className="p-4 border-t flex justify-end">
            <Button type="button" variant="outline" size="lg">{t("notices.button.close")}</Button>
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

    