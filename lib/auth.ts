import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import {
  BACKEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from './env';
import { frontendKeyHeaders } from './backend';

interface BackendUser {
  id: string;
  email: string;
  name?: string | null;
  picture?: string | null;
  role?: string;
}

/**
 * Exchange the Google id_token for a backend-issued session JWT. The backend
 * verifies the token against Google and provisions the user on first sign-in.
 */
async function exchangeGoogleIdToken(idToken: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...frontendKeyHeaders() },
      body: JSON.stringify({ idToken }),
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('[auth] backend google login failed', res.status);
      return null;
    }
    return (await res.json()) as {
      accessToken: string;
      user: BackendUser;
    };
  } catch (error) {
    console.error('[auth] backend google login error', error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID ?? '',
      clientSecret: GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: { prompt: 'select_account', access_type: 'online' },
      },
    }),
  ],
  pages: {
    signIn: '/ingresar',
    error: '/ingresar',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.id_token) {
        const exchanged = await exchangeGoogleIdToken(account.id_token);
        if (exchanged) {
          token.backendToken = exchanged.accessToken;
          token.backendUser = exchanged.user;
        }
      }
      return token;
    },
    async session({ session, token }) {
      const user = token.backendUser as BackendUser | undefined;
      if (user) {
        session.user = {
          ...session.user,
          id: user.id,
          email: user.email,
          name: user.name ?? session.user?.name ?? '',
          image: user.picture ?? session.user?.image,
          role: user.role,
        };
      }
      return session;
    },
  },
};
