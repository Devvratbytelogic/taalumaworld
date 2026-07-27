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
import ConfirmRemoveCartModal from './ConfirmRemoveCartModal';
import { AddEditInstitutionModal } from '../admin/institutions/AddEditInstitutionModal';
import { AddEditRoleModal } from '../admin/roles-and-permissions/AddEditRoleModal';
import BookDetailsModal from './common-card-details/BookDetailsModal';
import ChapterDetailsModal from './common-card-details/ChapterDetailsModal';
import DeleteConfirmation from '../admin/DeleteConfirmation';
import RestoreConfirmation from '../admin/RestoreConfirmation';
import { AddEditStaffModal } from '../admin/roles-and-permissions/AddEditStaffModal';
import { UpdateStaffStatusModal } from '../admin/roles-and-permissions/UpdateStaffStatusModal';
import ChapterPurchaseModal from '../pages-components/chapter/ChapterPurchaseModal';
import ApplyVerifiedMentorModal from '../admin/mentor/dashboard/ApplyVerifiedMentorModal';
import { AddEditAddressModal } from '../pages-components/user-dashboard/AddEditAddressModal';
import { AddReviewModal } from '../pages-components/user-dashboard/AddReviewModal';
import { ReviewStatusModal } from '../admin/reviews/ReviewStatusModal';

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
            case "AddEditRoleModal":
                return <AddEditRoleModal />;
            case "AddEditStaffModal":
                return <AddEditStaffModal />;
            case "UpdateStaffStatusModal":
                return <UpdateStaffStatusModal />;
            case "BookDetailsModal":
                return <BookDetailsModal />;
            case "ChapterDetailsModal":
                return <ChapterDetailsModal />;
            case "DeleteConfirmation":
                return <DeleteConfirmation />;
            case "RestoreConfirmation":
                return <RestoreConfirmation />;
            case "ApplyVerifiedMentorModal":
                return <ApplyVerifiedMentorModal />;
            case "AddEditAddressModal":
                return <AddEditAddressModal />;
            case "AddReviewModal":
                return <AddReviewModal />;
            case "ReviewStatusModal":
                return <ReviewStatusModal />;
            default:
                return null;
        }
    }
    return <>{isOpen && renderComponent()}</>;

}
