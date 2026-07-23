import { TokenResetPasswordForm } from '@/components/auth/TokenResetPasswordForm';

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams.token ?? null;

  return <TokenResetPasswordForm token={token} />;
}
