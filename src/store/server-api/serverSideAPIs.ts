import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { API_BASE_URL } from '@/utils/config';
import type { ISingleChapterAPIResponse } from '@/types/user/singleChapter';
import type { ISingleBookAPIResponse } from '@/types/user/singleBook';
import type { IGlobalSettingsAPIResponse } from '@/types/globalSettings';
import { IUserAllAuthorsAPIResponse } from '@/types/user/allAuthors';
import type { IUserMentorDetailsAPIResponse } from '@/types/user/mentorDetails';
import { IAgreementAPIResponse } from '@/types/user/agreement';
import { ISR_REVALIDATE_SECONDS } from '@/constants/isr';

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

/** Cookie-free fetch for public ISR pages (no auth / user-specific headers). */
export async function publicFetch<T>(
  path: string,
  revalidate: number = ISR_REVALIDATE_SECONDS
): Promise<T | null> {
  try {
    const urlString = `${API_BASE_URL}${path}`;
    const res = await fetch(urlString, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      next: { revalidate },
    });

    if (!res.ok) {
      if (res.status === 404) notFound();
      const errorBody = await res.json().catch(() => ({}));
      const message: string = (errorBody as { message?: string }).message ?? res.statusText;
      console.error(`[API Error] ${res.status} — ${urlString}: ${message}`);
      return null;
    }

    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function serverFetch<T>(path: string): Promise<T | null> {
  try {
    const urlString = `${API_BASE_URL}${path}`;
    const fetchOptions = {
      method: 'GET',
      headers: await getHeaders(),
    };
    const res = await fetch(urlString, fetchOptions);
    // console.log('res.status', res.status);

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
  return publicFetch<IGlobalSettingsAPIResponse>(`/user/get-global`);
}
export async function getSingleBlueprintServerAPI({ slug }: { slug: string }) {
  return serverFetch<ISingleChapterAPIResponse>(`/user/content/blueprint/${encodeURIComponent(slug)}`);
}
export async function getSingleSeriesServerAPI({ slug }: { slug: string }) {
  return serverFetch<ISingleBookAPIResponse>(`/user/content/series/${encodeURIComponent(slug)}`);
}
export async function getAllMentorsServerAPI(params?: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const queryString = query.toString();

  return publicFetch<IUserAllAuthorsAPIResponse>(
    `/user/mentor-list${queryString ? `?${queryString}` : ''}`
  );
}
export async function getMentorDetailsServerAPI(
  shortCode: string,
  params?: {
    page?: number;
    limit?: number;
  }
) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const queryString = query.toString();

  return publicFetch<IUserMentorDetailsAPIResponse>(
    `/user/mentors/${encodeURIComponent(shortCode)}${queryString ? `?${queryString}` : ''}`
  );
}
export async function getAgreementBySlugServerAPI({ slug }: { slug: string }) {
  return serverFetch<IAgreementAPIResponse>(`/user/agreements/${encodeURIComponent(slug)}`);
}