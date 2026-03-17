import React from 'react'
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { getAdminRoutePath } from '@/routes/routes';
import { EditChapterForm } from '@/components/admin/chapter/EditChapterForm';

type Props = { params: Promise<{ id: string }> };

export default async function EditChapterPage({ params }: Props) {
    const { id } = await params;
    return (
        <>
            <div className="min-h-screen bg-background">
                <section className="border-b border-border bg-card">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex flex-col gap-4">
                            <Link
                                href={getAdminRoutePath()}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                            >
                                ← Back to Admin
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-primary/10 p-3">
                                    <FileText className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                        Edit Chapter
                                    </h1>
                                    <p className="text-muted-foreground mt-0.5">
                                        Edit a chapter with rich content and optional PDF attachment
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="container mx-auto max-w-4xl px-4 py-8">
                    <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border">
                        <EditChapterForm chapterId={id} />
                    </div>
                </section>
            </div>
        </>
    )
}
