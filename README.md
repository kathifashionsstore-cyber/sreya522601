# Sreya Hospitals & IVF Centre

Production-oriented React 18 + Vite website for Sreya Hospitals & IVF Centre, Narasaraopet. The build includes public pages, Firebase-backed content, admin-only editing, appointments with receipts, rule-based chatbot, ImgBB upload proxy, PWA support, SEO metadata, Firestore rules, and Vercel configuration.

## Local Setup

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example` when testing serverless functions or App Check.

Required deployment variables:

- `IMGBB_API_KEY`
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `VITE_RECAPTCHA_V3_SITE_KEY`
- `VITE_SITE_URL`
- Email: `RESEND_API_KEY`, `ADMIN_NOTIFICATION_EMAIL`, `RECEIPT_FROM_EMAIL`
- Optional SMTP fallback: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

Email sending from `appointments@sreyahospitals.in` or another hospital domain requires DNS verification with the provider. Add SPF/DKIM records in the domain DNS before relying on production email delivery.

## Firebase Setup

1. Deploy `firestore.rules` and `firestore.indexes.json`.
2. Enable Firebase Authentication with Email + Password.
3. Create admin/editor users manually in Firebase Console or through a trusted Admin SDK script.
4. Set custom claims with Firebase Admin SDK:

```js
await admin.auth().setCustomUserClaims(uid, { admin: true })
await admin.auth().setCustomUserClaims(editorUid, { editor: true })
```

5. Enable Firebase Auth email enumeration protection.
6. Register a reCAPTCHA v3 key in Firebase App Check and set `VITE_RECAPTCHA_V3_SITE_KEY`.
7. Login at `/admin/login`, then use **Sync Seed Data** in the dashboard.

## Content Editing Guide

- Dashboard: sync seed content and review top metrics.
- Announcement: toggle and edit the thin promo bar.
- Hero Slides: edit home hero text, images, CTAs, and ordering.
- Services: edit categories and sub-services, including FAQs, images, videos, benefits, and warning signs.
- Doctors, Gallery, Blog, Testimonials, Free Camp: edit public content.
- Appointments: create manual bookings, update status, generate receipts, export CSV.
- Contacts: mark read/unread, reply via WhatsApp, export CSV.
- Payments: manage UPI display and QR preview.
- Settings: update hospital details, SEO, social links, departments, and review security log.

Image uploads are compressed in the browser to target 300KB, then routed through `/api/upload-image`. The ImgBB API key must only live in Vercel environment variables.

## Deployment

Deploy to Vercel with:

```bash
npm run build
```

`vercel.json` provides SPA rewrites and security headers. Vercel Node functions live in `/api`.

Use a separate Firebase project for staging/preview deployments so PR previews never touch production patient data. Configure staging Firebase values in Vercel preview environment variables and production values only for the production environment.

Rollback plan: open the Vercel project dashboard, go to Deployments, choose the last known-good production deployment, and click Promote to Production. This restores the prior build within seconds.

## Testing & CI

```bash
npm run lint
npm run test:unit
npx firebase-tools emulators:exec --only firestore "npm run test:rules"
npm run build
```

GitHub Actions runs lint, unit tests, Firestore rules tests, and build on push/PR. Playwright E2E is configured for main-branch pushes.

## Monitoring & Operations

- Configure Sentry or an equivalent error tracker for the React app and `/api` functions.
- Configure uptime monitoring for `/` and `/api/upload-image`.
- Set Firebase and ImgBB usage/budget alerts.
- Review `QA_CHECKLIST.md` before production launch.
- Legal pages are placeholders and must be reviewed by a qualified lawyer before launch.

## Security Summary

This site is not described as "unhackable." It uses practical defense in depth: admin-only writes, deny-by-default Firestore rules, App Check wiring, no public sign-up, 30-minute admin idle logout, sanitized plain-text content storage, honeypot fields, authenticated image proxy, rate limiting, secure headers, and CSV export for operational backups.
