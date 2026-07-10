'use client';

import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { useAddStaffMutation, useGetAllRolesQuery, useUpdateStaffMutation } from '@/store/rtkQueries/rolesPermissionsApi';
import { staffSchema } from '@/utils/formValidation';
import toast from '@/utils/toast';
import ReactSelect from 'react-select';
import { SELECT_STYLES } from '@/constants/selectStyle';

const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

export function AddEditStaffModal() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state: RootState) => state.allModal);
    const staff = data?.staff ?? null;
    const isEdit = data?.isEdit ?? false;

    const { data: rolesData } = useGetAllRolesQuery();
    const roles = rolesData?.data?.data ?? [];
    const roleOptions = roles.map((r) => ({ value: r._id, label: r.name }));
    const [addStaff, { isLoading: isAdding }] = useAddStaffMutation();
    const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();

    const onClose = () => dispatch(closeModal());

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched } = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: staff?.name ?? '',
            email: staff?.email ?? '',
            role_id: staff?.role_id ?? '',
        },
        validationSchema: staffSchema,
        onSubmit: async (formValues) => {
            try {
                if (isEdit) {
                    const res = await updateStaff({ id: data?.staff._id, payload: formValues }).unwrap();
                    if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                        toast.success(res?.message ?? 'Staff member updated successfully');
                        onClose();
                    }
                } else {
                    const res = await addStaff(formValues).unwrap();
                    if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                        toast.success(res?.message ?? 'Staff member added successfully');
                        onClose();
                    }
                }
            } catch (error) {
                console.error('Error adding/updating staff', error);
            }
        },
    });

    const isLoading = isAdding || isSubmitting || isUpdating;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="modal_container" size="md" scrollBehavior="inside">
            <ModalContent className="admin_panel">
                <form noValidate onSubmit={handleSubmit}>
                    <ModalHeader className="flex flex-col gap-1">
                        <p className="text-xl font-bold">Add Staff Member</p>
                        <p className="text-sm font-normal text-muted-foreground">
                            Assign a role to a new administrator or mentor.
                        </p>
                    </ModalHeader>

                    <ModalBody className="py-2 overflow-visible">
                        <div>
                            <label className={labelCls} htmlFor="name">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                className={inputCls}
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="e.g. Jane Doe"
                            />
                            {touched.name && errors.name ? (
                                <p className="mt-1 text-sm text-red-600">{errors.name as string}</p>
                            ) : null}
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="email">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className={inputCls}
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="name@taaluma.world"
                            />
                            {touched.email && errors.email ? (
                                <p className="mt-1 text-sm text-red-600">{errors.email as string}</p>
                            ) : null}
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="role_id">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <ReactSelect
                                inputId="role_id"
                                name="role_id"
                                classNamePrefix="react-select"
                                options={roleOptions}
                                value={roleOptions.find((o) => o.value === values.role_id) ?? null}
                                onChange={(option) => {
                                    setFieldValue('role_id', option?.value ?? '');
                                    setFieldTouched('role_id', true);
                                }}
                                onBlur={() => setFieldTouched('role_id', true)}
                                placeholder="Select a role"
                                isDisabled={isLoading}
                                styles={SELECT_STYLES}
                            />
                            {touched.role_id && errors.role_id ? (
                                <p className="mt-1 text-sm text-red-600">{errors.role_id as string}</p>
                            ) : null}
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="light" onPress={onClose} isDisabled={isLoading}>
                            Cancel
                        </Button>
                        <Button color="primary" type="submit" isLoading={isLoading}>
                            {isEdit ? 'Update Staff' : 'Add Staff'}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
