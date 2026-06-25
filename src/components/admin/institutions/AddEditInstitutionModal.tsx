'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import {
    useAddInstitutionMutation,
    useUpdateInstitutionMutation,
} from '@/store/rtkQueries/institutionApi';
import type { IInstitution, IInstitutionFormValues, ReAccessPricingType } from '@/types/institution';
import toast from '@/utils/toast';

const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

function toDateInput(iso?: string) {
    if (!iso) return '';
    return iso.substring(0, 10);
}

function buildInitial(institution?: IInstitution | null): IInstitutionFormValues {
    if (!institution) {
        return {
            name: '',
            country: 'Kenya',
            contact_email: '',
            email_domains: '',
            promotional_start_date: '',
            promotional_end_date: '',
            re_access_type: 'market',
            re_access_discount: 0,
        };
    }
    return {
        name: institution.name,
        country: institution.country,
        contact_email: institution.contact_email,
        email_domains: institution.email_domains.map((d) => d.domain).join(', '),
        promotional_start_date: toDateInput(institution.promotional_access?.start_date),
        promotional_end_date: toDateInput(institution.promotional_access?.end_date),
        re_access_type: institution.re_access_pricing?.type ?? 'market',
        re_access_discount: institution.re_access_pricing?.discount_percentage ?? 0,
    };
}

export function AddEditInstitutionModal() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state: RootState) => state.allModal);
    const institution: IInstitution | null = data?.institution ?? null;
    const isEdit = !!institution;

    const [values, setValues] = useState<IInstitutionFormValues>(buildInitial(institution));

    const [addInstitution, { isLoading: isAdding }] = useAddInstitutionMutation();
    const [updateInstitution, { isLoading: isUpdating }] = useUpdateInstitutionMutation();
    const isLoading = isAdding || isUpdating;

    useEffect(() => {
        if (isOpen) setValues(buildInitial(institution));
    }, [isOpen]);

    const onClose = () => dispatch(closeModal());

    const set = <K extends keyof IInstitutionFormValues>(
        key: K,
        val: IInstitutionFormValues[K]
    ) => setValues((prev) => ({ ...prev, [key]: val }));

    const isValid =
        values.name.trim() &&
        values.contact_email.trim() &&
        values.email_domains.trim() &&
        values.promotional_start_date &&
        values.promotional_end_date;

    const handleSubmit = async () => {
        const payload = {
            name: values.name,
            country: values.country,
            contact_email: values.contact_email,
            email_domains: values.email_domains
                .split(',')
                .map((d) => ({ domain: d.trim().toLowerCase(), is_primary: false }))
                .filter((d) => d.domain),
            promotional_access: {
                start_date: values.promotional_start_date,
                end_date: values.promotional_end_date,
                is_active: true,
                grace_period_days: 0,
            },
            re_access_pricing: {
                type: values.re_access_type,
                discount_percentage: values.re_access_discount || undefined,
            },
        };
        try {
            if (isEdit) {
                await updateInstitution({ id: institution!._id, values: payload }).unwrap();
                toast.success('Institution updated');
            } else {
                await addInstitution(payload).unwrap();
                toast.success('Institution added');
            }
            onClose();
        } catch {
            // handled by RTK layer
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="modal_container"
            size="2xl"
            scrollBehavior="inside"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <p className="text-xl font-bold">
                        {isEdit ? 'Edit Institution' : 'Add Partner Institution'}
                    </p>
                    <p className="text-sm font-normal text-muted-foreground">
                        {isEdit
                            ? 'Update the details for this partner university.'
                            : 'Register a new partner university for institutional access.'}
                    </p>
                </ModalHeader>

                <ModalBody className="space-y-5 py-4">
                    {/* Institution name + country */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>
                                Institution Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                className={inputCls}
                                value={values.name}
                                onChange={(e) => set('name', e.target.value)}
                                placeholder="e.g. University of Nairobi"
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Country</label>
                            <input
                                className={inputCls}
                                value={values.country}
                                onChange={(e) => set('country', e.target.value)}
                                placeholder="e.g. Kenya"
                            />
                        </div>
                    </div>

                    {/* Contact email */}
                    <div>
                        <label className={labelCls}>
                            Contact Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputCls}
                            type="email"
                            value={values.contact_email}
                            onChange={(e) => set('contact_email', e.target.value)}
                            placeholder="partnerships@university.ac.ke"
                        />
                    </div>

                    {/* Email domains */}
                    <div>
                        <label className={labelCls}>
                            Institutional Email Domains <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputCls}
                            value={values.email_domains}
                            onChange={(e) => set('email_domains', e.target.value)}
                            placeholder="students.uonbi.ac.ke, uonbi.ac.ke"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Comma-separated. Domain matching is case-insensitive.
                        </p>
                    </div>

                    {/* Promotional period */}
                    <div>
                        <p className={labelCls}>
                            Promotional Access Period <span className="text-red-500">*</span>
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={inputCls}
                                    type="date"
                                    value={values.promotional_start_date}
                                    onChange={(e) => set('promotional_start_date', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">
                                    End Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={inputCls}
                                    type="date"
                                    value={values.promotional_end_date}
                                    onChange={(e) => set('promotional_end_date', e.target.value)}
                                    min={values.promotional_start_date}
                                />
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Automated reminder emails are sent 30, 7, and 1 day before expiry.
                        </p>
                    </div>

                    {/* Re-access pricing */}
                    <div>
                        <p className={labelCls}>Re-Access Pricing (after expiry)</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Pricing Type</label>
                                <select
                                    className={inputCls}
                                    value={values.re_access_type}
                                    onChange={(e) =>
                                        set('re_access_type', e.target.value as ReAccessPricingType)
                                    }
                                >
                                    <option value="market">Market Price</option>
                                    <option value="discounted">Discounted Price</option>
                                </select>
                            </div>
                            {values.re_access_type === 'discounted' && (
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">
                                        Discount Percentage
                                    </label>
                                    <input
                                        className={inputCls}
                                        type="number"
                                        min={1}
                                        max={100}
                                        value={values.re_access_discount}
                                        onChange={(e) =>
                                            set('re_access_discount', Number(e.target.value))
                                        }
                                        placeholder="e.g. 30"
                                    />
                                </div>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Upon expiry, users lose free access but can re-access content at this price.
                        </p>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button variant="bordered" onPress={onClose} isDisabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        isLoading={isLoading}
                        isDisabled={!isValid || isLoading}
                        onPress={handleSubmit}
                    >
                        {isEdit ? 'Save Changes' : 'Add Institution'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
