'use client';

import { useRef } from 'react';
import { useFormik } from 'formik';
import { ShieldCheck, X } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AgreementSentenceList } from '@/components/ui/AgreementSentenceList';
import { fieldInvalidClassName } from '@/components/ui/field-styles';
import toast from '@/utils/toast';
import { getApiErrorMessage } from '@/utils/agreementConsent';
import { verifiedMentorApplicationSchema } from '@/utils/formValidation';
import { AGREEMENT_TOUCHPOINTS } from '@/constants/agreements';
import { VERIFIED_MENTOR_PROOF_TYPE } from '@/constants/verifiedMentorApplication';
import { useSubmitVerifiedMentorApplicationMutation } from '@/store/rtkQueries/verifiedMentorApplicationApis';
import { rtkQuerieSetup } from '@/store/services/rtkQuerieSetup';

const DOCUMENT_ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx';

export default function ApplyVerifiedMentorModal() {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state: RootState) => state.allModal);
    const onClose = () => dispatch(closeModal());
    const requiredAcceptedRef = useRef(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [submitVerifiedMentorApplication, { isLoading }] = useSubmitVerifiedMentorApplicationMutation();

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, resetForm } =
        useFormik({
            initialValues: {
                applicationStatement: '',
                proofType: VERIFIED_MENTOR_PROOF_TYPE.PORTFOLIO as 'portfolio' | 'document',
                portfolioUrl: '',
                documents: [] as File[],
                accepted_agreement_ids: [] as string[],
            },
            validationSchema: verifiedMentorApplicationSchema,
            validate: () => {
                return requiredAcceptedRef.current ? {} : { accepted_agreement_ids: 'Please accept all required agreements before submitting.' };
            },
            onSubmit: async (formValues) => {
                try {
                    const statement = formValues.applicationStatement.trim();
                    const ids = formValues.accepted_agreement_ids;
                    let res;
                    if (formValues.proofType === VERIFIED_MENTOR_PROOF_TYPE.DOCUMENT) {
                        const body = new FormData();
                        body.append('type', VERIFIED_MENTOR_PROOF_TYPE.DOCUMENT);
                        body.append('application_statement', statement);
                        body.append('accepted_agreement_ids', JSON.stringify(ids));
                        formValues.documents.forEach((file) => body.append('documents', file));
                        res = await submitVerifiedMentorApplication(body).unwrap();
                    } else {
                        res = await submitVerifiedMentorApplication({
                            type: VERIFIED_MENTOR_PROOF_TYPE.PORTFOLIO,
                            portfolio_url: formValues.portfolioUrl.trim(),
                            application_statement: statement,
                            accepted_agreement_ids: ids,
                        }).unwrap();
                    }
                    toast.success(res?.message ?? 'Verification application submitted. teamtaaluma@taaluma.world will review within a few business days.');
                    resetForm();
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    onClose();
                } catch (error) {
                    const message = getApiErrorMessage(error);
                    if (/agreement updated/i.test(message)) {
                        dispatch(rtkQuerieSetup.util.invalidateTags(['UserAgreementSentences']));
                    }
                    if (!message) toast.error('Failed to submit verification application. Please try again.');
                }
            },
        });

    const wordCount = values.applicationStatement.trim() ? values.applicationStatement.trim().split(/\s+/).length : 0;
    const agreementsError = typeof errors.accepted_agreement_ids === 'string' ? errors.accepted_agreement_ids : undefined;
    const busy = isLoading || isSubmitting;
    const isPortfolio = values.proofType === VERIFIED_MENTOR_PROOF_TYPE.PORTFOLIO;

    const handleClose = () => {
        resetForm();
        if (fileInputRef.current) fileInputRef.current.value = '';
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
                                <Label className="text-sm font-semibold text-slate-800">
                                    Proof type <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex flex-wrap gap-4">
                                    <label className="inline-flex items-center text-sm font-normal text-slate-700">
                                        <input
                                            type="radio"
                                            name="proofType"
                                            value={VERIFIED_MENTOR_PROOF_TYPE.PORTFOLIO}
                                            checked={isPortfolio}
                                            onChange={handleChange}
                                            disabled={busy}
                                            className="mr-2 h-4 w-4 accent-primary"
                                        />
                                        Portfolio URL
                                    </label>
                                    <label className="inline-flex items-center text-sm font-normal text-slate-700">
                                        <input
                                            type="radio"
                                            name="proofType"
                                            value={VERIFIED_MENTOR_PROOF_TYPE.DOCUMENT}
                                            checked={!isPortfolio}
                                            onChange={handleChange}
                                            disabled={busy}
                                            className="mr-2 h-4 w-4 accent-primary"
                                        />
                                        Documents
                                    </label>
                                </div>
                            </div>

                            {isPortfolio ? (
                                <div className="space-y-1.5">
                                    <Label htmlFor="portfolioUrl" className="text-sm font-semibold text-slate-800">
                                        Portfolio URL <span className="text-red-500">*</span>
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
                            ) : (
                                <div className="space-y-1.5">
                                    <Label htmlFor="documents" className="text-sm font-semibold text-slate-800">
                                        Documents <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        ref={fileInputRef}
                                        id="documents"
                                        name="documents"
                                        type="file"
                                        multiple
                                        accept={DOCUMENT_ACCEPT}
                                        onChange={(e) => {
                                            setFieldValue('documents', Array.from(e.target.files ?? []).slice(0, 10));
                                            setFieldTouched('documents', true);
                                        }}
                                        onBlur={handleBlur}
                                        className={touched.documents && errors.documents ? fieldInvalidClassName : ''}
                                        disabled={busy}
                                    />
                                    <p className="text-xs text-slate-400">PDF, JPG, PNG, WEBP, DOC, DOCX. Max 10 files.</p>
                                    {values.documents.length ? (
                                        <ul className="space-y-1">
                                            {values.documents.map((file, index) => (
                                                <li key={`${file.name}-${index}`} className="flex items-center gap-2 text-sm text-slate-700">
                                                    <span className="min-w-0 truncate">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        className="shrink-0 text-slate-400 hover:text-red-600"
                                                        title="Remove file"
                                                        disabled={busy}
                                                        onClick={() => {
                                                            const next = values.documents.filter((_, i) => i !== index);
                                                            setFieldValue('documents', next);
                                                            if (!next.length && fileInputRef.current) fileInputRef.current.value = '';
                                                        }}
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                    {touched.documents && errors.documents ? (
                                        <p className="text-sm text-red-600">{String(errors.documents)}</p>
                                    ) : null}
                                </div>
                            )}
                        </div>

                        <AgreementSentenceList
                            touchpoint={AGREEMENT_TOUCHPOINTS.VERIFIED_MENTOR_APPLICATION}
                            onAcceptedAgreementIdsChange={(ids) => setFieldValue('accepted_agreement_ids', ids)}
                            onRequiredAcceptedChange={(accepted) => { requiredAcceptedRef.current = accepted; }}
                            error={agreementsError}
                            touched={touched.accepted_agreement_ids as boolean | undefined}
                            disabled={busy}
                            onBlur={() => setFieldTouched('accepted_agreement_ids', true)}
                            className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-left"
                        />
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
