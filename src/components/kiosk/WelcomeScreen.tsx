
"use client";

import { useEffect } from "react";
import { CarFront } from "lucide-react";
import { FullScreenCard } from "./FullScreenCard";
import { Button } from "@/components/ui/button";
import type { Language, t as TFunction } from "@/lib/translations";
import { useTTS } from "@/hooks/useTTS";

interface WelcomeScreenProps {
  lang: Language;
  t: typeof TFunction;
  onLanguageSwitch: () => void;
}

export function WelcomeScreen({ lang, t, onLanguageSwitch }: WelcomeScreenProps) {
  const { speak } = useTTS();

  useEffect(() => {
    speak("EV이스 키오스크에 오신 것을 환영합니다. 아래 버튼을 눌러 서비스를 시작하세요.");
  }, []);

  return (
    <FullScreenCard
      title="EV이스 키오스크에 오신 것을 환영합니다!"
      bottomCenterAccessory={
        <Button
          onClick={onLanguageSwitch}
          variant="outline"
          className="bg-white text-[#1b1f3b] border border-gray-300 rounded-lg text-sm font-bold py-2 px-4 shadow-md hover:bg-gray-100"
        >
          언어 변경
        </Button>
      }
    >
      <CarFront size={80} className="text-primary mb-6" />
      <p className="text-xl text-center text-muted-foreground mb-8">
        아래 버튼을 눌러 서비스를 시작하세요.
      </p>
      <Button className="text-white bg-[#42A7E0] hover:bg-[#2e90c6] px-8 py-4 rounded-lg text-xl font-bold">
        ⓘ 서비스 안내 시작
      </Button>
    </FullScreenCard>
  );
}