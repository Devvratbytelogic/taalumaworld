'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { resetPasswordSchema } from '@/utils/formValidation';
import { useAdminResetPasswordMutation } from '@/store/rtkQueries/adminAuth';
import toast from '@/utils/toast';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import { getHomeRoutePath } from '@/routes/routes';

interface TokenResetPasswordFormProps {
  token?: string | null;
}

export function TokenResetPasswordForm({ token }: TokenResetPasswordFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, { isLoading: isResetting }] = useAdminResetPasswordMutation();

  const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur } = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: resetPasswordSchema,
    onSubmit: async (formValues, { resetForm }) => {
      if (!token) {
        toast.error('Reset link is missing or invalid. Please request a new one.');
        return;
      }

      try {
        const res = await resetPassword({
          payload: {
            reset_token: token,
            password: formValues.password,
            confirm_password: formValues.confirmPassword,
          },
        }).unwrap();

        if (res?.http_status_code === 200 || res?.http_status_code === 201) {
          toast.success(res.message ?? 'Password updated successfully!');
          resetForm();
          router.push(getHomeRoutePath());
        }
      } catch {
        toast.error('Failed to reset password. The link may have expired.');
      }
    },
  });

  if (!token) {
    return (
      <AuthPageShell
        title="Invalid Reset Link"
        subtitle="This password reset link is missing or invalid."
        footer={
          <p>
            <Link href={getHomeRoutePath()} className="font-medium text-primary hover:text-primary/80">
              Back to home
            </Link>
          </p>
        }
      >
        <p className="text-center text-sm text-muted-foreground">
          Please use the link from your email, or ask an administrator to generate a new reset link.
        </p>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell
      title="Set a New Password"
      subtitle="Choose a strong password to secure your account"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="token-reset-password" className="text-sm font-medium text-foreground">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="token-reset-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter a new password"
              className={`pl-12 pr-12 h-12 rounded-md ${errors.password && touched.password ? 'border-red-500' : ''}`}
              disabled={isSubmitting || isResetting}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isSubmitting || isResetting}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && touched.password ? (
            <p className="text-sm text-red-600">{errors.password}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="token-reset-confirmPassword" className="text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="token-reset-confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              className={`pl-12 pr-12 h-12 rounded-md ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`}
              disabled={isSubmitting || isResetting}
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isSubmitting || isResetting}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && touched.confirmPassword ? (
            <p className="text-sm text-red-600">{errors.confirmPassword}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          className="global_btn bg_primary w-full"
          disabled={isSubmitting || isResetting}
          isLoading={isSubmitting || isResetting}
        >
          Update Password
        </Button>
      </form>
    </AuthPageShell>
  );
}
