import { Suspense } from 'react';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function MentorSignupPage() {
    return (
        <Suspense>
            <SignUpForm />
        </Suspense>
    );
}
