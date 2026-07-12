"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertComponent } from "@/components/ui/alert-component";
import {
  updateProfileSchema,
  UpdateProfileSchema,
} from "../schemas/update-profile-schema";

interface Props {
  defaultFullName: string;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: UpdateProfileSchema) => void;
  onCancel: () => void;
}

export function EditProfileForm({
  defaultFullName,
  isLoading,
  error,
  onSubmit,
  onCancel,
}: Props) {
  const t = useTranslations("userProfile");

  const methods = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { fullName: defaultFullName },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <AlertComponent title={error} variant="destructive" />}

        <div className="space-y-2">
          <Label htmlFor="fullName">{t("form.fullName")}</Label>
          <Input
            id="fullName"
            placeholder={t("form.fullNamePlaceholder")}
            {...register("fullName")}
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            {t("form.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("form.saving")}
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t("form.save")}
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
