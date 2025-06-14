"use client";

import { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

export function VoiceRecognitionButton() {
  const { toast } = useToast();

  const handleVoiceRecognition = () => {
    console.log('Voice recognition triggered (placeholder)');
    // Actual STT implementation would go here.
    // For example, using the Web Speech API:
    // if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    //   // Initiate STT
    //   toast({ title: "Voice Recognition", description: "Listening..." });
    // } else {
    //   toast({ title: "Voice Recognition", description: "Voice recognition not supported.", variant: "destructive" });
    // }
    toast({ title: "Voice Input", description: "Microphone activated! (STT to be implemented)" });
  };

  // Ensure the button only renders on the client after mount to prevent hydration issues
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Return a placeholder or null to avoid rendering the button prematurely
    return <div style={{ width: '80px', height: '80px' }} />; // Adjusted placeholder size
  }

  return (
    <Button
      variant="outline"
      onClick={handleVoiceRecognition}
      className="rounded-full w-20 h-20 shadow-md 
                 border 
                 bg-[hsl(220,30%,10%)] text-[hsl(220,15%,85%)] border-[hsl(220,30%,25%)] 
                 hover:bg-[hsl(220,30%,15%)] 
                 dark:bg-white dark:text-[hsl(220,30%,10%)] dark:border-gray-300 
                 dark:hover:bg-gray-200"
      aria-label="Start voice recognition"
    >
       <Mic className="!size-8" strokeWidth={2.5} />
    </Button>
  );
}
