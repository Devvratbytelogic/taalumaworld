import { useEffect } from 'react';
import { useFormik } from 'formik';
import { Send, X } from 'lucide-react';
import Button from '../../ui/Button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import toast from '@/utils/toast';
import { inviteMentorSchema } from '@/utils/formValidation';

const initialFormValues = {
  fullName: '',
  email: '',
};

export type InviteMentorFormValues = typeof initialFormValues;

interface InviteMentorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitForm?: (values: InviteMentorFormValues) => Promise<void>;
}

export function InviteMentorModal({
  open,
  onOpenChange,
  onSubmitForm,
}: InviteMentorModalProps) {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: initialFormValues,
    validationSchema: inviteMentorSchema,
    onSubmit: async () => {
      try {
        if (onSubmitForm) {
          await onSubmitForm(values);
        }
        resetForm({ values: initialFormValues });
        onOpenChange(false);
      } catch (error) {
        console.error('Error inviting mentor:', error);
      }
    },
  });

  useEffect(() => {
    if (!open) {
      resetForm({ values: initialFormValues });
    }
  }, [open, resetForm]);

  const closeModal = () => {
    resetForm({ values: initialFormValues });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin_panel max-w-md">
        <DialogHeader>
          <DialogTitle>Invite mentor</DialogTitle>
          <DialogDescription>
            Send an invitation so the mentor can create their account, complete their profile,
            and accept mentor terms. Publishing access is granted immediately after onboarding.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="admin_panel flex min-h-0 flex-col">
          <div className="space-y-4 py-4">
            <div className="rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-sm text-sky-900">
              Verification and tier assignment happen later and will not block publishing.
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-fullName">Full name</Label>
              <Input
                id="invite-fullName"
                name="fullName"
                placeholder="e.g., Jane Doe"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-email">
                Email<span className="text-red-500">*</span>
              </Label>
              <Input
                id="invite-email"
                name="email"
                type="email"
                placeholder="e.g., jane@example.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={errors.email && touched.email ? 'border-red-500' : ''}
              />
              {errors.email && touched.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="global_btn rounded_full outline_primary"
              onPress={closeModal}
              startContent={<X className="h-4 w-4" />}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="global_btn rounded_full bg_primary"
              startContent={<Send className="h-4 w-4" />}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Send invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
