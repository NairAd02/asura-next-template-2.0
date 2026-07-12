"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  onboardingSchema,
  OnboardingSchema,
} from "./schemas/onboarding-schema";
import { useCompleteOnboarding } from "../../lib/hooks/use-complete-onboarding";
import { useCurrentUser } from "@/modules/auth/lib/hooks/use-current-user";
import { useEffect } from "react";
import OnboardingForm from "./onboarding-form";
import { paths } from "@/routes/paths";

interface Props {
  onSuccess?: () => void;
}

export default function OnboardingFormContainer({ onSuccess }: Props) {
  const router = useRouter();
  const { user, isLoading: loadingUser, error: userError } = useCurrentUser();

  const {
    completeOnboarding,
    isLoading: isLoadingSubmit,
    error: errorSubmit,
  } = useCompleteOnboarding({
    onSuccess: () => {
      onSuccess?.();
      router.push(paths.authLogin.root);
    },
  });

  const form = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      if (user.fullName) {
        form.setValue("fullName", user.fullName);
      }
    }
  }, [user, form]);

  function onCancel() {
    router.back();
  }

  async function onSubmit(data: OnboardingSchema) {
    completeOnboarding(data);
  }

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (userError) {
    return (
      <div className="p-4 text-center text-destructive">
        {userError}
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex items-center justify-center px-4 h-full w-full">
        <OnboardingForm
          email={user?.email || ""}
          loading={isLoadingSubmit}
          error={errorSubmit}
          onCancel={onCancel}
        />
      </form>
    </FormProvider>
  );
}
