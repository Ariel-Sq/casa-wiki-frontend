'use client';

import { useState } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <form
      className="mt-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!email.trim()) return;
        setDone(true);
        setEmail('');
      }}
    >
      <label className="sr-only" htmlFor="club-email">
        Correo electrónico
      </label>
      <input
        id="club-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Tu correo electrónico"
        className="field bg-surface"
      />
      <button type="submit" className="btn btn-primary mt-2.5 w-full py-3 text-[12px] uppercase tracking-[0.08em]">
        {done ? '¡Bienvenido al club!' : 'Suscribirme'}
      </button>
      {done && (
        <p className="mt-2 text-[11.5px] text-olive">
          Te escribimos con tu beneficio de bienvenida.
        </p>
      )}
    </form>
  );
}
