'use client';

import Link from 'next/link';
import { useFormik } from 'formik';
import { ShieldCheck } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AgreementCheckbox } from '@/components/ui/AgreementCheckbox';
import { fieldInvalidClassName } from '@/components/ui/field-styles';
import toast from '@/utils/toast';
import { getPolicyBySlugRoutePath } from '@/routes/routes';
import { verifiedMentorApplicationSchema } from '@/utils/formValidation';
import { useGetAgreementByTouchpointAndUserTypeQuery } from '@/store/rtkQueries/agreementAPIs';
import { AGREEMENT_TOUCHPOINTS, AGREEMENT_VISIBLE_USER_TYPES } from '@/constants/agreements';
import { useSubmitVerifiedMentorApplicationMutation } from '@/store/rtkQueries/verifiedMentorApplicationApis';

export default function ApplyVerifiedMentorModal() {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state: RootState) => state.allModal);
    const onClose = () => dispatch(closeModal());

    const { data: agreementsResponse } = useGetAgreementByTouchpointAndUserTypeQuery({
        touchPoint: AGREEMENT_TOUCHPOINTS.VERIFIED_MENTOR_APPLICATION,
        userType: AGREEMENT_VISIBLE_USER_TYPES.MENTOR,
    });
    const agreements = agreementsResponse?.data ?? [];
    const requiredAgreementIds = agreements.filter((agreement) => agreement.is_required).map((agreement) => agreement._id);

    const [submitVerifiedMentorApplication, { isLoading }] = useSubmitVerifiedMentorApplicationMutation();

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, resetForm } =
        useFormik({
            initialValues: {
                applicationStatement: '',
                portfolioUrl: '',
                accepted_agreement_ids: [] as string[],
            },
            validationSchema: verifiedMentorApplicationSchema,
            validate: (vals) => {
                const allRequiredAccepted = requiredAgreementIds.every((id) => vals.accepted_agreement_ids.includes(id));
                return allRequiredAccepted ? {} : { accepted_agreement_ids: 'Please accept all required agreements before submitting.' };
            },
            onSubmit: async (formValues) => {
                try {
                    const res = await submitVerifiedMentorApplication({
                        application_statement: formValues.applicationStatement.trim(),
                        portfolio_url: formValues.portfolioUrl.trim(),
                        accepted_agreement_ids: formValues.accepted_agreement_ids,
                    }).unwrap();
                    toast.success(res?.message ?? 'Verification application submitted. teamtaaluma@taaluma.world will review within a few business days.');
                    resetForm();
                    onClose();
                } catch (error) {
                    console.error('Failed to submit verification application. Please try again.', error);
                }
            },
        });

    const wordCount = values.applicationStatement.trim() ? values.applicationStatement.trim().split(/\s+/).length : 0;
    const agreementsError = typeof errors.accepted_agreement_ids === 'string' ? errors.accepted_agreement_ids : undefined;
    const busy = isLoading || isSubmitting;

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="lg"
            scrollBehavior="outside"
        >
            <ModalContent>
                <form noValidate onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <ModalBody>
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 ring-1 ring-primary/15">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold">Apply for Verified Mentor</h2>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Our team will review your application within a few business days.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3 text-left">
                            <div className="space-y-1.5">
                                <div className="flex items-baseline justify-between gap-3">
                                    <Label htmlFor="applicationStatement" className="text-sm font-semibold text-slate-800">
                                        Application statement <span className="text-red-500">*</span>
                                    </Label>
                                    <span className={`shrink-0 text-xs tabular-nums ${wordCount > 300 ? 'font-medium text-red-600' : 'text-slate-400'}`}>
                                        {wordCount} / 300 words
                                    </span>
                                </div>
                                <Textarea
                                    id="applicationStatement"
                                    name="applicationStatement"
                                    rows={3}
                                    value={values.applicationStatement}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Tell us why you should be verified — your expertise, track record, and impact so far..."
                                    className={`resize-none ${touched.applicationStatement && errors.applicationStatement ? fieldInvalidClassName : ''}`}
                                    disabled={busy}
                                />
                                {touched.applicationStatement && errors.applicationStatement ? (
                                    <p className="text-sm text-red-600">{errors.applicationStatement}</p>
                                ) : null}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="portfolioUrl" className="text-sm font-semibold text-slate-800">
                                    Portfolio URL <span className="font-normal text-slate-400">(optional)</span>
                                </Label>
                                <Input
                                    id="portfolioUrl"
                                    name="portfolioUrl"
                                    value={values.portfolioUrl}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="https://your-portfolio.com"
                                    className={touched.portfolioUrl && errors.portfolioUrl ? fieldInvalidClassName : ''}
                                    disabled={busy}
                                />
                                {touched.portfolioUrl && errors.portfolioUrl ? (
                                    <p className="text-sm text-red-600">{errors.portfolioUrl}</p>
                                ) : null}
                            </div>
                        </div>

                        {agreements.length > 0 ? (
                            <div className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-left">
                                {agreements.map((agreement) => (
                                    <AgreementCheckbox
                                        key={agreement._id}
                                        id={agreement._id}
                                        checked={values.accepted_agreement_ids.includes(agreement._id)}
                                        error={agreementsError}
                                        touched={touched.accepted_agreement_ids as boolean | undefined}
                                        disabled={busy}
                                        onCheckedChange={(checked) => {
                                            const ids = checked
                                                ? [...values.accepted_agreement_ids, agreement._id]
                                                : values.accepted_agreement_ids.filter((id) => id !== agreement._id);
                                            setFieldValue('accepted_agreement_ids', ids);
                                        }}
                                        onBlur={() => setFieldTouched('accepted_agreement_ids', true)}
                                    >
                                        I accept the{' '}
                                        <Link
                                            href={getPolicyBySlugRoutePath(agreement.slug)}
                                            target="_blank"
                                            className="font-medium text-primary hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {agreement.title}
                                        </Link>
                                        {agreement.is_required && <span className="font-medium text-red-500"> *</span>}
                                    </AgreementCheckbox>
                                ))}
                            </div>
                        ) : null}
                    </ModalBody>

                    <ModalFooter className="flex gap-3 mt-3 border-t border-slate-100 pt-3">
                        <Button
                            type="button"
                            className="global_btn rounded_full outline_primary flex-1"
                            onPress={handleClose}
                            disabled={busy}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="global_btn rounded_full bg_primary flex-1"
                            isLoading={busy}
                            startContent={!busy && <ShieldCheck className="h-4 w-4" />}
                        >
                            Submit Application
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
