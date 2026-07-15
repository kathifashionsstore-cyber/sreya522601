# Sreya Hospitals Production QA Checklist

## Admin Usability

- [ ] Open every admin section and confirm no raw JSON braces, brackets, or quoted keys are visible.
- [ ] Doctors: edit basic info, photo, awards, memberships, and FAQs; save; confirm public Doctors page updates.
- [ ] Services: edit one category and one sub-service section; preview the public page.
- [ ] Upload one image from each image field context; confirm the flow is pick file -> compress/upload -> thumbnail updates.
- [ ] Confirm recently deleted records can be restored.
- [ ] Confirm editor role cannot access Settings, Theme, Payments, Services, Doctors, Announcements, or Analytics.

## Public Pages

- [ ] Test at 375px, 768px, and 1440px widths.
- [ ] Home order: hero, stats, services grid, featured links, trust blocks, differentiators, testimonials, free camp, CTA, footer.
- [ ] Desktop and mobile nav include Free Camp, Success Stories, FAQ.
- [ ] Every page has a visible hero/banner and no overlapping text.
- [ ] Each major page has useful images beyond the hero.
- [ ] Sub-service pages show at-a-glance chips, doctor note, inline CTA, treatment options, disclaimer link, FAQs, and related services.

## Forms & Notifications

- [ ] Appointment form requires contact consent.
- [ ] Contact form requires contact consent.
- [ ] Appointment with email sends patient receipt email and admin notification.
- [ ] Appointment without email still succeeds and sends admin notification.
- [ ] Contact submission sends admin notification.
- [ ] If submission fails, phone fallback is visible.

## Legal & Compliance

- [ ] Privacy Policy, Terms, Medical Disclaimer, and Cookie Policy routes load.
- [ ] Footer links to all legal pages.
- [ ] Cookie banner appears on first visit and stays dismissed after Accept.
- [ ] Legal text is reviewed by a qualified lawyer before production launch.

## Theme & Accessibility

- [ ] Apply at least three Quick Themes and confirm public pages update.
- [ ] Check contrast badges in Advanced theme editor.
- [ ] Run Playwright axe checks on Home, Appointment, and at least one sub-service page.
- [ ] Keyboard-only navigation works for nav, forms, accordions, carousel controls, and modals.
- [ ] All tap targets are at least 44px on mobile.

## Production Safety

- [ ] `npm run lint` passes.
- [ ] `npm run test:unit` passes.
- [ ] Firestore emulator rules tests pass through CI.
- [ ] `npm run build` passes.
- [ ] Maintenance mode shows phone number and hides public site content.
- [ ] Vercel rollback instructions have been shared with stakeholders.
- [ ] Firebase and ImgBB budget/quota alerts are configured.
- [ ] Uptime monitor checks `/` and `/api/upload-image`.
