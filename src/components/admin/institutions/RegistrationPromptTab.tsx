'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import { Button } from '@heroui/react';
import { MessageSquare, Eye, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { useGetInstituteMessagesQuery, useAddInstituteMessageMutation, } from '@/store/rtkQueries/institutionApi';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import toast from '@/utils/toast';
import { registrationPromptSchema } from '@/utils/formValidation';

const REGISTRATION_PROMPT_MODEL = 'Institute Registration Prompt';

const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';


export function RegistrationPromptTab() {
    const [preview, setPreview] = useState(false);
    const { hasPermission } = useAdminPermissions();

    const canView = hasPermission(REGISTRATION_PROMPT_MODEL, 'view');
    const canEdit = hasPermission(REGISTRATION_PROMPT_MODEL, 'edit');

    const { data, isLoading } = useGetInstituteMessagesQuery();
    const [addInstituteMessage, { isLoading: isAdding }] = useAddInstituteMessageMutation();
    // const [updateInstituteMessage, { isLoading: isUpdating }] = useUpdateInstituteMessageMutation();

    const existingMessage = data?.data ?? null;

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } =
        useFormik({
            enableReinitialize: true,
            initialValues: {
                heading: existingMessage?.heading ?? '',
                message: existingMessage?.message ?? '',
                contact_email: existingMessage?.contact_email ?? '',
                is_enabled: existingMessage ? existingMessage.status !== 'Inactive' : true,
            },
            validationSchema: registrationPromptSchema,
            onSubmit: async (formValues) => {
                const payload = {
                    heading: formValues.heading,
                    message: formValues.message,
                    contact_email: formValues.contact_email,
                    status: formValues.is_enabled ? 'Active' : 'Inactive',
                };
                try {
                    const response = await addInstituteMessage(payload).unwrap();
                    if (response.http_status_code === 200 || response.http_status_code === 201) {
                        toast.success('Registration prompt settings saved');
                    }
                } catch (error) {
                    console.error('Failed to save registration prompt settings', error);
                }
            },
        });


    return (
       <>
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Editor */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                Edit Prompt Content
                            </h3>
                            {canEdit ? (
                                <button
                                    type="button"
                                    onClick={() => setFieldValue('is_enabled', !values.is_enabled)}
                                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${values.is_enabled ? 'text-green-600' : 'text-gray-400'
                                        }`}
                                >
                                    {values.is_enabled ? (
                                        <ToggleRight className="h-5 w-5" />
                                    ) : (
                                        <ToggleLeft className="h-5 w-5" />
                                    )}
                                    {values.is_enabled ? 'Prompt Enabled' : 'Prompt Disabled'}
                                </button>
                            ) : (
                                <span
                                    className={`flex items-center gap-1.5 text-sm font-medium ${values.is_enabled ? 'text-green-600' : 'text-gray-400'
                                        }`}
                                >
                                    {values.is_enabled ? (
                                        <ToggleRight className="h-5 w-5" />
                                    ) : (
                                        <ToggleLeft className="h-5 w-5" />
                                    )}
                                    {values.is_enabled ? 'Prompt Enabled' : 'Prompt Disabled'}
                                </span>
                            )}
                        </div>
    
                        {isLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className={labelCls}>Heading</label>
                                    <input
                                        className={inputCls}
                                        name="heading"
                                        value={values.heading}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={!canEdit}
                                        placeholder="Are you a student from a partner university?"
                                    />
                                    {touched.heading && errors.heading ? (
                                        <p className="mt-1 text-xs text-red-600">{errors.heading}</p>
                                    ) : null}
                                </div>
                                <div>
                                    <label className={labelCls}>Message Body</label>
                                    <textarea
                                        className={`${inputCls} resize-none`}
                                        rows={6}
                                        name="message"
                                        value={values.message}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={!canEdit}
                                        placeholder="Enter the message for students..."
                                    />
                                    {touched.message && errors.message ? (
                                        <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                                    ) : (
                                        <p className="mt-1 text-xs text-gray-400">
                                            Use newlines to separate paragraphs.
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className={labelCls}>Contact Email for Unlisted Institutions</label>
                                    <input
                                        className={inputCls}
                                        type="email"
                                        name="contact_email"
                                        value={values.contact_email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={!canEdit}
                                        placeholder="teamtaaluma@taaluma.world"
                                    />
                                    {touched.contact_email && errors.contact_email ? (
                                        <p className="mt-1 text-xs text-red-600">{errors.contact_email}</p>
                                    ) : null}
                                </div>
                            </>
                        )}
    
                        <div className="flex gap-3 justify-end pt-2">
                            {canView ? (
                                <Button
                                    type="button"
                                    className="global_btn outline_primary rounded_full"
                                    onPress={() => setPreview((p) => !p)}
                                >
                                    <Eye className="h-4 w-4" />
                                    {preview ? 'Hide Preview' : 'Preview'}
                                </Button>
                            ) : null}
                            {canEdit ? (
                                <Button
                                    type="submit"
                                    className="global_btn bg_primary rounded_full"
                                    isLoading={isAdding}
                                    isDisabled={isAdding}
                                >
                                    <Save className="h-4 w-4" />
                                    Save Settings
                                </Button>
                            ) : null}
                        </div>
                    </form>
    
                    {/* Preview */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Eye className="h-5 w-5 text-primary" />
                            Live Preview
                        </h3>
                        {!preview ? (
                            <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                                <Eye className="h-10 w-10 text-gray-200" />
                                <p className="text-sm text-muted-foreground">
                                    Click &quot;Preview&quot; to see how this will appear during registration.
                                </p>
                            </div>
                        ) : (
                            <div
                                className={`border-2 rounded-2xl p-5 space-y-3 transition-all ${values.is_enabled
                                    ? 'border-primary/30 bg-primary/5'
                                    : 'border-gray-200 bg-gray-50 opacity-50'
                                    }`}
                            >
                                {!values.is_enabled && (
                                    <p className="text-xs text-red-500 font-medium text-center">
                                        ⚠ Prompt is currently disabled — users will not see this
                                    </p>
                                )}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-primary text-sm font-bold">🎓</span>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <p className="font-semibold text-sm text-gray-900">
                                            {values.heading || 'Are you a student from a partner university?'}
                                        </p>
                                        {values.message.split('\n').map((line, i) =>
                                            line.trim() ? (
                                                <p key={i} className="text-xs text-gray-600">
                                                    {line}
                                                </p>
                                            ) : (
                                                <br key={i} />
                                            )
                                        )}
                                        {values.contact_email && (
                                            <a
                                                href={`mailto:${values.contact_email}`}
                                                className="text-xs text-primary font-medium hover:underline block"
                                            >
                                                {values.contact_email}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
    
                        {/* Current live state */}
                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                Current Settings
                            </p>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className={`font-medium ${values.is_enabled ? 'text-green-600' : 'text-red-500'}`}>
                                        {values.is_enabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Contact Email</span>
                                    <span className="font-medium text-gray-700">{values.contact_email || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Heading length</span>
                                    <span className="font-medium text-gray-700">{values.heading.length} chars</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
       </>
    );
}
