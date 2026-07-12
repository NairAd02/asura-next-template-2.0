"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from "./schemas/forgot-password-schema";
import { useRequestPasswordReset } from "@/modules/users/lib/hooks/use-request-password-reset";
import { ForgotPasswordForm } from "./forgot-password-form";

interface Props {
  defaultEmail?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  backHref?: string;
}

export default function ForgotPasswordFormContainer({
  defaultEmail = "",
  onSuccess,
  onCancel,
  backHref,
}: Props) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  const {
    requestReset,
    isLoading,
    error,
    sent,
  } = useRequestPasswordReset({ onSuccess });

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: defaultEmail,
    },
  });

  const submittedEmail = form.getValues("email");

  async function onSubmit(data: ForgotPasswordSchema) {
    await requestReset({ email: data.email, locale });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ForgotPasswordForm
          loading={isLoading}
          error={error}
          sent={sent}
          sentToEmail={submittedEmail}
          onCancel={onCancel}
          backHref={backHref}
        />
      </form>
    </FormProvider>
  );
}
