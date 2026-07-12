import ForgotPasswordContent from "@/modules/users/forgot-password/forgot-password-content";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ForgotPasswordContent locale={locale} />;
}
