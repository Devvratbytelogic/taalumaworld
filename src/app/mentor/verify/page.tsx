import { Suspense } from 'react';
import { OtpVerificationForm } from '@/components/auth/OtpVerificationForm';

export default function MentorVerifyPage() {
    return (
        <Suspense>
            <OtpVerificationForm />
        </Suspense>
    );
}
