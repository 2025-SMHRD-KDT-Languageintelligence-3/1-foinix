import { useEffect } from 'react';

export interface STTCommands {
  [phrase: string]: () => void;
}

export function useAutoSTT(commands: STTCommands, duration = 10000) {
  useEffect(() => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join('')
        .replace(/\s/g, '');
      Object.entries(commands).forEach(([phrase, callback]) => {
        if (text.includes(phrase.replace(/\s/g, ''))) {
          callback();
        }
      });
    };

    recognition.start();
    const timer = setTimeout(() => recognition.stop(), duration);
    return () => {
      clearTimeout(timer);
      recognition.stop();
    };
  }, [commands, duration]);
}
