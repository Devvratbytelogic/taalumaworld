'use client';

import { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import { MessageSquare, Eye, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import {
    useGetRegistrationPromptSettingsQuery,
    useUpdateRegistrationPromptMutation,
} from '@/store/rtkQueries/institutionApi';
import type { IRegistrationPromptSettings } from '@/types/institution';
import toast from '@/utils/toast';

const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

const DEFAULT_SETTINGS: IRegistrationPromptSettings = {
    is_enabled: true,
    heading: 'Are you a student from a partner university?',
    message:
        'Register using your university email address to access selected Taaluma.World content free of charge for a promotional period.\n\nIf your institution is not currently listed and you would like Taaluma.World to partner with your university, please contact us.',
    contact_email: 'teamtaaluma@taaluma.world',
};

export function RegistrationPromptTab() {
    const [preview, setPreview] = useState(false);
    const [values, setValues] = useState<IRegistrationPromptSettings>(DEFAULT_SETTINGS);
    const [isDirty, setIsDirty] = useState(false);

    const { data, isLoading } = useGetRegistrationPromptSettingsQuery();
    const [updatePrompt, { isLoading: isSaving }] = useUpdateRegistrationPromptMutation();

    useEffect(() => {
        if (data?.data) {
            setValues(data.data);
        }
    }, [data]);

    const set = <K extends keyof IRegistrationPromptSettings>(
        key: K,
        val: IRegistrationPromptSettings[K]
    ) => {
        setValues((prev) => ({ ...prev, [key]: val }));
        setIsDirty(true);
    };

    const handleSave = async () => {
        try {
            await updatePrompt(values).unwrap();
            toast.success('Registration prompt settings saved');
            setIsDirty(false);
        } catch { /* handled by RTK */ }
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                <strong>Registration Prompt:</strong> This message is displayed prominently during
                user registration to inform students from partner universities about their free
                promotional access. Administrators can customise the heading, message, and contact
                email at any time.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Editor */}
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            Edit Prompt Content
                        </h3>
                        <button
                            onClick={() => set('is_enabled', !values.is_enabled)}
                            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                                values.is_enabled ? 'text-green-600' : 'text-gray-400'
                            }`}
                        >
                            {values.is_enabled ? (
                                <ToggleRight className="h-5 w-5" />
                            ) : (
                                <ToggleLeft className="h-5 w-5" />
                            )}
                            {values.is_enabled ? 'Prompt Enabled' : 'Prompt Disabled'}
                        </button>
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
                                    value={values.heading}
                                    onChange={(e) => set('heading', e.target.value)}
                                    placeholder="Are you a student from a partner university?"
                                />
                            </div>
                            <div>
                                <label className={labelCls}>Message Body</label>
                                <textarea
                                    className={`${inputCls} resize-none`}
                                    rows={6}
                                    value={values.message}
                                    onChange={(e) => set('message', e.target.value)}
                                    placeholder="Enter the message for students..."
                                />
                                <p className="mt-1 text-xs text-gray-400">
                                    Use newlines to separate paragraphs.
                                </p>
                            </div>
                            <div>
                                <label className={labelCls}>Contact Email for Unlisted Institutions</label>
                                <input
                                    className={inputCls}
                                    type="email"
                                    value={values.contact_email}
                                    onChange={(e) => set('contact_email', e.target.value)}
                                    placeholder="teamtaaluma@taaluma.world"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex gap-3 justify-end pt-2">
                        <Button
                            variant="bordered"
                            onPress={() => setPreview((p) => !p)}
                            startContent={<Eye className="h-4 w-4" />}
                        >
                            {preview ? 'Hide Preview' : 'Preview'}
                        </Button>
                        <Button
                            color="primary"
                            isLoading={isSaving}
                            isDisabled={!isDirty || isSaving}
                            onPress={handleSave}
                            startContent={<Save className="h-4 w-4" />}
                        >
                            Save Settings
                        </Button>
                    </div>
                </div>

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
                                Click "Preview" to see how this will appear during registration.
                            </p>
                        </div>
                    ) : (
                        <div
                            className={`border-2 rounded-2xl p-5 space-y-3 transition-all ${
                                values.is_enabled
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
    );
}
