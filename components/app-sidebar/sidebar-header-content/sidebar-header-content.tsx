"use client";
import { useSidebar } from "@/components/ui/sidebar";
import { Logo } from "@/modules/landing/components/logo";
import { useTranslations } from "next-intl";



export default function SidebarHeaderContent() {
  const { open } = useSidebar();
  const t = useTranslations('app');
  return (
    <div className="flex flex-col gap-1 items-center justify-center text-brand-dark">
      <Logo />
      {open && (
        <div className="flex flex-col items-center text-center">
          <p className="text-xl font-bold text-brand-dark">{t('name')}</p>
          <p className="text-md text-brand-dark">
            {t('subtitle')} {t('version')}
          </p>
        </div>
      )}
    </div>
  );
}
