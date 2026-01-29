# Operations Master — Deployment, Testing, Compliance

This master consolidates operational documents: deployment, cleanup, testing, data accuracy, and manual testing guides.

## Contents
- Deployment checklist and post-deploy notes (from `DEPLOYMENT_COMPLETE.md`)
- Cleanup summary and repo hygiene (from `CLEANUP_SUMMARY.md`)
- Data accuracy & testing plan (from `DATA_ACCURACY_TESTING.md`)
- Manual testing and QA guidance (from `MANUAL_TESTING_GUIDE.md`)

## Key Operational Notes
- CI: GitHub Actions added for Playwright; Vercel used for production.
- Testing: Playwright E2E tests live under `tests/`; see `playwright.config.ts` for baseURL.
- Data retention: policy uploads retained for 90 days by default; update privacy policy accordingly.

Files referenced:
- [DEPLOYMENT_COMPLETE.md](../DEPLOYMENT_COMPLETE.md)
- [CLEANUP_SUMMARY.md](../CLEANUP_SUMMARY.md)
- [DATA_ACCURACY_TESTING.md](../DATA_ACCURACY_TESTING.md)
- [MANUAL_TESTING_GUIDE.md](../MANUAL_TESTING_GUIDE.md)

