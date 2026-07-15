# Launch Notes

- Hospital phone, WhatsApp, email, exact address, map URL, qualifications, ratings, review count, and legal name variant must be confirmed by the hospital before final publishing.
- Firebase App Check is wired but inactive locally until `VITE_RECAPTCHA_V3_SITE_KEY` is configured.
- ImgBB uploads require `IMGBB_API_KEY` in Vercel. The key is never placed in client code.
- Admin access requires a Firebase custom claim: `{ admin: true }`.
- Receipt previews show a QR code in the browser. The generated PDF includes the verification URL and receipt ID; embedding the QR image inside the PDF can be added once the final PDF branding is approved.
- Email receipts are pluggable. `/api/send-receipt` sends only when SMTP environment variables are configured.
- Weekly Firestore export is a Firebase/Google Cloud scheduled task outside this repo. The admin UI includes CSV exports for contacts and appointments as an operational fallback.
- Vercel deployment was not executed locally because project ownership, production domain, and environment variables must be configured in the client's Vercel account first. The repo includes `vercel.json` and `/api` functions for Vercel.
- Lighthouse was not run because this environment does not include a production Vercel URL. The production build succeeds and chunks are route-split, but run Lighthouse on the deployed URL before launch.
- Locomotive Scroll is installed as requested but not activated by default; native scrolling is currently used to avoid conflicts with the sticky navbar, mobile bottom sheets, and medical content readability. Enable it only after launch QA on real devices.
- Admin editors provide complete content control through structured JSON editors plus image upload/compression. A more guided 8-tab service editor can be layered on top of the same Firestore schema.
- `nodemailer` was upgraded to remove the high-severity audit finding. `npm audit` still reports 6 moderate transitive `uuid` findings through Firebase Admin/Google Cloud dependencies; npm's force fix proposes a breaking Firebase Admin downgrade, so evaluate upstream package guidance before deployment.
- Placeholder images are intentionally generic and should be replaced with verified hospital-owned photos from the admin panel.
