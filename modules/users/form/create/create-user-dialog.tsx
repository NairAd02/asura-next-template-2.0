"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateUserFormContainer from "./create-user-form-container";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateUserDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-150 p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Invite New User</DialogTitle>
        </DialogHeader>
        <CreateUserFormContainer onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
