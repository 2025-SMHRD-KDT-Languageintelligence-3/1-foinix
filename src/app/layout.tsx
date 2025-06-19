import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { ThemeToggleButton } from '@/components/kiosk/ThemeToggleButton';
import { VoiceRecognitionButton } from '@/components/kiosk/VoiceRecognitionButton';
import { VoiceLogButton } from '@/components/kiosk/VoiceLogButton'; // ✅ 추가
import './globals.css';

export const metadata: Metadata = {
  title: 'EV이스',
  description: '스마트 EV 충전 솔루션',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <div className="fixed bottom-4 right-4 z-50 flex space-x-4">
          <VoiceRecognitionButton />
          <VoiceLogButton /> {/* ✅ 여기에 로그 버튼 추가 */}
          <ThemeToggleButton />
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
