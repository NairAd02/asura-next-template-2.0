"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
  changePasswordSchema,
  ChangePasswordSchema,
} from "../../schemas/change-password-schema";
import { ChangePasswordDto } from "@/modules/users/lib/types/user.types";
import { useChangePassword } from "@/modules/users/lib/hooks/use-change-password";
import { ChangePasswordForm } from "./change-password-form";

interface Props {
  onCancel: () => void;
  onPasswordChange?: () => void;
}

export default function ChangePasswordFormContainer({ onCancel, onPasswordChange }: Props) {
  const {
    changePassword,
    isLoading: isLoadingSubmit,
    error: errorSubmit,
  } = useChangePassword({
    onSuccess: () => {
      onPasswordChange?.();
    },
  });

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onCancelHandler() {
    onCancel();
  }

  async function onSubmit(data: ChangePasswordSchema) {
    const dto: ChangePasswordDto = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    await changePassword(dto);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ChangePasswordForm
          loading={isLoadingSubmit}
          error={errorSubmit}
          onCancel={onCancelHandler}
        />
      </form>
    </FormProvider>
  );
}
