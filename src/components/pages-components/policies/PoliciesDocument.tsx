import MarkdownContent from '@/components/ui/MarkdownContent';
import { PoliciesNav } from '@/components/pages-components/policies/PoliciesNav';
import type { ILatestAgreement } from '@/types/user/agreement';
import { FileText } from 'lucide-react';

const proseClassName =
  'prose-headings:font-semibold prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-a:text-primary';

export default function PoliciesDocument({ agreements }: { agreements: ILatestAgreement[] }) {
  if (agreements.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <FileText className="mx-auto h-10 w-10 text-muted-foreground/40" aria-hidden />
        <p className="mt-4 text-base font-medium text-foreground">No policies published yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Check back soon for the latest legal documents.</p>
      </div>
    );
  }

  return (
    <div className="md:grid md:grid-cols-[200px_minmax(0,1fr)] md:items-start md:gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
      <PoliciesNav items={agreements.map((agreement) => ({ slug: agreement.slug, title: agreement.title }))} />

      <div className="min-w-0 divide-y divide-border">
        {agreements.map((agreement) => (
          <section key={agreement._id} id={agreement.slug} className="scroll-mt-28 py-10 first:pt-0 last:pb-0">
            <h2 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">{agreement.title}</h2>
            {agreement.version ? (
              <p className="mt-2 text-sm text-muted-foreground">Version {agreement.version}</p>
            ) : null}
            <div className="mt-6">
              <MarkdownContent
                content={agreement.content}
                emptyMessage="No policy content available."
                className={proseClassName}
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
