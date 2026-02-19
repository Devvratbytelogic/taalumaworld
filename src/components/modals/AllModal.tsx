import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import SignIn from '../auth/signin/SignIn';
import SignUp from '../auth/signup/SignUp';
import ForgotPassword from '../auth/forgot/ForgotPassword';
import ResetPassword from '../auth/forgot/ResetPassword';
import OtpVerification from '../auth/otp/OtpVerification';
import FilterModal from './FilterModal';
import CommonCardDetailsModal from './CommonCardDetailsModal';
import LoginRequiredModal from '../auth/LoginRequiredModal';
import { ChapterPurchaseModal } from '../pages-components/chapter/ChapterPurchaseModal';

export default function AllModal() {
    const dispatch = useDispatch();
    const { isOpen, componentName } = useSelector((state: RootState) => state.allModal);
    const pathName = usePathname()

    useEffect(() => {
        dispatch(closeModal())
    }, [pathName])

    const renderComponent = () => {
        switch (componentName) {
            case "SignIn":
                return <SignIn />;
            case "SignUp":
                return <SignUp />;
            case "ForgotPassword":
                return <ForgotPassword />;
            case "ResetPassword":
                return <ResetPassword />;
            case "OtpVerification":
                return <OtpVerification />;
            case "FilterModal":
                return <FilterModal />;
            case "CommonCardDetailsModal":
                return <CommonCardDetailsModal />;
            case "LoginRequiredModal":
                return <LoginRequiredModal />;
            case "ChapterPurchaseModal":
                return <ChapterPurchaseModal />;

            default:
                return null;
        }
    }
    return <>{isOpen && renderComponent()}</>;

}
