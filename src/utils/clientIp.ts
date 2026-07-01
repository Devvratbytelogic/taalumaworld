let cachedIp: string | null = null;
let fetchPromise: Promise<string | null> | null = null;

/** Resolves the visitor IP via the Next.js API route (uses proxy headers). */
export async function getClientIp(): Promise<string | null> {
  if (cachedIp) return cachedIp;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch('/api/client-ip', { cache: 'no-store' })
    .then(async (res) => {
      if (!res.ok) return null;
      const data = (await res.json()) as { ip?: string | null };
      cachedIp = data.ip?.trim() || null;
      return cachedIp;
    })
    .catch(() => null)
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}

/** Appends `user_ip` to FormData when available. */
export async function appendUserIpToFormData(formData: FormData): Promise<void> {
  const ip = await getClientIp();
  if (ip) {
    formData.append('user_ip', ip);
  }
}
