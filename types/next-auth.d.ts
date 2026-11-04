import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendToken?: string;
    backendUser?: {
      id: string;
      email: string;
      name?: string | null;
      picture?: string | null;
      role?: string;
    };
  }
}
