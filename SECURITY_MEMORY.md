# Security Memory

Updated: 2026-04-15

This file is the local project memory for the security hardening work. No external memory resource was available in this session, so the decisions were recorded here.

## Goals

- Keep the public landing page and gallery pages working.
- Keep the admin panel working.
- Remove client-side XSS vectors caused by rendering Firebase/localStorage data with `innerHTML`.
- Restrict the Firebase Realtime Database so public users can read only the public gallery dataset, while writes stay limited to the administrator.

## Implemented in code

- `index.html`
  - Google reviews now render with DOM APIs instead of `innerHTML`.
  - EmailJS now loads from a pinned local vendor file instead of jsDelivr.
  - EmailJS init now uses `blockHeadless` and `limitRate`.
  - Added a honeypot field to reduce spam submissions.
  - External links opened in new tabs now use `noopener noreferrer`.
  - Added `Content-Security-Policy` and `Referrer-Policy` meta tags.
- `admin_dashboard.html`
  - Service and image data are normalized before load/save/render.
  - Only safe `data:image/...;base64,...` URLs are accepted for gallery images.
  - Service cards and thumbnails now render with DOM APIs instead of `innerHTML`.
  - Added stricter admin-user checks in the UI flow.
  - JSZip now loads from a pinned local vendor file instead of cdnjs.
  - Added `Content-Security-Policy` and `Referrer-Policy` meta tags.
- `automacao.html`, `instalacoes_prediais.html`, `residenciais.html`
  - Migrated to a shared secure module: `gallery_page.js`.
  - Removed inline lightbox handlers.
  - Added `Content-Security-Policy` and `Referrer-Policy` meta tags.
- `gallery_page.js`
  - Centralizes secure gallery loading.
  - Validates Firebase/localStorage payloads before rendering.
  - Uses only DOM APIs for image cards.
- `database.rules.json`
  - Recommended Firebase Realtime Database rules file for public-read/admin-write behavior.
- `firebase.json` and `.firebaserc`
  - Local CLI deployment config for the Firebase project.
- `SANAR_PENDENCIAS.md`
  - Exact runbook for deploying rules and restricting keys.

## Remote actions still required

- Apply `database.rules.json` to the Firebase Realtime Database.
- Confirm that anonymous write access is blocked in production.
- Restrict the Google Places key, Firebase web app settings, and EmailJS configuration by domain and quota.
- Rotate exposed keys if abuse is suspected.
- Optionally add SRI hashes for CDN assets that remain pinned to fixed versions.

## Functional intent

- Public gallery pages should continue reading `portfolio/services`.
- Admin writes should continue targeting `portfolio/services`.
- Public read is intentional for that specific dataset only because the gallery content is public.
- All other database paths should stay private.
