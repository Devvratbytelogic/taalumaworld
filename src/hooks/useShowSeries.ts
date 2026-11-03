import { useGetGlobalSettingsQuery } from '@/store/rtkQueries/userGetAPI';

/** Series stay visible unless global settings explicitly turn them off. */
export function useShowSeries() {
  const { data } = useGetGlobalSettingsQuery();
  return data?.data?.show_series !== false;
}
