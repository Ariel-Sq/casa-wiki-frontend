import { BACKEND_URL } from './env';

export function frontendKeyHeaders(): Record<string, string> {
  const key = process.env.FRONTEND_SHARED_SECRET;
  return key ? { 'x-frontend-key': key } : {};
}

export function backendImageUrl(
  image: { url?: string; path?: string } | undefined,
): string {
  if (!image) return '';
  if (image.url && /^https?:\/\//.test(image.url) && !image.url.startsWith('{{')) {
    return image.url;
  }
  if (image.path) {
    return `${BACKEND_URL}/api/images?path=${encodeURIComponent(image.path)}`;
  }
  return '';
}

/**
 * Server-side fetch against the legas-backend API. Never import from a
 * client component: it would expose the internal backend URL.
 */
export async function backendFetch<T>(
  path: string,
  init: RequestInit & { headers?: Record<string, string> } = {},
): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...frontendKeyHeaders(),
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Backend ${init.method ?? 'GET'} ${path} failed (${res.status}): ${body}`,
    );
  }

  return (await res.json()) as T;
}
