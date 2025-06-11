
import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
// Note: Metadata is server-generated. For dynamic titles based on client-side language,
// you'd typically use a client component to update document.title.
// For simplicity, we'll keep a generic title or assume Korean is default.
// Or, we can pass language to the RootLayout if it can be determined server-side (e.g. from cookie/header).
// For this iteration, metadata remains static.

export const metadata: Metadata = {
  title: 'eCharge 키오스크', // Default title
  description: '스마트 EV 충전 솔루션', // Default description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The lang attribute on <html> should ideally be dynamic based on appData.language.
    // This requires passing language state to RootLayout, possibly via context or prop drilling from a wrapper in page.tsx.
    // For now, defaulting to 'ko' and client components will handle text.
    <html lang="ko"> 
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

    