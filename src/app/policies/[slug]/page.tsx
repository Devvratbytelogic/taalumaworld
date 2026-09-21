'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPolicyBySlugRoutePath } from '@/routes/routes';

export default function PolicySlugRedirectPage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    if (!slug) return;
    window.location.replace(getPolicyBySlugRoutePath(slug));
  }, [slug]);

  return null;
}
