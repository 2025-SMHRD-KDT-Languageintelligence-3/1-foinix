"use client";

import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CarbonComparison from './CarbonComparison'; // 새로 만든 컴포넌트 import
import type { Language } from '@/lib/translations';
import { useAutoSTT } from '@/hooks/useAutoSTT';

interface LocalBusinessDisplayProps {
  lang: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
  from?: string;
}

export function LocalBusinessDisplay({ lang, t, from }: LocalBusinessDisplayProps) {
  const router = useRouter();
  useAutoSTT({
    '뒤로가기': () => router.back(),
    '닫기': () => router.back(),
  });

  const handleShowAllOnMap = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kioskReturnState', 'CHARGING_IN_PROGRESS');
    }
    router.push('/map');
  };

  return (
    <div className="w-full px-4">
      {/* 🔁 기존 카드 대신 탄소 계산기 삽입 */}
      <div className="my-6">
        <CarbonComparison />
      </div>

      {/* ✅ 더보기 버튼은 그대로 유지 */}
      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          onClick={handleShowAllOnMap}
          className="bg-card text-primary border-primary hover:bg-primary/10 text-lg py-3 px-6"
        >
          {t("localBusiness.button.more")}
          <Map className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
