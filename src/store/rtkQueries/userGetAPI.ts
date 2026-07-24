import { ICartAPIResponse } from '@/types/user/cart';
import { IAllCouponsAPIResponse } from '@/types/user/coupon';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export type MpesaPaymentStatusResponse = {
    success?: boolean;
    data?: {
        status?: 'pending' | 'completed' | 'cancel' | 'failed';
    };
};
import { IAddressListAPIResponse, IAddressAPIResponse } from '@/types/user/address';
import { IHomeAllChaptersAPIResponse } from '@/types/user/HomeAllChapters';
import { ISingleChapterAPIResponse } from '@/types/user/singleChapter';
import { IUserProfileAPIResponse } from '@/types/user/user';
import { IMyChaptersAPIResponse } from '@/types/user/myChapters';
import { IMySeriesAPIResponse } from '@/types/user/mySeries';
import { IWishlistAPIResponse } from '@/types/user/wishlist';
import { IMyReadingHistoryAPIResponse } from '@/types/user/readingHistory';
import { IFAQAPIResponse, ITestimonialsAPIResponse } from '@/types/user/testimonial';
import { IGlobalSettingsAPIResponse } from '@/types/globalSettings';
import { ISingleBookAPIResponse } from '@/types/user/singleBook';
import { ISearchResultsAPIResponse } from '@/types/user/saech';
import { IUserAllCategoriesAPIResponse } from '@/types/user/allCategory';
import { IUserAllAuthorsAPIResponse } from '@/types/user/allAuthors';
import { IUserAllTagsAPIResponse } from '@/types/user/allTags';
import { IActiveReadersAPIResponse } from '@/types/activeReaders';
import { IAllAgreementsDataAPIResponse } from './allAgreements';
import { UserTypeValue } from '@/constants/common';
import { IInstituteMessageAPIResponse, IPartnerInstitutionsAPIResponse } from '@/types/institution';
import { IMyMentorApplicationAPIResponse } from '@/types/user/mentorApplication';

export interface IGetAllChaptersParams {
    categoryId?: string | null;
    thoughtLeaderId?: string | null;
    tags?: string | null;
    readingProgress?: string | null;
    page?: number;
    limit?: number;
}

export interface IGetMyChaptersParams {
    page?: number;
    limit?: number;
    inProgress?: boolean;
    completed?: boolean;
    unread?: boolean;
}

export interface IGetMySeriesParams {
    page?: number;
    limit?: number;
    inProgress?: boolean;
    completed?: boolean;
    unread?: boolean;
}

export interface IGetWishlistParams {
    page?: number;
    limit?: number;
    type?: 'Book' | 'Chapter';
}

export const clientSideGetApis = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** get global settings */
        getGlobalSettings: builder.query<IGlobalSettingsAPIResponse, void>({
            query: () => ({
                url: `/user/get-global`,
                method: 'GET',
            }),
            providesTags: ['GlobalSettings'],
        }),
        /** get active readers */
        getActiveReaders: builder.query<IActiveReadersAPIResponse, void>({
            query: () => ({
                url: `/user/active-readers`,
                method: 'GET',
            }),
        }),
        /** chapters */
        getAllChapters: builder.query<IHomeAllChaptersAPIResponse, IGetAllChaptersParams>({
            query: (params) => ({
                url: `/user/content`,
                method: 'GET',
                params,
            }),
            providesTags: ['AllChapters', 'Cart'],
        }),
        /** single chapter */
        getSingleChapter: builder.query<ISingleChapterAPIResponse, string>({
            query: (id) => ({
                url: `/user/content/chapter/${id}`,
                method: 'GET',
            }),
            providesTags: (_, __, id) => [{ type: 'SingleChapter', id }],
        }),
        /** single book */
        getSingleBook: builder.query<ISingleBookAPIResponse, string>({
            query: (id) => ({
                url: `/user/content/book/${id}`,
                method: 'GET',
            }),
            providesTags: (_, __, id) => [{ type: 'SingleChapter', id }],
        }),
        getUserAllCategories: builder.query<IUserAllCategoriesAPIResponse, void>({
            query: () => ({
                url: `/user/categories`,
                method: 'GET',
            }),
        }),
        /** get all authors */
        getUserAllAuthors: builder.query<IUserAllAuthorsAPIResponse, void>({
            query: () => ({
                url: `/user/mentor-list`,
                method: 'GET',
            }),
        }),
        /** get all tags */
        getAllTags: builder.query<IUserAllTagsAPIResponse, void>({
            query: () => ({
                url: `/user/tags`,
                method: 'GET',
            }),
        }),
        /** get cart */
        getCart: builder.query<ICartAPIResponse, void>({
            query: () => ({
                url: `/user/get-cart`,
                method: 'GET',
            }),
            providesTags: ['Cart'],
        }),
        /** get all coupons available to apply on the cart */
        getAllCoupons: builder.query<IAllCouponsAPIResponse, void>({
            query: () => ({
                url: `/user/coupons`,
                method: 'GET',
            }),
            providesTags: ['Cart'],
        }),
        /** get user profile */
        getUserProfile: builder.query<IUserProfileAPIResponse, void>({
            query: () => ({
                url: `/admin/get-profile`,
                method: 'GET',
            }),
            providesTags: ['UserProfile'],
        }),
        /** get my chapters */
        getMyChapters: builder.query<IMyChaptersAPIResponse, IGetMyChaptersParams | void>({
            query: (params) => ({
                url: `/user/my-blueprints`,
                method: 'GET',
                params: {
                    page: params?.page ?? 1,
                    limit: params?.limit ?? 10,
                    ...(params?.inProgress ? { inProgress: true } : {}),
                    ...(params?.completed ? { completed: true } : {}),
                    ...(params?.unread ? { unread: true } : {}),
                },
            }),
            providesTags: ['MyChapters'],
        }),
        /** get my series */
        getMySeries: builder.query<IMySeriesAPIResponse, IGetMySeriesParams | void>({
            query: (params) => ({
                url: `/user/my-series`,
                method: 'GET',
                params: {
                    page: params?.page ?? 1,
                    limit: params?.limit ?? 10,
                    ...(params?.inProgress ? { inProgress: true } : {}),
                    ...(params?.completed ? { completed: true } : {}),
                    ...(params?.unread ? { unread: true } : {}),
                },
            }),
            providesTags: ['MyChapters'],
        }),
        /** get wishlisted books & chapters */
        getWishlist: builder.query<IWishlistAPIResponse, IGetWishlistParams | void>({
            query: (params) => ({
                url: `/user/wishlist`,
                method: 'GET',
                params: {
                    page: params?.page ?? 1,
                    limit: params?.limit ?? 12,
                    ...(params?.type ? { type: params.type } : {}),
                },
            }),
            providesTags: ['Wishlist'],
        }),
        /** get reading history */
        getReadingHistory: builder.query<IMyReadingHistoryAPIResponse, void>({
            query: () => ({
                url: `/user/reading-history`,
                method: 'GET',
            }),
            providesTags: ['ReadingHistory'],
        }),
        /** get testimonials */
        getTestimonials: builder.query<ITestimonialsAPIResponse, void>({
            query: () => ({
                url: `/user/testimonial`,
                method: 'GET',
            }),
        }),
        /** get FAQs */
        getFAQ: builder.query<IFAQAPIResponse, { type?: string } | void>({
            query: (params) => ({
                url: `/user/faqs`,
                method: 'GET',
                params: params && (params as { type?: string }).type
                    ? { type: (params as { type?: string }).type }
                    : undefined,
            }),
        }),
        /** get search results */
        getSearchResults: builder.query<ISearchResultsAPIResponse, string>({
            query: (query) => ({
                url: `/user/content/search`,
                method: 'GET',
                params: { q: query },
            }),
        }),
        getTransactionInvoice: builder.query<Blob, { orderId: string }>({
            query: ({ orderId }) => ({
                url: `/user/invoice/${orderId}`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
            }),
        }),
        getMpesaPaymentStatus: builder.query<MpesaPaymentStatusResponse, string>({
            query: (checkoutRequestId) => ({
                url: `/user/payment-status/${checkoutRequestId}`,
                method: 'GET',
            }),
        }),










        // new flow endpoints
        getAllAgreementsData: builder.query<IAllAgreementsDataAPIResponse, { userType: UserTypeValue }>({
            query: ({ userType }) => ({
                url: `/user/agreements/active-list`,
                method: 'GET',
                params: userType ? { userType } : undefined,
            }),
        }),
        /** get partner institutions offering free access during their promo period */
        getPartnerInstitutions: builder.query<IPartnerInstitutionsAPIResponse, void>({
            query: () => ({
                url: `/user/institutions/partners`,
                method: 'GET',
            }),
        }),
        /** get the registration prompt message shown to prospective partner-university students */
        getInstituteMessage: builder.query<IInstituteMessageAPIResponse, void>({
            query: () => ({
                url: `/user/institute-message`,
                method: 'GET',
            }),
        }),
         
        /** mentor-applications */
        getMentorApplications: builder.query<IMyMentorApplicationAPIResponse, void>({
            query: () => ({
                url: `/user/mentor-applications/my`,
                method: 'GET',
            }),
        }),
        /** get all saved addresses */
        getUserAddresses: builder.query<IAddressListAPIResponse, void>({
            query: () => ({
                url: `/user/addresses`,
                method: 'GET',
            }),
            providesTags: ['Address'],
        }),
        /** get a single saved address */
        getUserAddressById: builder.query<IAddressAPIResponse, string>({
            query: (id) => ({
                url: `/user/addresses/${id}`,
                method: 'GET',
            }),
            providesTags: (_, __, id) => [{ type: 'Address', id }],
        }),
    }),
});

export const {
    useGetGlobalSettingsQuery,
    useGetActiveReadersQuery,
    useGetAllChaptersQuery,
    useGetSingleChapterQuery,
    useLazyGetSingleChapterQuery,
    useGetSingleBookQuery,
    useGetUserAllCategoriesQuery,
    useGetUserAllAuthorsQuery,
    useGetAllTagsQuery,
    useGetCartQuery,
    useGetAllCouponsQuery,
    useGetUserProfileQuery,
    useGetMyChaptersQuery,
    useGetMySeriesQuery,
    useGetWishlistQuery,
    useGetReadingHistoryQuery,
    useGetTestimonialsQuery,
    useGetFAQQuery,
    useGetSearchResultsQuery,
    useLazyGetTransactionInvoiceQuery,
    useLazyGetMpesaPaymentStatusQuery,





    // new flow endpoints
    useGetAllAgreementsDataQuery,
    useGetPartnerInstitutionsQuery,
    useGetInstituteMessageQuery,
    useGetMentorApplicationsQuery,
    useGetUserAddressesQuery,
    useGetUserAddressByIdQuery,
} = clientSideGetApis;
