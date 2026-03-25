import { useState } from 'react';
import { Settings, Lock, LogOut, Eye, EyeOff, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import toast from '@/utils/toast';
import { useUserChangePasswordMutation } from '@/store/rtkQueries/userAuthApi';

interface SettingsPageProps {
  onLogout: () => void;
}

export function SettingsPage({ onLogout }: SettingsPageProps) {
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
    onLogout();
  };

  const handleCancel = () => {
    setIsChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-500/10 rounded-2xl">
            <Settings className="h-6 w-6 text-purple-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Lock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Password & Security</h2>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure
              </p>
            </div>
          </div>

          {!isChangingPassword ? (
            <div>
              {/* <p className="text-sm text-muted-foreground mb-4">
                Last changed: Never
              </p> */}
              <Button className='global_btn rounded_full bg_primary' onPress={() => setIsChangingPassword(true)}>
                Change Password
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Input
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
                    className={errors.currentPassword ? 'border-red-300' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isSaving}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-xs text-red-600 mt-1">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
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
                    className={errors.newPassword ? 'border-red-300' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isSaving}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-red-600 mt-1">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
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
                    className={errors.confirmPassword ? 'border-red-300' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isSaving}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onPress={handlePasswordChange}
                  disabled={isSaving}
                  className='global_btn rounded_full bg_primary'
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
                <Button
                  className='global_btn rounded_full outline_primary'
                  onPress={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-red-100">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 rounded-xl">
              <LogOut className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Logout</h2>
              <p className="text-sm text-muted-foreground">
                Sign out of your account
              </p>
            </div>
          </div>

          <Button
            className='global_btn rounded_full danger_outline'
            onPress={() => setShowLogoutModal(true)}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center gap-4">
            <div className="p-3 bg-red-100 rounded-2xl">
              <LogOut className="h-7 w-7 text-red-500" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-1">Log out?</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to sign out of your account?
              </p>
            </div>
            <div className="flex gap-3 w-full pt-1">
              <Button
                className="global_btn rounded_full outline_primary flex-1"
                onPress={() => setShowLogoutModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="global_btn rounded_full danger_btn flex-1"
                onPress={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
