"use client";

import { RHFTextField } from "@/components/form/rhf-components/rhf-text-field/rhf-text-field";
import { RHFSelectField } from "@/components/form/rhf-components/rhf-select-field/rhf-select-field";
import { RHFMultiFileUpload } from "@/components/form/rhf-components/rhf-multi-file-upload/rhf-multi-file-upload";
import { AlertComponent } from "@/components/ui/alert-component";
import FormActionFooter from "@/components/form/components/form-action-footer";
import { useTranslations } from "next-intl";
import { ItemImage } from "../lib/types/item.types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface SelectOption {
  label: string;
  value: string;
}

interface ItemFormProps {
  loading?: boolean;
  error?: string | null;
  onCancel?: () => void;
  categoryOptions: SelectOption[];
  existingImages?: ItemImage[];
}

export default function ItemForm({
  loading = false,
  error,
  onCancel,
  categoryOptions,
  existingImages = [],
}: ItemFormProps) {
  const t = useTranslations("itemForm");

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {error && <AlertComponent title={error} variant="destructive" />}

        {/* ── Basic fields ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("itemInfo")}
            </h3>
          </div>

          <RHFTextField
            name="name"
            label={t("name")}
            placeholder={t("namePlaceholder")}
            fullWidth
          />

          <RHFTextField
            name="description"
            label={t("description")}
            placeholder={t("descriptionPlaceholder")}
            fullWidth
          />

          <RHFSelectField
            name="itemCategoryId"
            label={t("category")}
            placeholder={t("categoryPlaceholder")}
            options={categoryOptions}
            fullWidth
          />
        </div>

        {/* ── Existing images (read-only carousel) ──────────────────────── */}
        {existingImages.length > 0 && (
          <div className="bg-white rounded-lg border p-4 space-y-3">
            <div className="border-b pb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("existingImages")} ({existingImages.length})
              </h3>
            </div>
            <Carousel
              opts={{ align: "start", loop: existingImages.length > 1 }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {existingImages.map((img, idx) => (
                  <CarouselItem
                    key={idx}
                    className="pl-2 basis-1/2 sm:basis-1/3"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                      <Image
                        src={img.url}
                        alt={img.note || `Image ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    </div>
                    {img.note && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {img.note}
                      </p>
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
              {existingImages.length > 1 && (
                <>
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </>
              )}
            </Carousel>
            <p className="text-xs text-muted-foreground">
              {t("existingImagesNote")}
            </p>
          </div>
        )}

        {/* ── Add new images ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-lg border p-4 space-y-3">
          <div className="border-b pb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("addImages")}
            </h3>
          </div>
          <RHFMultiFileUpload
            name="images"
            label={t("imagesLabel")}
            maxFiles={10}
            maxSize={8 * 1024 * 1024}
            acceptedFileTypes={{
              "image/*": [".jpeg", ".jpg", ".png", ".webp"],
            }}
            compressImages
            quality={85}
            maxWidth={1920}
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            {t("imagesNote")}
          </p>
        </div>
      </div>

      <FormActionFooter
        loading={loading}
        onCancel={onCancel || (() => {})}
        cancelButtonText={t("cancel")}
        submitButtonText={t("saveChanges")}
        loadingText={t("saving")}
      />
    </div>
  );
}
