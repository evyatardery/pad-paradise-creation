# PADZONE (padzone.co.il)

Custom gaming mousepad shop. Vite + React + TypeScript + Tailwind/shadcn. UI text is Hebrew (RTL).

## Where things run
- **Hosting:** Cloudflare Pages project `padzone`. Every push to `main` builds (`npm run build` → `dist`) and goes live on padzone.co.il.
- **Backend:** Supabase project `proouexxpsroyzzzmvwa` (org PADZONE). Tables: `orders`, `user_roles`, `email_send_log`; storage bucket `order-files`; RPCs `create_order`, `validate_coupon`, `attach_order_files`.
- **Email:** Resend (domain padzone.co.il verified). Edge function `send-transactional-email` sends with `RESEND_API_KEY`. Supabase Auth emails also go through Resend SMTP.
- **Admin:** `/admin`, email+password login; `evyatardery@gmail.com` is admin (see `is_admin()`).

## Changing the backend
- DB changes: add a new file in `supabase/migrations/`, then run it in the Supabase SQL editor.
- Edge functions live in `supabase/functions/`. To deploy without the CLI, bundle to one file and paste it into the dashboard editor:
  `npx esbuild supabase/functions/<fn>/index.ts --bundle --format=esm --platform=neutral --jsx=transform --external:'npm:*' --external:'https://*' --outfile=supabase/deploy/<fn>.ts`
- Function secrets: `RESEND_API_KEY` (set), optional `ORDER_WEBHOOK_URL`, `FACTORY_EMAIL`, `EMAIL_FROM`.

## History
Built in Lovable until Nov 2026. Lovable-only code (email queue, preview auth broker, lovable-tagger) was removed; old pieces kept in `supabase/legacy-lovable/` for reference. Old order print files (before Nov 24, 2026) are still in the old Lovable Cloud storage.
