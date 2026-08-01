'use server';

import { cookies } from 'next/headers';
import { updateTag } from 'next/cache';
import { TAGS } from '@/store/server-api/cacheTags';

async function assertLoggedIn() {
  if (!(await cookies()).get('auth_token')?.value) {
    throw new Error('Unauthorized');
  }
}

/** Settings / logo / content mode */
export async function refreshAfterSettingsChange() {
  await assertLoggedIn();
  updateTag(TAGS.GLOBAL_SETTINGS);
}

/** Mentor list + optional /mentor/[shortCode] */
export async function refreshAfterMentorChange(shortCode?: string | null) {
  await assertLoggedIn();
  updateTag(TAGS.MENTORS);
  const code = shortCode?.trim();
  if (code) updateTag(TAGS.mentor(code));
}

/** FAQs */
export async function refreshAfterFaqChange() {
  await assertLoggedIn();
  updateTag(TAGS.FAQS);
}

/** Testimonials on home */
export async function refreshAfterTestimonialChange() {
  await assertLoggedIn();
  updateTag(TAGS.TESTIMONIALS);
}

/** Policies / agreements */
export async function refreshAfterPolicyChange(slug?: string | null) {
  await assertLoggedIn();
  updateTag(TAGS.POLICIES);
  const s = slug?.trim();
  if (s) updateTag(TAGS.policy(s));
}
