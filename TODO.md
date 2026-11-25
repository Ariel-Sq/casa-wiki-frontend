# Casa Wiki · Pendientes

## Recordatorios

- [ ] **Cambiar el mail owner del proyecto.** Hoy `OWNER_EMAIL` apunta a `legasmuebles@gmail.com` (cuenta heredada de Legas). Cuando avancemos, definir la cuenta definitiva de Casa Wiki, actualizar `OWNER_EMAIL` en el backend (Vercel `casa-wiki-backend` + `.env` local) y ajustar el usuario owner en `casawiki_db` / Neon `casawiki-db`.
- [ ] Agregar los redirect URIs de Google para `casawiki.vercel.app` y `casa-wiki-admin.vercel.app`.
- [ ] Crear un cliente OAuth propio de Casa Wiki (hoy comparte el de Legas).
- [ ] Token real de MercadoPago y habilitar `NEXT_PUBLIC_MP_ENABLED`.
- [ ] SMTP/remitente propio para mails de pedido.
- [ ] Número de WhatsApp definitivo (`NEXT_PUBLIC_WHATSAPP_PHONE`).
- [ ] Revisar el fair-use de Vercel (bloqueo hasta ~20/12/2026) o pasar a Pro.
