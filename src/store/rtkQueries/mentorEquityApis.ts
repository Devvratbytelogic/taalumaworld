import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type {
  IAllMentorEquityAPIResponse,
  IMyMentorEquityAPIResponse,
  IUpdateMentorEquityAPIResponse,
  MentorEquityListStatus,
} from '@/types/mentorEquity';

export type AdminMentorEquityListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: MentorEquityListStatus;
};

export const mentorEquityApis = rtkQuerieSetup.injectEndpoints({
  endpoints: (builder) => ({
    getAllMentorEquity: builder.query<IAllMentorEquityAPIResponse, AdminMentorEquityListParams | void>({
      query: (params) => ({
        url: `/admin/mentor-equity`,
        method: 'GET',
        params: params ? { ...params } : {},
      }),
      providesTags: ['AdminMentorEquity'],
    }),
    getMyMentorEquity: builder.query<IMyMentorEquityAPIResponse, void>({
      query: () => ({
        url: `/admin/mentor-equity/my`,
        method: 'GET',
      }),
      providesTags: ['MyMentorEquity'],
    }),
    updateMentorEquity: builder.mutation<
      IUpdateMentorEquityAPIResponse,
      { mentorId: string; granted: boolean; notes?: string }
    >({
      query: ({ mentorId, granted, notes }) => ({
        url: `/admin/mentors/${mentorId}/equity`,
        method: 'PUT',
        body: {
          granted,
          ...(notes?.trim() ? { notes: notes.trim() } : {}),
        },
      }),
      invalidatesTags: ['AdminMentorEquity', 'MyMentorEquity', 'AdminStaff', 'AdminProfile'],
    }),
  }),
});

export const {
  useGetAllMentorEquityQuery,
  useGetMyMentorEquityQuery,
  useUpdateMentorEquityMutation,
} = mentorEquityApis;
