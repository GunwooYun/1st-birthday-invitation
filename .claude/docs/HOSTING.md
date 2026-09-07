# GitHub Pages Hosting Guide (Astro 7, user site)

> Superseded for day-to-day use by the Korean `docs/SETUP.md` in the repo root; this file keeps the English rationale.

> 2026-09-07. Companion to `PLAN.md`. User = GunwooYun; repo = `gunwooyun.github.io` (private).

## 1. Repository

- Repo `GunwooYun/gunwooyun.github.io` → site URL `https://gunwooyun.github.io/` (user site, no `base`).
- Visibility: **private** (requires GitHub Pro; Pages deploys via Actions and only the built site is public). PII is supplied through Actions secrets regardless.

## 2. Astro config

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://gunwooyun.github.io',
  output: 'static',
  env: { schema: { /* PUBLIC_* client vars + secret server vars, see repo */ } },
});
```

- Every internal asset/link must respect `base`: use `import.meta.env.BASE_URL` or Astro's `<Image>`/`<Picture>`; never hardcode `/images/...`.
- Absolute OG URL: `new URL('og.jpg', Astro.site + import.meta.env.BASE_URL)`.

## 3. GitHub Actions workflow

Settings → Pages → Build and deployment → Source: **GitHub Actions**.

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6
        with:
          node-version: 24
          package-manager: npm@latest
        env:
          PUBLIC_KAKAO_JS_KEY: ${{ secrets.PUBLIC_KAKAO_JS_KEY }}
          PARENT_PHONE_MOM: ${{ secrets.PARENT_PHONE_MOM }}
          PARENT_PHONE_DAD: ${{ secrets.PARENT_PHONE_DAD }}
          ACCOUNT_MOM: ${{ secrets.ACCOUNT_MOM }}
          ACCOUNT_DAD: ${{ secrets.ACCOUNT_DAD }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

- `withastro/action@v6` detects npm from `package-lock.json`.
- Secrets: Settings → Secrets and variables → Actions. Read in Astro with `import.meta.env.X` (build time; values end up in the built HTML, which is intended — they just never enter git).
- The Kakao JS key is public by design; keep it as a secret only to stay out of git history.

## 4. Kakao Developers

1. https://developers.kakao.com → 내 애플리케이션 → 앱 추가
2. 앱 키 → **JavaScript 키** copy
3. 앱 키 → JavaScript 키 → **JavaScript SDK 도메인**: `https://gunwooyun.github.io` and `http://localhost:4321` (console was restructured; domains are per JS key, not per app)
4. 제품 설정 → 카카오맵 → **활성화 설정 ON** (required since 2024-12-01; otherwise map SDK returns 403)
5. Share uses `Kakao.Share.sendDefault` (SDK v2). After changing `og.jpg`, clear the cache at https://developers.kakao.com/tool/debugger/sharing

## 5. Privacy on the site

- `src/layouts/Base.astro`: `<meta name="robots" content="noindex, nofollow">`
- `public/robots.txt`:
  ```
  User-agent: *
  Disallow: /
  ```
- These affect the site only. A public repo remains visible on github.com and in code search.

## 6. Custom domain (optional)

1. `public/CNAME` containing the domain (e.g. `soeun.example.com`)
2. DNS: CNAME record → `gunwooyun.github.io`
3. Settings → Pages → Custom domain → enter it → wait for check → **Enforce HTTPS**
4. Set `site` to the custom domain and remove `base`
5. Add the domain to Kakao Web platform domains

## 7. Deploy and verify

```
git push origin main
```

1. Actions tab → workflow green → URL in the deploy job summary
2. Open in iOS Safari, Android Chrome, and by sending the link to yourself in KakaoTalk (preview card + in-app browser)
3. Lighthouse (mobile) in Chrome DevTools: performance ≥ 90

## 8. After the event

- Settings → Pages → Unpublish site, or make the repo private / delete it
- Delete the Kakao app and the Firebase project (if used)
- Limits for reference: 1 GB site, 100 GB/month bandwidth, 10 builds/hour — irrelevant at this scale
