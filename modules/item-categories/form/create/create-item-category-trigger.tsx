"use client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal/modal";
import { Plus, Package } from "lucide-react";
import { useState } from "react";

import { useTranslations } from "next-intl";
import CreateItemCategoryFormContainer from "./create-item-category-form-container";

export default function CreateItemCategoryTrigger() {
  const t = useTranslations("itemCategories.create");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button variant={"default"} onClick={() => setIsModalOpen(true)}>
        <Plus className="h-4 w-4" />
        {t("trigger")}
      </Button>

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={t("sheetTitle")}
        description={t("sheetDescription")}
        icon={<Package className="h-9 w-9" />}
        maxWidth="2xl"
        bodyClassName="px-0 py-0 pb-4"
      >
        <CreateItemCategoryFormContainer onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
