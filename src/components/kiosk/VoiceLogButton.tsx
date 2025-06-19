"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { VoiceLogModal } from "@/components/kiosk/VoiceLogModal";

export function VoiceLogButton() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("lastVisitedBeforeLog", pathname);
  }, [pathname]);
  return (
    <>
      <Button
  onClick={() => setShowModal(true)}
  className={`rounded-full w-20 h-20 shadow-md
              bg-[#1b1f3b] dark:bg-white
              hover:bg-[#2e2f4c] dark:hover:bg-gray-100
              border border-gray-700 dark:border-gray-300
              flex items-center justify-center`}
  aria-label="음성 로그 확인"
>
  <Image
          src="/black.png"
          alt="스피커 아이콘"
          width={32}
          height={32}
          className="dark:invert"
        />
  </Button>
      {showModal && <VoiceLogModal onClose={() => setShowModal(false)} />}
    </>
  );
}