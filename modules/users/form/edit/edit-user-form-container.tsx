"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  editUserSchema,
  EditUserSchema,
} from "./schemas/edit-user-schema";
import UserForm from "../user-form";
import { UserDetails } from "../../lib/types/user.types";
import { useEditUser } from "../../lib/hooks/use-edit-user";
import { toast } from "sonner";

interface Props {
  user: UserDetails;
  onClose?: () => void;
}

export default function EditUserFormContainer({ user, onClose }: Props) {
  const router = useRouter();
  const {
    editUser,
    isLoading: isLoadingSubmit,
    error: errorSubmit,
  } = useEditUser({
    onSuccess: () => {
      toast.success("User updated successfully", { position: "top-right" });
      onClose?.();
      setTimeout(() => {
        router.refresh();
      }, 300);
    },
  });

  const form = useForm<EditUserSchema>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      role: user.role,
      status: user.status,
    },
  });

  function onCancel() {
    onClose?.();
  }

  async function onSubmit(data: EditUserSchema) {
    editUser(data, user.id);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <UserForm
          email={user.email ?? undefined}
          fullName={user.fullName}
          loading={isLoadingSubmit}
          error={errorSubmit}
          onCancel={onCancel}
        />
      </form>
    </FormProvider>
  );
}
