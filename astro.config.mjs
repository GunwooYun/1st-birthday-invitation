// @ts-check
import { defineConfig, envField } from 'astro/config';

// User site: https://gunwooyun.github.io (repo GunwooYun/gunwooyun.github.io) → no `base`.
export default defineConfig({
  site: 'https://gunwooyun.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
  env: {
    schema: {
      // Public (embedded in the client bundle by design; restricted by domain on the provider side).
      PUBLIC_KAKAO_JS_KEY: envField.string({ context: 'client', access: 'public', optional: true, default: '' }),
      PUBLIC_FIREBASE_API_KEY: envField.string({ context: 'client', access: 'public', optional: true, default: '' }),
      PUBLIC_FIREBASE_AUTH_DOMAIN: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '',
      }),
      PUBLIC_FIREBASE_PROJECT_ID: envField.string({ context: 'client', access: 'public', optional: true, default: '' }),
      PUBLIC_FIREBASE_APP_ID: envField.string({ context: 'client', access: 'public', optional: true, default: '' }),
      // Private (read at build time only, never committed; provided via GitHub Actions secrets).
      PHONE_DAD: envField.string({ context: 'server', access: 'secret', optional: true }),
      PHONE_MOM: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Format: "은행명|계좌번호|예금주"
      ACCOUNT_DAD: envField.string({ context: 'server', access: 'secret', optional: true }),
      ACCOUNT_MOM: envField.string({ context: 'server', access: 'secret', optional: true }),
      RSVP_FORM_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
