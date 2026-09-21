import type { Metadata } from 'next';
import { FileText } from 'lucide-react';
import PoliciesDocument from '@/components/pages-components/policies/PoliciesDocument';
import { getLatestAgreementsServerAPI } from '@/store/server-api/serverSideAPIs';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Policies | TaalumaWorld',
  description: 'Read the latest TaalumaWorld policies, terms, and legal agreements.',
};

export default async function PoliciesPage() {
  const response = await getLatestAgreementsServerAPI();
  const agreements = response?.data?.agreements ?? [];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-accent/30 pt-10 md:py-10">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-6 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Legal</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Policies
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              The latest versions of TaalumaWorld&apos;s policies and legal agreements.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <PoliciesDocument agreements={agreements} />
      </section>
    </div>
  );
}
