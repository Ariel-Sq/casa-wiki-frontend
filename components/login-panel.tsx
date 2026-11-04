'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoginPanel() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    await signIn('google', { callbackUrl: '/cuenta' });
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex rounded-full border border-line bg-surface-low p-1">
        {[
          { id: 'login', label: 'Iniciar sesión' },
          { id: 'register', label: 'Crear cuenta' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id as 'login' | 'register')}
            className={cn(
              'flex-1 rounded-full py-2.5 text-[12.5px] font-semibold transition-colors',
              tab === item.id ? 'bg-olive text-white shadow-soft' : 'text-muted',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-line bg-surface py-3.5 text-[13px] font-semibold transition-colors hover:border-olive disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="size-4.5" aria-hidden>
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
          />
          <path
            fill="#FBBC05"
            d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
          />
        </svg>
        {loading ? 'Conectando...' : tab === 'login' ? 'Ingresar con Google' : 'Crear cuenta con Google'}
        {!loading && <ArrowRight className="size-4" />}
      </button>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[10.5px] uppercase tracking-[0.12em] text-muted">
          o continuá con tu correo
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="rounded-xl border border-dashed border-line bg-surface-low p-4 text-center">
        <p className="text-[12px] font-semibold">Acceso con correo y contraseña</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">
          Estamos terminando la verificación por correo. Mientras tanto, ingresá con
          Google: usamos tu identidad verificada y nunca guardamos contraseñas.
        </p>
      </div>

      <p className="mt-5 text-center text-[10.5px] leading-relaxed text-muted">
        Al continuar, aceptás nuestros{' '}
        <span className="underline underline-offset-2">Términos de Atelier</span> y la{' '}
        <span className="underline underline-offset-2">Política de Privacidad</span> de Casa
        Wiki.
      </p>
    </div>
  );
}
