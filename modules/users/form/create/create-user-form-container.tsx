"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import {
  createUserSchema,
  CreateUserSchema,
} from "./schemas/create-user-schema";

import { useInviteUser } from "../../lib/hooks/use-invite-user";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import CreateUserForm from "./create-user-form";

interface Props {
  onClose?: () => void;
}

export default function CreateUserFormContainer({ onClose }: Props) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("users.create");
  const {
    inviteUser,
    isLoading: isLoadingSubmit,
    error: errorSubmit,
  } = useInviteUser({
    onSuccess: () => {
      toast.success(t("successToast"), { position: "top-right" });
      onClose?.();
      setTimeout(() => {
        router.refresh();
      }, 300);
    },
  });

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      role: "viewer",
      fullName: "",
    },
  });

  function onCancel() {
    onClose?.();
  }

  async function onSubmit(data: CreateUserSchema) {
    inviteUser(data, locale);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <CreateUserForm
          loading={isLoadingSubmit}
          error={errorSubmit}
          onCancel={onCancel}
        />
      </form>
    </FormProvider>
  );
}
