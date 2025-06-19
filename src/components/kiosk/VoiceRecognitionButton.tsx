"use client";

import { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

export function VoiceRecognitionButton() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  speechSynthesis.speak(utterance);
};


  const handleVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      toast({
        title: "지원되지 않음",
        description: "이 브라우저는 음성 인식을 지원하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.continuous = false;
    recognition.interimResults = false;

    toast({ title: "음성 인식", description: "🎤 인식 시작..." });

    recognition.onstart = () => {
      toast({ title: "음성 인식", description: "🎤 인식 준비 중..." });
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
  const text = Array.from(event.results)
    .map((result) => result[0].transcript)
    .join("");

  toast({ title: "인식 결과", description: text });

  const normalized = text.replace(/\s/g, "");

  // ✅ TTS 함수 호출
  const speak = (message: string) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "ko-KR";
    speechSynthesis.speak(utterance);
  };

  if (normalized.includes("충전시작") || normalized.includes("충전")) {
    speak("충전을 시작합니다.");
    router.push("/charging");
  } else if (normalized.includes("결제")) {
    speak("결제 화면으로 이동합니다.");
    router.push("/payment");
  } else if (normalized.includes("처음") || normalized.includes("홈")) {
    speak("처음 화면으로 이동합니다.");
    router.push("/");
  } else if (normalized.includes("도움말")) {
    speak("도움말 화면으로 이동합니다.");
    router.push("/help");
  } else if (normalized.includes("설정")) {
    speak("설정 화면으로 이동합니다.");
    router.push("/settings");
  } else {
    toast({
      title: "명령어 인식 실패",
      description: `"${text}" 명령을 처리할 수 없습니다.`,
      variant: "destructive",
    });
    speak("죄송합니다. 명령을 이해하지 못했습니다.");
  }

  // ✅ 로그 저장
  const prevLogs = JSON.parse(localStorage.getItem("voiceLogs") || "[]");
  localStorage.setItem(
    "voiceLogs",
    JSON.stringify([
      ...prevLogs,
      {
        time: new Date().toISOString(),
        command: text,
      },
    ])
  );
};


    recognition.onerror = (event) => {
      toast({
        title: "오류 발생",
        description: event.error,
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      toast({ title: "음성 인식", description: "🎤 인식 종료" });
    };

    recognition.start(); // ✅ 반드시 마지막에 한 번만 호출
  };

  if (!mounted) return <div style={{ width: '80px', height: '80px' }} />;

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
