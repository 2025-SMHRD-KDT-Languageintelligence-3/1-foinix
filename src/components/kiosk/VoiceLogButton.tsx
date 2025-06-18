"use client";

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
        className="rounded-full w-20 h-20 shadow-md 
                 bg-[#42A7E0] text-white hover:bg-[#2e90c6]"
        aria-label="음성 로그 확인"
      >
        로그
      </Button>

      {showModal && <VoiceLogModal onClose={() => setShowModal(false)} />}
    </>
  );
}
