'use client';

import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { useAddRoleMutation, useUpdateRoleMutation } from '@/store/rtkQueries/rolesPermissionsApi';
import { roleSchema } from '@/utils/formValidation';
import toast from '@/utils/toast';

const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

export function AddEditRoleModal() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state: RootState) => state.allModal);
    const role = data?.role ?? null;
    const isEdit = data?.isEdit ?? false;

    const [addRole, { isLoading: isAdding }] = useAddRoleMutation();
    const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

    const onClose = () => dispatch(closeModal());

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: role?.name ?? '',
            description: role?.description ?? '',
            number_of_users: role?.number_of_users ?? 1,
        },
        validationSchema: roleSchema,
        onSubmit: async (formValues) => {
            try {
                if (isEdit) {
                    const res = await updateRole({ id: role._id, payload: formValues }).unwrap();
                    if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                        toast.success(res?.message ?? 'Role updated successfully');
                        onClose();
                    }
                } else {
                    const res = await addRole(formValues).unwrap();
                    if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                        toast.success(res?.message ?? 'Role created successfully');
                        onClose();
                    }
                }
            } catch (error) {
                console.error('Error adding/updating role', error);
            }
        },
    });

    const isLoading = isAdding || isUpdating || isSubmitting;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="modal_container" size="lg" scrollBehavior="inside">
            <ModalContent className="admin_panel">
                <form noValidate onSubmit={handleSubmit}>
                    <ModalHeader className="flex flex-col gap-1">
                        <p className="text-xl font-bold">{isEdit ? 'Edit Role' : 'Create Role'}</p>
                        <p className="text-sm font-normal text-muted-foreground">
                            {isEdit
                                ? 'Update the role name and description.'
                                : 'Define a new role. Permissions can be configured in the Permissions Matrix tab.'}
                        </p>
                    </ModalHeader>

                    <ModalBody className="py-4">
                        <div>
                            <label className={labelCls} htmlFor="name">
                                Role Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                className={inputCls}
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="e.g. Content Moderator"
                            />
                            {touched.name && errors.name && typeof errors.name === 'string' ? (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            ) : null}
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                className={`${inputCls} min-h-[80px] resize-y`}
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Describe what this role can do..."
                            />
                            {touched.description && errors.description && typeof errors.description === 'string' ? (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            ) : null}
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="number_of_users">
                                Number of Users <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="number_of_users"
                                name="number_of_users"
                                type="number"
                                min={1}
                                className={inputCls}
                                value={values.number_of_users}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setFieldValue('number_of_users', val === '' ? '' : Number(val));
                                }}
                                onBlur={handleBlur}
                                placeholder="1"
                            />
                            {touched.number_of_users && errors.number_of_users && typeof errors.number_of_users === 'string' ? (
                                <p className="mt-1 text-sm text-red-600">{errors.number_of_users}</p>
                            ) : null}
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="light" onPress={onClose} isDisabled={isLoading}>
                            Cancel
                        </Button>
                        <Button color="primary" type="submit" isLoading={isLoading}>
                            {isEdit ? 'Save Changes' : 'Create Role'}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
