'use client';

import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import Button from '@/components/ui/Button';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { useUpdateStaffStatusMutation } from '@/store/rtkQueries/rolesPermissionsApi';
import { staffStatusSchema } from '@/utils/formValidation';
import toast from '@/utils/toast';

const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

export function UpdateStaffStatusModal() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state: RootState) => state.allModal);
    const staff = data?.staff as any | null;

    const [updateStaffStatus, { isLoading: isUpdating }] = useUpdateStaffStatusMutation();
    const onClose = () => dispatch(closeModal());

    const newStatus = staff?.status === 'active' ? 'suspended' : 'active';
    const isSuspending = newStatus === 'suspended';

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormik({
        enableReinitialize: true,
        initialValues: {
            status_reason: '',
        },
        validationSchema: staffStatusSchema,
        onSubmit: async (formValues) => {
            if (!staff) return;

            try {
                const res = await updateStaffStatus({
                    id: staff._id,
                    payload: {
                        status: newStatus,
                        status_reason: formValues.status_reason,
                    },
                }).unwrap();

                if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                    toast.success(res?.message ?? 'Status updated successfully');
                    onClose();
                }
            } catch {
                toast.error('Failed to update status');
            }
        },
    });

    const isLoading = isUpdating || isSubmitting;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="modal_container" size="md">
            <ModalContent className="admin_panel">
                <form noValidate onSubmit={handleSubmit}>
                    <ModalHeader className="flex flex-col gap-1">
                        <p className="text-xl font-bold">
                            {isSuspending ? 'Suspend Institutional Staff' : 'Activate Institutional Staff'}
                        </p>
                        <p className="text-sm font-normal text-muted-foreground">
                            {isSuspending
                                ? `Suspend "${staff?.name}" and provide a reason.`
                                : `Activate "${staff?.name}" and provide a reason.`}
                        </p>
                    </ModalHeader>

                    <ModalBody className="py-2">
                        <div>
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
                                placeholder={isSuspending ? 'e.g. Policy violation' : 'e.g. Issue resolved'}
                            />
                            {touched.status_reason && errors.status_reason ? (
                                <p className="mt-1 text-sm text-red-600">{errors.status_reason}</p>
                            ) : null}
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            className="global_btn outline_primary"
                            onPress={onClose}
                            isDisabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className={`global_btn ${isSuspending ? 'danger_btn' : 'success_btn'}`}
                            isLoading={isLoading}
                            isDisabled={isLoading}
                        >
                            {isSuspending ? 'Suspend' : 'Activate'}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
