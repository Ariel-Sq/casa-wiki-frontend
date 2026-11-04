import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCart } from '@/lib/cart';
import { CartProvider } from '@/components/cart-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CartDrawer } from '@/components/cart-drawer';
import { WhatsAppFab } from '@/components/whatsapp-fab';
import { SITE_URL } from '@/lib/env';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Casa Wiki — Mobiliario artesanal de autor',
    template: '%s · Casa Wiki',
  },
  description:
    'Muebles artesanales en maderas nobles certificadas y tapizados orgánicos. Piezas atemporales para hogares con alma, coordinadas por WhatsApp.',
  keywords: [
    'muebles artesanales',
    'mobiliario de autor',
    'muebles de madera',
    'casa wiki',
    'decoración',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Casa Wiki',
    title: 'Casa Wiki — Mobiliario artesanal de autor',
    description:
      'Diseño consciente para hogares con alma. Muebles artesanales en maderas nobles y tapizados orgánicos.',
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [session, cart] = await Promise.all([getServerSession(authOptions), getCart()]);

  return (
    <html lang="es" className={`${playfair.variable} ${jakarta.variable}`}>
      <body>
        <CartProvider initialCart={cart}>
          <SiteHeader
            user={
              session?.user
                ? { name: session.user.name ?? '', email: session.user.email ?? '' }
                : null
            }
          />
          <main className="min-h-[60vh]">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}
