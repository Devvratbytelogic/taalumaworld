'use client';

import { useFormik } from 'formik';
import Button from '../../ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { staffStatusSchema } from '@/utils/formValidation';
import type { IAllUsersEntity } from '@/types/rolesPermissions';

const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

interface SuspendUserDialogProps {
  user: IAllUsersEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (statusReason: string) => void;
  isLoading?: boolean;
}

export function SuspendUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: SuspendUserDialogProps) {
  const isSuspended = user?.status === 'suspended';

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm } = useFormik({
    enableReinitialize: true,
    initialValues: { status_reason: '' },
    validationSchema: staffStatusSchema,
    onSubmit: (formValues) => {
      onConfirm(formValues.status_reason);
      resetForm();
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetForm();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="admin_panel max-w-sm">
        <form noValidate onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isSuspended ? 'Activate Customer' : 'Suspend Customer'}</DialogTitle>
            <DialogDescription>
              {user
                ? isSuspended
                  ? `Activate "${user.name}" and provide a reason. They will be able to sign in again.`
                  : `Suspend "${user.name}" and provide a reason. They will not be able to sign in until reinstated.`
                : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <label className={labelCls} htmlFor="status_reason">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              id="status_reason"
              name="status_reason"
              className={`${inputCls} min-h-[100px] resize-y`}
              value={values.status_reason}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={isSuspended ? 'e.g. Issue resolved' : 'e.g. Policy violation'}
            />
            {touched.status_reason && errors.status_reason ? (
              <p className="mt-1 text-sm text-red-600">{errors.status_reason}</p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              onPress={() => onOpenChange(false)}
              isDisabled={isLoading}
              className="global_btn rounded_full outline_primary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isDisabled={isLoading}
              isLoading={isLoading}
              className={`global_btn rounded_full ${isSuspended ? 'success_btn' : 'danger_btn'}`}
            >
              {isLoading
                ? isSuspended ? 'Activating...' : 'Suspending...'
                : isSuspended ? 'Activate' : 'Suspend'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
