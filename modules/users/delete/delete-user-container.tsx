"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeactivateUser } from "../lib/hooks/use-deactivate-user";
import { ConfirmationDialog } from "@/components/confirmation-dialog/confirmation-dialog";

interface Props {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteUserContainer({
  userId,
  open,
  onOpenChange,
}: Props) {
  const router = useRouter();
  const { deactivateUser, isLoading, error, reset } = useDeactivateUser({
    onSuccess: () => {
      toast.success("User deactivated", { position: "top-right" });
      onOpenChange(false);
      setTimeout(() => {
        router.refresh();
      }, 300);
    },
  });

  const handleConfirm = async () => {
    await deactivateUser(userId);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Deactivate user"
      description={
        "The user will be marked as inactive and lose access. This action can be reversed by editing the user."
      }
      error={error}
      confirmLabel="Deactivate"
      cancelLabel="Cancel"
      onConfirm={handleConfirm}
      isLoading={isLoading}
      variant="destructive"
    />
  );
}
