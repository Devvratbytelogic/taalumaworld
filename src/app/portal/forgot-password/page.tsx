import { Suspense } from 'react';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function AdminPortalForgotPasswordPage() {
    return (
        <Suspense>
            <ForgotPasswordForm variant="admin" />
        </Suspense>
    );
}
