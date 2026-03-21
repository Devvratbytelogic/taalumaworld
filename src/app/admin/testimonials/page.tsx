'use client';
import { useState, useRef, useEffect } from 'react';
import { Star, Plus, Pencil, Trash2, Search, Upload, UserCircle } from 'lucide-react';
import { Button, Chip } from '@heroui/react';
import { useGetAllTestimonialsQuery } from '@/store/rtkQueries/adminGetApi';
import {
    useAddTestimonialMutation,
    useUpdateTestimonialMutation,
    useDeleteTestimonialMutation,
} from '@/store/rtkQueries/adminPostApi';
import type { ITestimonialsDataEntity } from '@/types/testimonial';

// ── Types ────────────────────────────────────────────────────────────────────

interface FormValues {
    name: string;
    title: string;
    message: string;
    rating: number;
    status: string;
    photo: File | null;
}

// ── Testimonial Form ─────────────────────────────────────────────────────────

interface TestimonialFormProps {
    initial?: Partial<ITestimonialsDataEntity>;
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

function TestimonialForm({ initial = {}, onSubmit, onCancel, isLoading }: TestimonialFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [values, setValues] = useState<FormValues>({
        name: initial.name ?? '',
        title: initial.title ?? '',
        message: initial.message ?? '',
        rating: initial.rating ?? 5,
        status: initial.status ?? 'active',
        photo: null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(initial.photo ?? null);

    useEffect(() => {
        if (values.photo instanceof File) {
            const url = URL.createObjectURL(values.photo);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [values.photo]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setValues(prev => ({ ...prev, photo: file }));
        }
    };

    const handleSubmit = async () => {
        const fd = new FormData();
        fd.append('name', values.name);
        fd.append('title', values.title);
        fd.append('message', values.message);
        fd.append('rating', String(values.rating));
        fd.append('status', values.status);
        if (values.photo) {
            fd.append('photo', values.photo);
        }
        await onSubmit(fd);
    };

    const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">

            {/* Photo upload */}
            <div className="flex items-center gap-5">
                <div className="shrink-0 w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Photo preview" className="w-full h-full object-cover" onError={() => setPreviewUrl(null)} />
                    ) : (
                        <UserCircle className="h-10 w-10 text-gray-300" />
                    )}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">Photo <span className="text-gray-400 font-normal">(optional)</span></p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button
                        type="button"
                        variant="bordered"
                        size="sm"
                        startContent={<Upload className="h-4 w-4" />}
                        onPress={() => fileInputRef.current?.click()}
                    >
                        {values.photo ? values.photo.name : 'Choose image'}
                    </Button>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 5 MB</p>
                </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                    <input
                        className={inputCls}
                        value={values.name}
                        onChange={e => setValues(p => ({ ...p, name: e.target.value }))}
                        placeholder="Reviewer name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                    <input
                        className={inputCls}
                        value={values.title}
                        onChange={e => setValues(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. CEO at Acme"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1–5)</label>
                    <input
                        type="number"
                        min={1}
                        max={5}
                        className={inputCls}
                        value={values.rating}
                        onChange={e => setValues(p => ({ ...p, rating: Math.min(5, Math.max(1, Number(e.target.value))) }))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        className={inputCls}
                        value={values.status}
                        onChange={e => setValues(p => ({ ...p, status: e.target.value }))}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                <textarea
                    rows={4}
                    className={`${inputCls} resize-none`}
                    value={values.message}
                    onChange={e => setValues(p => ({ ...p, message: e.target.value }))}
                    placeholder="Testimonial message…"
                />
            </div>

            <div className="flex gap-3 justify-end">
                <Button variant="bordered" onPress={onCancel} size="sm" isDisabled={isLoading}>Cancel</Button>
                <Button color="primary" isLoading={isLoading} onPress={handleSubmit} size="sm">
                    Save
                </Button>
            </div>
        </div>
    );
}

// ── Star Rating Display ───────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
            ))}
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function AdminTestimonialsPage() {
    const { data, isLoading, isFetching } = useGetAllTestimonialsQuery();
    const [addTestimonial, { isLoading: isAdding }] = useAddTestimonialMutation();
    const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation();
    const [deleteTestimonial] = useDeleteTestimonialMutation();

    const [search, setSearch] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const testimonials = data?.data ?? [];

    const filtered = testimonials.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.message.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = async (formData: FormData) => {
        await addTestimonial(formData).unwrap();
        setShowAddForm(false);
    };

    const handleUpdate = async (id: string, formData: FormData) => {
        await updateTestimonial({ id, values: formData }).unwrap();
        setEditingId(null);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this testimonial?')) {
            await deleteTestimonial({ id }).unwrap();
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''} total
                    </p>
                </div>
                <Button
                    color="primary"
                    startContent={<Plus className="h-4 w-4" />}
                    onPress={() => { setShowAddForm(true); setEditingId(null); }}
                    size="sm"
                >
                    Add Testimonial
                </Button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <TestimonialForm
                    isLoading={isAdding}
                    onSubmit={handleAdd}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Search testimonials…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* List */}
            {isLoading || isFetching ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                            <div className="flex gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                                <div className="flex-1 space-y-2 pt-1">
                                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                                </div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-4/5" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <Star className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No testimonials found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map(t => (
                        <div key={t._id} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                            {editingId === t._id ? (
                                <TestimonialForm
                                    initial={t}
                                    isLoading={isUpdating}
                                    onSubmit={fd => handleUpdate(t._id, fd)}
                                    onCancel={() => setEditingId(null)}
                                />
                            ) : (
                                <>
                                    <div className="flex items-start justify-between gap-3">
                                        {/* Avatar */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
                                                {t.photo ? (
                                                    <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserCircle className="h-7 w-7 text-gray-300" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm leading-tight">{t.name}</p>
                                                <p className="text-xs text-gray-500">{t.title}</p>
                                            </div>
                                        </div>
                                        <Chip
                                            size="sm"
                                            color={t.status === 'active' ? 'success' : 'default'}
                                            variant="flat"
                                            className="shrink-0"
                                        >
                                            {t.status}
                                        </Chip>
                                    </div>

                                    <StarRating rating={t.rating} />
                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{t.message}</p>

                                    <div className="flex gap-2 justify-end pt-1">
                                        <Button
                                            size="sm"
                                            variant="light"
                                            startContent={<Pencil className="h-3.5 w-3.5" />}
                                            onPress={() => { setEditingId(t._id); setShowAddForm(false); }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="light"
                                            color="danger"
                                            startContent={<Trash2 className="h-3.5 w-3.5" />}
                                            onPress={() => handleDelete(t._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
