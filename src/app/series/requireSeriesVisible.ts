import { notFound } from 'next/navigation';
import { getGlobalSettingsServerAPI } from '@/store/server-api/serverSideAPIs';

/** Series stays available unless global settings explicitly turn it off. */
export async function isSeriesVisible() {
  const settings = (await getGlobalSettingsServerAPI())?.data;
  return settings?.show_series !== false;
}

export async function notFoundWhenSeriesHidden() {
  if (!(await isSeriesVisible())) notFound();
}
