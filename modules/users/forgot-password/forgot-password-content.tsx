import Link from "next/link";
import { Package } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ForgotPasswordFormContainer from "@/modules/users/form/forgot-password/forgot-password-form-container";

interface Props {
  locale: string;
}

export default async function ForgotPasswordContent({ locale }: Props) {
  const t = await getTranslations("forgotPassword");
  const backHref = `/${locale}/auth/login`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Package className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold text-foreground">App Name</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t("pageTitle")}</CardTitle>
              <CardDescription>{t("pageDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ForgotPasswordFormContainer backHref={backHref} />
            </CardContent>
          </Card>
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href={backHref}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {t("backToLogin")}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
