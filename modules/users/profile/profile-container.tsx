"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "@/modules/users/lib/hooks/use-current-user";
import { useUpdateUserProfile } from "@/modules/users/lib/hooks/use-update-user-profile";
import { ProfilePresentational } from "./profile-presentational";
import { UpdateProfileSchema } from "./schemas/update-profile-schema";
import { UserDetails } from "@/modules/users/lib/types/user.types";
import { LoadingDataSpinner } from "@/components/ui/loading-data-spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { paths } from "@/routes/paths";

interface Props {
  onProfileUpdated?: (updated: UserDetails) => void;
}

export function ProfileContainer({ onProfileUpdated }: Props) {
  const t = useTranslations("userProfile");
  const router = useRouter();
  const { user, isLoading, error, refetch } = useCurrentUser();

  const handleSuccess = useCallback(
    (updated: UserDetails) => {
      refetch();
      onProfileUpdated?.(updated);
    },
    [refetch, onProfileUpdated],
  );

  const {
    updateProfile,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateUserProfile({ onSuccess: handleSuccess });

  const handleSave = useCallback(
    async (data: UpdateProfileSchema) => {
      await updateProfile({ fullName: data.fullName });
    },
    [updateProfile],
  );

  const handlePasswordChange = useCallback(async () => {
    toast.success("Password changed successfully. Please sign in again.", {
      position: "top-right",
    });
    router.push(paths.authLogin.root);
  }, [router]);

  if (isLoading) {
    return (
      <LoadingDataSpinner
        loadingText={t("loading")}
        loadingSubtitle={t("loadingSubtitle")}
      />
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32 min-h-100">
        <div className="text-destructive text-lg font-semibold">
          {t("error")}
        </div>
        <div className="text-muted-foreground">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32 min-h-100">
        <div className="text-muted-foreground">{t("notFound")}</div>
      </div>
    );
  }

  return (
    <ProfilePresentational
      user={user}
      isUpdating={isUpdating}
      updateError={updateError}
      onSave={handleSave}
      onPasswordChange={handlePasswordChange}
    />
  );
}
