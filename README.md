# Casa Wiki

Storefront de mobiliario artesanal construido con **Next.js 15 (App Router)**, React 19 y Tailwind 4. Consume la API de `legas-backend` (NestJS + PostgreSQL) y tiene identidad visual propia: paleta crema/oliva/terracota, tipografía editorial (Playfair Display + Plus Jakarta Sans) y flujo de compra coordinado por WhatsApp.

Diseño basado en el proyecto Stitch *Casa Wiki Furniture Ecommerce* (pantallas de Inicio & Colecciones, Catálogo, Producto & Carrito, Login & Club y Checkout & Confirmación).

## Producción

| Servicio | URL |
|---|---|
| Storefront | https://casa-wiki.vercel.app |
| API (instancia propia) | https://casa-wiki-api.vercel.app |
| Base de datos | Neon `casawiki-db` (proyecto independiente, región iad1) |
| Imágenes | Vercel Blob `casawiki-images` |


## Requisitos

- Node 22 (`.nvmrc`)
- pnpm
- `legas-backend` corriendo en `http://localhost:8080` con la base local (`ecommerce_db`)

## Puesta en marcha

```bash
source ~/.nvm/nvm.sh && nvm use 22
cd ~/projects/casa-wiki
pnpm install
cp .env.example .env.local   # completar credenciales
pnpm dev
```

- Frontend: http://localhost:3002
- Backend: http://localhost:8080/api (Swagger en `/api/docs`)

> El puerto 3002 se usa para no chocar con `legas-frontend` (3000) ni con el servicio que ya ocupa 3001.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `BACKEND_URL` | URL interna del backend. Solo se usa del lado servidor. |
| `NEXTAUTH_URL` | URL canónica de esta app (`http://localhost:3002`). |
| `NEXTAUTH_SECRET` | Secreto para firmar la sesión (`openssl rand -base64 32`). |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Mismo cliente OAuth que usa `legas-backend`. |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | Número de WhatsApp en formato `549...` para los CTAs. |
| `NEXT_PUBLIC_SITE_URL` | URL pública para metadata y SEO. |
| `NEXT_PUBLIC_MP_ENABLED` | `true` para habilitar MercadoPago en el checkout. |
| `FRONTEND_SHARED_SECRET` | Debe coincidir con el `FRONTEND_SHARED_SECRET` del backend. |

### Google OAuth

El backend solo acepta identidades verificadas por Google (`POST /api/auth/google`). Para que el login funcione hay que agregar estos redirect URIs al cliente OAuth de Google:

```
http://localhost:3002/api/auth/callback/google
https://casa-wiki.vercel.app/api/auth/callback/google
```

El `GOOGLE_CLIENT_ID` de este proyecto debe ser el mismo que el del backend (el backend valida la audiencia del `id_token`). El resto de la tienda funciona sin login: carrito anónimo, checkout y seguimiento por WhatsApp.

## Estructura

```
app/
  page.tsx                      Inicio (hero, espacios, destacados, manifiesto, testimonios)
  catalogo/page.tsx             Catálogo con filtros, orden y paginación
  producto/[slug]/page.tsx      Detalle de producto (galería, variantes, carrito)
  ingresar/page.tsx             Login & Club
  checkout/page.tsx             Datos de contacto, entrega y forma de pago
  checkout/confirmacion/[id]    Confirmación + hoja de ruta + CTA WhatsApp
  cuenta/page.tsx               Perfil e historial de pedidos
  actions/                      Server actions (carrito y checkout)
components/                     Header, footer, cart drawer, cards, filtros, etc.
lib/                            Capa de datos y helpers server-side
```

## Integración con legas-backend

Todas las llamadas al backend son server-side (`lib/backend.ts`), nunca desde el browser:

- `GET /api/product-templates`, `/api/product-templates/by-slug/:slug`, `/api/categories/tree`
- `GET/POST/PATCH/DELETE /api/cart` y `/api/cart/items`
- `POST /api/payments/mercadopago/checkout`
- `GET /api/orders`, `/api/orders/:id`
- `POST /api/auth/google` (intercambio del `id_token`)

Identidad:

- Usuario logueado: JWT del backend guardado en la sesión cifrada de NextAuth (nunca expuesto al cliente).
- Anónimo: cookie `casa-wiki-session-id` creada por `middleware.ts` y enviada como `x-session-id`.

## Checkout

Dos modos, soportados por el backend:

1. **Transferencia/efectivo coordinado por WhatsApp** (`paymentMethod: "offline"`): crea la orden y redirige a la confirmación. El pago se coordina por WhatsApp. Sin recargo.
2. **MercadoPago** (`paymentMethod: "mercadopago"`): crea la preferencia y redirige a Checkout Pro. Precio de lista (+15%). Se muestra solo si `NEXT_PUBLIC_MP_ENABLED=true`.

El stock se reserva al confirmar; el carrito se vacía al crear la orden.

## Aislamiento respecto de Legas

Este proyecto tiene su propia instancia de backend (`casa-wiki-backend`, deploy `casa-wiki-api`), su propia base Neon (`casawiki-db`), su propio Blob store (`casawiki-images`), secretos JWT/shared-secret propios y su propio proyecto de Vercel. Lo que todavía se comparte:

- Cliente OAuth de Google (mismo `GOOGLE_CLIENT_ID`).
- Cuenta de MercadoPago (sin token real en ninguna de las dos).
- Credenciales SMTP/Gmail (la instancia nueva no las tiene; los mails de pedido no se envían).
- Número de WhatsApp.
- Repositorio del backend (`legas-backend`), del que se copió el código.

Para aislamiento total: crear un cliente OAuth nuevo, una app de MercadoPago nueva, un remitente SMTP propio y mover el backend a su propio repo.


## Scripts

```bash
pnpm dev         # desarrollo en :3002
pnpm build       # build de producción
pnpm start       # servir el build en :3002
pnpm typecheck   # tsc --noEmit
```
