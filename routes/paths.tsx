interface Path {
  root: string;
  isProtected: boolean;
}

interface ApplicationPath {
  dashboard: Path;
  items: Path;
  itemCategories: Path;
  suppliers: Path;
  vehicles: Path;
  users: Path;
  authLogin: Path;
  forgotPassword: Path;
}

export const paths: ApplicationPath = {
  dashboard: {
    root: "/dashboard",
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
  suppliers: {
    root: "/suppliers",
    isProtected: true,
  },
  vehicles: {
    root: "/vehicles",
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
