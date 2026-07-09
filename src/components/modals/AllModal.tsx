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
import LoginRequiredModal from '../auth/LoginRequiredModal';
import FilterModal from './FilterModal';
import { ChapterPurchaseModal } from '../pages-components/chapter/ChapterPurchaseModal';
import ConfirmRemoveCartModal from './ConfirmRemoveCartModal';
import { AddEditInstitutionModal } from '../admin/institutions/AddEditInstitutionModal';
import { ExtendPromotionModal } from '../admin/institutions/ExtendPromotionModal';
import { AddEditRoleModal } from '../admin/roles-and-permissions/AddEditRoleModal';
import { AssignStaffRoleModal } from '../admin/roles-and-permissions/AssignStaffRoleModal';
import { AddStaffModal } from '../admin/roles-and-permissions/AddStaffModal';
import BookDetailsModal from './common-card-details/BookDetailsModal';
import ChapterDetailsModal from './common-card-details/ChapterDetailsModal';
import DeleteConfirmation from '../admin/DeleteConfirmation';

export default function AllModal() {
    const dispatch = useDispatch();
    const { isOpen, componentName } = useSelector((state: RootState) => state.allModal);
    const pathName = usePathname()

    useEffect(() => {
        dispatch(closeModal())
    }, [pathName, dispatch])

    const renderComponent = () => {
        switch (componentName) {
            case "SignIn":
            case "AuthorSignIn":
                return <SignIn />;
            case "SignUp":
            case "AuthorRegister":
                return <SignUp />;
            case "ForgotPassword":
                return <ForgotPassword />;
            case "ResetPassword":
                return <ResetPassword />;
            case "OtpVerification":
                return <OtpVerification />;
            case "LoginRequiredModal":
                return <LoginRequiredModal />;
            case "FilterModal":
                return <FilterModal />;
            case "ChapterPurchaseModal":
                return <ChapterPurchaseModal />;
            case "ConfirmRemoveCartModal":
                return <ConfirmRemoveCartModal />;
            case "AddEditInstitutionModal":
                return <AddEditInstitutionModal />;
            case "ExtendPromotionModal":
                return <ExtendPromotionModal />;
            case "AddEditRoleModal":
                return <AddEditRoleModal />;
            case "AssignStaffRoleModal":
                return <AssignStaffRoleModal />;
            case "AddStaffModal":
                return <AddStaffModal />;
            case "BookDetailsModal":
                return <BookDetailsModal />;
            case "ChapterDetailsModal":
                return <ChapterDetailsModal />;
            case "DeleteConfirmation":
                return <DeleteConfirmation />;
            default:
                return null;
        }
    }
    return <>{isOpen && renderComponent()}</>;

}
