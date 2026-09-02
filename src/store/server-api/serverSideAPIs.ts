import { cookies } from 'next/headers';
import { notFound, unstable_rethrow } from 'next/navigation';
import { API_BASE_URL } from '@/utils/config';
import type { ISingleChapterAPIResponse } from '@/types/user/singleChapter';
import type { ISingleBookAPIResponse } from '@/types/user/singleBook';
import type { IGlobalSettingsAPIResponse } from '@/types/globalSettings';
import { IUserAllAuthorsAPIResponse } from '@/types/user/allAuthors';
import type { IUserMentorDetailsAPIResponse } from '@/types/user/mentorDetails';
import { IAgreementAPIResponse } from '@/types/user/agreement';
import {
  IFAQAPIResponse,
  ITestimonialsAPIResponse,
} from '@/types/user/testimonial';
import { TAGS } from '@/store/server-api/cacheTags';

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

type PublicFetchOptions = {
  revalidate?: number;
  tags?: string[];
};

async function readJsonOrNotFound<T>(res: Response, urlString: string): Promise<T | null> {
  const body = await res.json().catch(() => null) as { http_status_code?: number; message?: string } | null;
  if (res.status === 404 || body?.http_status_code === 404) notFound();
  if (!res.ok) {
    console.error(`[API Error] ${res.status} — ${urlString}: ${body?.message ?? res.statusText}`);
    return null;
  }
  return body as T;
}

/** Cookie-free fetch for public ISR pages */
export async function publicFetch<T>(
  path: string,
  options: PublicFetchOptions = {}
): Promise<T | null> {
  const { revalidate = 300, tags } = options;

  try {
    const urlString = `${API_BASE_URL}${path}`;
    const res = await fetch(urlString, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      next: {
        revalidate,
        ...(tags?.length ? { tags } : {}),
      },
    });
    return await readJsonOrNotFound<T>(res, urlString);
  } catch (error) {
    unstable_rethrow(error);
    return null;
  }
}

export async function serverFetch<T>(path: string): Promise<T | null> {
  try {
    const urlString = `${API_BASE_URL}${path}`;
    const res = await fetch(urlString, {
      method: 'GET',
      headers: await getHeaders(),
    });
    return await readJsonOrNotFound<T>(res, urlString);
  } catch (error) {
    unstable_rethrow(error);
    return null;
  }
}

export async function getGlobalSettingsServerAPI() {
  return publicFetch<IGlobalSettingsAPIResponse>(`/user/get-global`, {
    tags: [TAGS.GLOBAL_SETTINGS],
  });
}

export async function getSingleBlueprintServerAPI({ slug }: { slug: string }) {
  return serverFetch<ISingleChapterAPIResponse>(
    `/user/content/blueprint/${encodeURIComponent(slug)}`
  );
}

export async function getSingleSeriesServerAPI({ slug }: { slug: string }) {
  return serverFetch<ISingleBookAPIResponse>(
    `/user/content/series/${encodeURIComponent(slug)}`
  );
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
    `/user/mentor-list${queryString ? `?${queryString}` : ''}`,
    { tags: [TAGS.MENTORS] }
  );
}

export async function getMentorDetailsServerAPI(
  shortCode: string,
  params?: { page?: number; limit?: number }
) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const queryString = query.toString();

  return serverFetch<IUserMentorDetailsAPIResponse>(
    `/user/mentors/${encodeURIComponent(shortCode)}${queryString ? `?${queryString}` : ''}`
  );
}

export async function getAgreementBySlugServerAPI({ slug }: { slug: string }) {
  return publicFetch<IAgreementAPIResponse>(
    `/user/agreements/${encodeURIComponent(slug)}`,
    { tags: [TAGS.POLICIES, TAGS.policy(slug)] }
  );
}

export async function getFAQsServerAPI(params?: {
  type?: string;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params?.type) query.set('type', params.type);
  if (params?.search) query.set('search', params.search);
  const queryString = query.toString();

  return publicFetch<IFAQAPIResponse>(
    `/user/faqs${queryString ? `?${queryString}` : ''}`,
    { tags: [TAGS.FAQS] }
  );
}

export async function getTestimonialsServerAPI() {
  return publicFetch<ITestimonialsAPIResponse>(`/user/testimonial`, {
    tags: [TAGS.TESTIMONIALS],
  });
}
