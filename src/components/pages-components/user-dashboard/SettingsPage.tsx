'use client';

import { useState } from 'react';
import { Lock, LogOut, Eye, EyeOff, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { cn } from '@/components/ui/utils';
import { fieldInvalidClassName } from '@/components/ui/field-styles';
import toast from '@/utils/toast';
import { useUserChangePasswordMutation } from '@/store/rtkQueries/userAuthApi';
import { useGetUserProfileQuery } from '@/store/rtkQueries/userGetAPI';
import moment from 'moment';
import { clearAuthCookies } from '@/utils/authCookies';
import { getHomeRoutePath } from '@/routes/routes';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';

export function SettingsPage() {
  const { data: profileRes, isLoading: isLoadingProfile } = useGetUserProfileQuery();
  const lastChangedDate = profileRes?.data?.updatedAt;
  const [changePassword, { isLoading: isSaving }] = useUserChangePasswordMutation();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validatePasswordChange = () => {
    const newErrors: typeof errors = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (newPassword === currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async () => {
    if (!validatePasswordChange()) return;

    try {
      const res = await changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      }).unwrap();
      toast.success((res as { message?: string }).message ?? 'Password changed successfully!');
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    } catch (err) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      // toast.error(message ?? 'Failed to change password. Please try again.');
      console.log(message);
    }
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    setShowLogoutModal(false);
    clearAuthCookies();
    window.location.href = getHomeRoutePath();
  };

  const handleCancel = () => {
    setIsChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  const lastChangedLabel =
    isLoadingProfile || !lastChangedDate || !moment(lastChangedDate).isValid()
      ? isLoadingProfile
        ? 'Loading...'
        : '—'
      : moment(lastChangedDate).format('MMMM D, YYYY · h:mm A');

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader title="Settings" description="Manage your account settings and preferences" />

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <section className="px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50/60">
              <Lock className="h-4 w-4 text-primary" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-gray-900">Password & Security</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                Update your password to keep your account secure
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-gray-200 bg-gray-50/60">
            {!isChangingPassword ? (
              <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                <div className="text-sm text-gray-600">
                  <span className="text-gray-500">Last changed</span>
                  <p className="mt-0.5 font-normal text-gray-900">{lastChangedLabel}</p>
                </div>
                <Button
                  type="button"
                  className="global_btn rounded_full bg_primary w-full sm:w-auto"
                  onPress={() => setIsChangingPassword(true)}
                >
                  Change Password
                </Button>
              </div>
            ) : (
              <div className="space-y-5 px-5 py-5">
                <div>
                  <label htmlFor="currentPassword" className="mb-2 block text-sm font-normal text-gray-600">
                    Current password
                  </label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        if (errors.currentPassword) {
                          setErrors({ ...errors, currentPassword: undefined });
                        }
                      }}
                      placeholder="Enter your current password"
                      disabled={isSaving}
                      className={cn('pr-10', errors.currentPassword && fieldInvalidClassName)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isSaving}
                      aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.currentPassword ? (
                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="newPassword" className="mb-2 block text-sm font-normal text-gray-600">
                    New password
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword) {
                          setErrors({ ...errors, newPassword: undefined });
                        }
                      }}
                      placeholder="Enter your new password"
                      disabled={isSaving}
                      className={cn('pr-10', errors.newPassword && fieldInvalidClassName)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isSaving}
                      aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.newPassword ? (
                    <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-normal text-gray-600">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors({ ...errors, confirmPassword: undefined });
                        }
                      }}
                      placeholder="Confirm your new password"
                      disabled={isSaving}
                      className={cn('pr-10', errors.confirmPassword && fieldInvalidClassName)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isSaving}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword ? (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  ) : null}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-gray-200/70 pt-5 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    className="global_btn rounded_full outline_primary w-full sm:w-auto"
                    onPress={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onPress={handlePasswordChange}
                    disabled={isSaving}
                    className="global_btn rounded_full bg_primary w-full sm:w-auto"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-gray-100 px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-red-100 bg-red-50">
                <LogOut className="h-4 w-4 text-red-500" aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-gray-900">Logout</h2>
                <p className="mt-0.5 text-sm text-gray-500">Sign out of your account on this device</p>
              </div>
            </div>
            <Button
              type="button"
              className="global_btn rounded_full danger_outline w-full sm:w-auto"
              onPress={() => setShowLogoutModal(true)}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </section>
      </div>

      {showLogoutModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
            aria-hidden
          />
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-white"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
          >
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-red-100 bg-red-50">
                  <LogOut className="h-4 w-4 text-red-500" aria-hidden />
                </span>
                <div>
                  <h3 id="logout-dialog-title" className="text-base font-semibold text-gray-900">
                    Log out?
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Are you sure you want to sign out of your account?
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 px-6 py-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                className="global_btn rounded_full outline_primary w-full sm:w-auto"
                onPress={() => setShowLogoutModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="global_btn rounded_full danger_btn w-full sm:w-auto"
                onPress={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
