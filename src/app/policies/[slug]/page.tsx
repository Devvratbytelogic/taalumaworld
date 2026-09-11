import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FileText } from 'lucide-react';
import MarkdownContent from '@/components/ui/MarkdownContent';
import { getAgreementBySlugServerAPI } from '@/store/server-api/serverSideAPIs';
import moment from 'moment';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const response = await getAgreementBySlugServerAPI({ slug });
  const agreement = response?.data;

  if (!agreement) {
    return {
      title: 'Policy Not Found | TaalumaWorld',
      description: '',
    };
  }

  return {
    title: `${agreement.title} | TaalumaWorld`,
    description: agreement.text || agreement.title,
  };
}

export default async function PolicyPage({ params }: PageProps) {
  const { slug } = await params;
  const response = await getAgreementBySlugServerAPI({ slug });
  const agreement = response?.data;
  console.log('response', response);

  if (!agreement || agreement.status !== 'active') {
    notFound();
  }

  const versionLabel = agreement.version ? `Version ${agreement.version}` : null;
  const lastUpdated = agreement.updatedAt
    ? `Last updated: ${moment(agreement.updatedAt).format('MMMM D, YYYY')}`
    : null;
  const meta = [versionLabel, lastUpdated].filter(Boolean).join(' · ');

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-accent/30 pt-10 md:py-10">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-6 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {agreement.agreementType?.name || 'Legal'}
              </span>
            </div>
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              {agreement.title}
            </h1>
            {(agreement.text || meta) && (
              <p className="text-lg leading-relaxed text-muted-foreground">
                {agreement.text}
                {agreement.text && meta ? ' · ' : ''}
                {meta}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="container py-12">
        <MarkdownContent
          content={agreement.content}
          emptyMessage="No policy content available."
          className="prose-headings:font-semibold prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-a:text-primary"
        />
      </section>
    </div>
  );
}
