'use client';

import { usePathname } from 'next/navigation';

type GlobalSchemaMarkupProps = {
  markup?: string | null;
};

function isBlueprintPath(pathname: string) {
  return pathname === '/blueprint' || pathname.startsWith('/blueprint/');
}

/** Global Settings JSON-LD. Omitted on blueprint pages so only that page's own schema is in the HTML. */
export function GlobalSchemaMarkup({ markup }: GlobalSchemaMarkupProps) {
  const pathname = usePathname() ?? '';

  if (!markup || isBlueprintPath(pathname)) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
