import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { NEXTAUTH_SECRET } from './env';
import { frontendKeyHeaders } from './backend';
import { SESSION_COOKIE } from './constants';

export { SESSION_COOKIE };

export async function getSessionId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

/**
 * Headers for a server-to-server call to the backend.
 * Logged-in shoppers use the backend JWT; anonymous ones fall back to the
 * session id cookie, which is minted by middleware on the first request.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const store = await cookies();
  const all = store.getAll();
  const cookieMap = Object.fromEntries(all.map((c) => [c.name, c.value]));
  const cookieHeader = all.map((c) => `${c.name}=${c.value}`).join('; ');

  const token = await getToken({
    req: { cookies: cookieMap, headers: { cookie: cookieHeader } } as never,
    secret: NEXTAUTH_SECRET,
  });

  if (token?.backendToken) {
    return {
      ...frontendKeyHeaders(),
      Authorization: `Bearer ${token.backendToken}`,
    };
  }

  return { ...frontendKeyHeaders() };
}

export async function identityHeaders(): Promise<Record<string, string>> {
  const auth = await getAuthHeaders();
  if ('Authorization' in auth) return auth;
  const sessionId = await getSessionId();
  return sessionId ? { ...auth, 'x-session-id': sessionId } : auth;
}
