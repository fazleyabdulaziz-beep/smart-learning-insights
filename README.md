# Smart Learning Insights — Phase 1 prototype
Setup: `npm install && npm run dev` (build check: `npm run build`).
Demo: parent@example.com / teacher@example.com, password `demo1234`; student = one-click demo profile (Aisyah).
Architecture: `src/data` (relational-style sample data), `src/features/analytics.ts` (rule-based stats, evidence rule, recommendations), `src/config/siteConfig.ts` (branding + thresholds), `src/store.tsx` (localStorage state + reset).
Limits: fictional data only; role selection and localStorage sessions are NOT secure; answer keys are in the frontend (protect server-side in production); thresholds are prototype settings, not validated standards; question bank (16 items) must be reviewed by an educator against KSSR; no diagnosis, prediction or ML.
Phase 2: Supabase auth + RLS, consent, retention/deletion, access logs, PDPA compliance review, larger question bank, more charts.
