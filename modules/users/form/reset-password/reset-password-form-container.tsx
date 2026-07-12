"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from "./schemas/reset-password-schema";
import { useResetPassword } from "@/modules/users/lib/hooks/use-reset-password";
import { ResetPasswordForm } from "./reset-password-form";

export default function ResetPasswordFormContainer() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("resetPassword");

  const { resetPassword, isLoading, error } = useResetPassword({
    onSuccess: () => {
      toast.success(t("successTitle"), { position: "top-right" });
      router.push(`/${locale}/auth/login`);
    },
  });

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ResetPasswordSchema) {
    await resetPassword({ password: data.password });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ResetPasswordForm loading={isLoading} error={error} />
      </form>
    </FormProvider>
  );
}
