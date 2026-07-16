"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal/modal";
import CreateSupplierFormContainer from "./create-supplier-form-container";

export default function CreateSupplierTrigger() {
  const t = useTranslations("suppliers");
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}><Plus className="mr-1 size-4" />{t("create")}</Button>
      <Modal open={open} onOpenChange={setOpen} title={t("createTitle")} description={t("createDescription")} maxWidth="2xl" bodyClassName="px-0 py-0 pb-4">
        {open && <CreateSupplierFormContainer onClose={() => setOpen(false)} />}
      </Modal>
    </>
  );
}
