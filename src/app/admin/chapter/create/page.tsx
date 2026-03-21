import { CreateChapterForm } from '@/components/admin/chapter/CreateChapterForm';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { getAdminSectionRoutePath } from '@/routes/routes';

export default function CreateChapterPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3">
                <Link
                    href={getAdminSectionRoutePath('chapters')}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                    ← Back to Chapters
                </Link>
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-3">
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                            Create New Chapter
                        </h1>
                        <p className="text-muted-foreground mt-0.5">
                            Add a new chapter with rich content and optional PDF attachment
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border">
                <CreateChapterForm />
            </div>
        </div>
    );
}
