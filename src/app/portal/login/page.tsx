import { Suspense } from 'react';
import { SignInForm } from '@/components/auth/SignInForm';

export default function AdminPortalLoginPage() {
    return (
        <Suspense>
            <SignInForm variant="admin" />
        </Suspense>
    );
}
