# Vortex AI Agents — ToDo

## En progreso

### Waitlist Morning Crew → Google Sheets
- [ ] Crear Google Sheet en sheets.new
- [ ] Abrir Apps Script (Extensions → Apps Script) y pegar el script del webhook
- [ ] Deploy: Web app / Execute as: Me / Anyone can access → copiar URL
- [ ] Comparar URL del Apps Script con la que está en Vercel (`WAITLIST_WEBHOOK_URL`)
- [ ] Verificar que `WAITLIST_WEBHOOK_URL` aparece en Vercel → Settings → Environment Variables
- [ ] Redeploy en Vercel después de confirmar la URL
- [ ] Probar: llenar formulario Morning Crew → verificar que aparece fila en el Sheet

---

## Pendiente

### Alta prioridad (antes de lanzar público)
- [ ] **API key security** — Anthropic key hardcodeada en `js/chat.js`. Moverla a `/api/chat-proxy.js` y actualizar el fetch URL en `chat.js`
- [ ] **Calendly** — Reemplazar `mailto:` en el CTA con popup de Calendly

### Contenido (cuando haya datos reales)
- [ ] Testimonials reales — las 3 tarjetas son placeholders
- [ ] Hero stats — actualizar 9/$50/30Y/97% con datos reales
- [ ] Precios — confirmar antes de lanzar ($500, $400, etc.)

### Técnico
- [ ] Favicon + apple-touch-icon en `assets/`
- [ ] OG image (1200×630) en `assets/` para redes sociales
- [ ] Analytics — agregar GA4 o Plausible en el `<head>`
- [ ] Robots.txt
- [ ] Sitemap.xml (después de que el dominio esté live)
- [ ] DNS — apuntar vortexagents.ai a Vercel

### Nice to have
- [ ] Mobile nav (hamburger para <900px)
- [ ] Animaciones fade-in al hacer scroll
- [ ] Modal de detalle por agent card
