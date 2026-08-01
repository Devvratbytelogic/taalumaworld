/** Cache tags — RTK invalidatesTags jaisa */
export const TAGS = {
  GLOBAL_SETTINGS: 'global-settings',
  MENTORS: 'mentors',
  mentor: (shortCode: string) => `mentor:${shortCode}`,
  POLICIES: 'policies',
  policy: (slug: string) => `policy:${slug}`,
  FAQS: 'faqs',
  TESTIMONIALS: 'testimonials',
} as const;
