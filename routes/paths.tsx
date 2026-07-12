interface Path {
  root: string;
  isProtected: boolean;
}

interface ApplicationPath {
  dashboard: Path;
  campaigns: Path;
  items: Path;
  itemCategories: Path;
  users: Path;
  authLogin: Path;
  forgotPassword: Path;
}

export const paths: ApplicationPath = {
  dashboard: {
    root: "/dashboard",
    isProtected: true,
  },
  campaigns: {
    root: "/campaigns",
    isProtected: true,
  },
  items: {
    root: "/items",
    isProtected: true,
  },
  itemCategories: {
    root: "/item-categories",
    isProtected: true,
  },
  users: {
    root: "/users",
    isProtected: true,
  },
  authLogin: {
    root: "/auth/login",
    isProtected: false,
  },
  forgotPassword: {
    root: "/auth/forgot-password",
    isProtected: false,
  },
} as const;
