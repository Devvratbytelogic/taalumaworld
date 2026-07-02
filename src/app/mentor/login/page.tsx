import { Suspense } from 'react';
import { SignInForm } from '@/components/auth/SignInForm';

export default function MentorLoginPage() {
    return (
        <Suspense>
            <SignInForm variant="mentor" />
        </Suspense>
    );
}
