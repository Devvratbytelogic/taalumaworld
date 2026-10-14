'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getHomeRoutePath } from '@/routes/routes';

/** Old mentor reset links open the shared forgot-password modal. */
export default function MentorForgotPasswordPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace(`${getHomeRoutePath()}?auth=forgot`);
    }, [router]);

    return null;
}
