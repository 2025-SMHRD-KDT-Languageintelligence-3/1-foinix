'use client';
import { ManualPlateInputScreen } from '@/components/kiosk/ManualPlateInputScreen';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/hooks/useTranslations';

export default function ManualPlateInputPage() {
  const router = useRouter();
  const { t } = useTranslations();

  return (
    <ManualPlateInputScreen
      lang="ko"
      t={t}
      onLanguageSwitch={() => {}}
      onSubmit={() => {}}
      onCancel={() => router.push('/')}
    />
  );
}
