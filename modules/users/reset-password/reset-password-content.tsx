import Link from "next/link";
import { Package } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResetPasswordFormContainer from "@/modules/users/form/reset-password/reset-password-form-container";

export default async function ResetPasswordContent() {
  const t = await getTranslations("resetPassword");

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
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t("pageTitle")}</CardTitle>
            <CardDescription>{t("pageDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordFormContainer />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
