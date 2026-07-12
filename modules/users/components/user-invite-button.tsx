"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Modal } from "@/components/modal/modal";
import { useTranslations } from "next-intl";
import CreateUserFormContainer from "../form/create/create-user-form-container";

export default function UserInviteButton() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("users.create");

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {t("trigger")}
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={t("modalTitle")}
        description={t("modalDescription")}
        maxWidth="md"
        maxHeight="lg"
        bodyClassName="py-0"
      >
        <CreateUserFormContainer onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}
