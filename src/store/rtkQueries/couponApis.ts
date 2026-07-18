import { IAllInstitutionsAPIResponse, IInstituteMessageAPIResponse, IInstitutionAccessAPIResponse, IInstitutionKpisAPIResponse, ISingleInstitutionAPIResponse } from '@/types/institution';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export const institutionApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
       
    }),
});

export const {
    // Institutions
} = institutionApi;
