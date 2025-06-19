'use client';
import { ManualPlateInputScreen } from '@/components/kiosk/ManualPlateInputScreen';
import { useRouter } from 'next/navigation';

export default function ManualPlateInputPage() {
  const router = useRouter();

  return (
    <ManualPlateInputScreen
      lang="ko"
      onLanguageSwitch={() => {}}
      onSubmit={() => {}}
      onCancel={() => router.push('/')}
    />
  );
}
