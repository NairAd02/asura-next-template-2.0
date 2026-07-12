"use client";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { ReactNode } from "react";

interface Props {
  title: string;
  icon: ReactNode;
  path: string;
  scroll?: boolean;
}

export default function SideBarMenuButtonLink({
  title,
  icon,
  path,
  scroll = true,
}: Props) {
  const currentPath = usePathname();
  const isActive = currentPath === path || currentPath.startsWith(`${path}/`);
  return (
    <Link className="flex gap-2 w-full" scroll={scroll} href={path}>
      <SidebarMenuButton
        className="text-[13px] font-bold hover:bg-brand-green hover:text-brand-dark data-[active=true]:bg-brand-green data-[active=true]:text-brand-dark"
        isActive={isActive}
        tooltip={title}
      >
        {icon && icon}
        <span className="font-bold text-sm">{title}</span>
      </SidebarMenuButton>
    </Link>
  );
}
