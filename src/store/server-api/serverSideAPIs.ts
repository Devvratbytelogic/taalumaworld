import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { API_BASE_URL } from '@/utils/config';
import type { ISingleChapterAPIResponse } from '@/types/user/singleChapter';
import type { ISingleBookAPIResponse } from '@/types/user/singleBook';
import type { IGlobalSettingsAPIResponse } from '@/types/globalSettings';
import { IUserAllAuthorsAPIResponse } from '@/types/user/allAuthors';

async function getHeaders() {
  const cookieStore = await cookies();

  const headers: Record<string, string> = {
    Accept: 'application/json',
    device: cookieStore.get('device')?.value ?? '',
    userID: cookieStore.get('userID')?.value ?? '',
  };

  const token = cookieStore.get('auth_token')?.value;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function serverFetch<T>(path: string): Promise<T | null> {
  try {
    const urlString = `${API_BASE_URL}${path}`;
    const fetchOptions = {
      method: 'GET',
      headers: await getHeaders(),
    };
    const res = await fetch(urlString, fetchOptions);

    if (!res.ok) {
      if (res.status === 404) notFound();
      const errorBody = await res.json().catch(() => ({}));
      const message: string = (errorBody as { message?: string }).message ?? res.statusText;
      console.error(`[API Error] ${res.status} — ${urlString}: ${message}`);
      return null;
    }

    const data = await res.json();
    return data as T;
  } catch (error) {
    // console.error(`Error fetching data from ${path}`, error);
    return null;
  }
}

export async function getGlobalSettingsServerAPI() {
  return serverFetch<IGlobalSettingsAPIResponse>(`/user/get-global`);
}
export async function getSingleBlueprintServerAPI({ slug }: { slug: string }) {
  return serverFetch<ISingleChapterAPIResponse>(`/user/content/blueprint/${encodeURIComponent(slug)}`);
}
export async function getSingleSeriesServerAPI({ slug }: { slug: string }) {
  return serverFetch<ISingleBookAPIResponse>(`/user/content/series/${encodeURIComponent(slug)}`);
}
export async function getAllMentorsServerAPI() {
  return serverFetch<IUserAllAuthorsAPIResponse>(`/user/mentor-list`);
}