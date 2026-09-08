// @ts-check
import { defineConfig, envField } from 'astro/config';

// Project site: https://gunwooyun.github.io/1st-birthday-invitation (repo GunwooYun/1st-birthday-invitation).
// `base` must match the repo name; every internal path goes through import.meta.env.BASE_URL or astro:assets.
export default defineConfig({
  site: 'https://gunwooyun.github.io',
  base: '/1st-birthday-invitation',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
  env: {
    schema: {
      // Public (embedded in the client bundle by design; restricted by domain on the provider side).
      PUBLIC_KAKAO_JS_KEY: envField.string({ context: 'client', access: 'public', optional: true, default: '' }),
      // Private (read at build time only, never committed; provided via GitHub Actions secrets).
      PHONE_DAD: envField.string({ context: 'server', access: 'secret', optional: true }),
      PHONE_MOM: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Format: "은행명|계좌번호|예금주"
      ACCOUNT_DAD: envField.string({ context: 'server', access: 'secret', optional: true }),
      ACCOUNT_MOM: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
