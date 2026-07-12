"use client";

import { ReactNode } from "react";
import {
  LayoutDashboard,
  Boxes,
  Tag,
  Users,
  Megaphone,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { paths } from "../paths";

export interface GroupRoute {
  title: string;
  navigationRoutes: NavigationRoute[];
}

export interface NavigationRoute {
  title: string;
  path: string;
  icon?: ReactNode;
  isActive?: boolean;
  children?: NavigationRoute[];
  scroll?: boolean;
}

export function useGroupRoutes(): { routes: GroupRoute[]; isLoading: boolean } {
  const tGroups = useTranslations("sidebar.groups");
  const tNav = useTranslations("sidebar.navigation");

  const routes: GroupRoute[] = [
    {
      title: tGroups("metrics"),
      navigationRoutes: [
        {
          title: tNav("dashboard"),
          icon: <LayoutDashboard className="text-accent" />,
          path: paths.dashboard.root,
        },
      ],
    },
    {
      title: tGroups("catalog"),
      navigationRoutes: [
        {
          title: tNav("items"),
          icon: <Boxes className="text-accent" />,
          path: paths.items.root,
        },
        {
          title: tNav("itemCategories"),
          icon: <Tag className="text-accent" />,
          path: paths.itemCategories.root,
        },
      ],
    },
    {
      title: tGroups("admin"),
      navigationRoutes: [
        {
          title: tNav("users"),
          icon: <Users className="text-accent" />,
          path: paths.users.root,
        },
      ],
    },
  ];

  return { routes, isLoading: false };
}
