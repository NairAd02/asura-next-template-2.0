"use client";

import { RHFTextField } from "@/components/form/rhf-components/rhf-text-field/rhf-text-field";
import { RHFPasswordField } from "@/components/form/rhf-components/rhf-password-field/rhf-password-field";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AlertComponent } from "@/components/ui/alert-component";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface LoginFormProps {
  loading?: boolean;
  error?: string | null;
}

export default function LoginForm({
  loading = false,
  error,
}: LoginFormProps) {
  const t = useTranslations('loginForm');
  const tContent = useTranslations('loginContent');
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{tContent('title')}</CardTitle>
        <CardDescription>
          {tContent('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && <AlertComponent title={error} variant="destructive" />}

          <div className="space-y-4">
            <RHFTextField
              name="email"
              label={t('email')}
              placeholder={t('emailPlaceholder')}
              type="email"
              fullWidth
            />

            <div>
              <RHFPasswordField
                name="password"
                label={t('password')}
                placeholder={t('passwordPlaceholder')}
                fullWidth
              />
              <div className="flex justify-end mt-1">
                <Link
                  href={`/${locale}/auth/forgot-password`}
                  className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                >
                  {t('forgotPassword')}
                </Link>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('signingIn')}
              </>
            ) : (
              t('signIn')
            )}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            {t('dontHaveAccount')}{" "}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Re-export RHFTextField to satisfy tree-shaking; keeping as side-effect free.
export { RHFTextField };
