# Implementation Plan: Soeun's 1st Birthday (돌잔치) Mobile Invitation

> v0.5 — 2026-09-07 (implemented; guestbook, doljabi poll and RSVP removed at the user's request → no backend, no forms; only Kakao SDK remains external). Based on `.claude/docs/research/invitation-content-ux.md`,
> `.claude/docs/research/tech-stack-hosting.md`, and a deep-reasoning design review.
> Hosting steps live in `.claude/docs/HOSTING.md`.

## 1. Goal

A single-page, mobile-first invitation web page for Soeun's first birthday party,
hosted on GitHub Pages, shared primarily via KakaoTalk link. One-off site,
single maintainer, must be fast in the KakaoTalk in-app browser and iOS Safari.

## 2. Assumptions (confirm with the user)

| # | Assumption | Default |
|---|-----------|---------|
| A1 | Hosting target | **Confirmed**: project site `https://gunwooyun.github.io/1st-birthday-invitation` (repo `GunwooYun/1st-birthday-invitation`, `base` = repo name; renamed from the user site 2026-09-08) |
| A2 | Guest count | 50–150 |
| A3 | Interactive features | **Revised (v0.5)**: account numbers with copy only. RSVP, guestbook and doljabi poll all dropped — the user will not ask guests for attendance/headcount. |
| A4 | Repo visibility | **Revised**: public repo (Free plan rejected private Pages). PII injected via secrets, never committed; photos in the repo are public. |
| A5 | Account numbers | **Removed (v0.6, 2026-09-08)** — user does not want a gift/account section. |
| A6 | Custom domain | Not needed |
| A7 | Content | **Confirmed**: 2027-05-09 (Sun), 빕스 은평롯데점, 윤건우/박서희. Real photos ~2027-05-03; generated pastel placeholders until then. Start time and baby's birth date still TBD. |

## 3. Tech stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Astro 7.3** (static output, Node 22.12+) | Zero-JS by default; built-in `<Picture>` generates WebP + srcset at build time; single content page fits perfectly. Interactivity is plain `<script>` blocks in `.astro` files — no framework islands needed. |
| Styling | Plain scoped CSS + CSS variables (pastel theme) | No Tailwind pipeline for a one-off. |
| Fonts | Pretendard (jsdelivr dynamic-subset CSS) + Gowun Dodum (Google Fonts) for headings | Pretendard/Cafe24 are not on Google Fonts; subsetting is mandatory for Korean. |
| Gallery | PhotoSwipe (vanilla) | Lightbox without a framework runtime. |
| Scroll animation | IntersectionObserver + CSS classes (~30 lines) | Avoid AOS/Framer weight. |
| Map | Kakao Maps JS SDK (domain-whitelisted JS key, 카카오맵 활성화 설정 ON) + **web** links `https://map.kakao.com/link/to/...` and Naver web directions | Custom schemes (`kakaomap://`, `nmap://`) are unreliable in the iOS KakaoTalk WebView; web links open the app when installed. |
| Share | Kakao JS SDK v2 `Kakao.Share.sendDefault` + Open Graph tags + link copy | v1 `Kakao.Link` is EOL 2026-12-31. `og.jpg` (1200×630) in `public/`, absolute URL via `new URL(path, Astro.site)`. |
| RSVP | **Removed** (v0.5) | User does not want to ask guests for attendance or headcount. |
| Guestbook / doljabi poll | **Removed** (v0.4) | User decided the two guest-write features are not worth a backend; optional doljabi/greeting questions can live in the RSVP Google Form instead. |
| Images | `formats: ['webp']` only, gallery ≤ 1080 px, hero preloaded | AVIF slows CI for negligible gain at this size. |
| Deploy | GitHub Actions: `actions/checkout@v7` → `withastro/action@v6` (npm) → `actions/deploy-pages@v5` | Official pattern; lockfile committed. |
| Tooling | Node 24, npm (package-lock.json), Prettier + prettier-plugin-astro, @astrojs/check | Minimal. The Python/uv stack in CLAUDE.md does not apply to this project. |

Alternatives considered: fork `heejin-hwang/mobile-wedding-invitation` (Vite+React, more wedding text to strip, React runtime unnecessary); `emoket/simple-invitation` or `dstyle0210/firstbirthday` (vanilla, no image pipeline).

Dropped from MVP: PIN gate (friction for elderly relatives, zero real security), BGM (licensing + autoplay blocked), base64 obfuscation (misleading; copy buttons need plaintext in the DOM).

## 4. Page structure (top to bottom)

1. **Cover** — hero photo (LCP, preloaded), "소은이의 첫 번째 생일", date
2. **Greeting (인사말)** — parents' message (3 sample texts in research doc)
3. **Baby profile** — name, birth date/time, parents' names, call/SMS buttons
4. **Date & D-day** — calendar highlight + countdown
5. **Growth timeline** — birth → 100 days → 1 year (3–5 photos)
6. **Gallery** — 6–12 photos, lazy, PhotoSwipe lightbox
7. **Venue & map** — Kakao map, address copy, Kakao/Naver web directions links
8. **Transport & parking**
11. **Share / footer** — KakaoTalk share, link copy

All copy/dates/URLs/photo refs come from `src/config/invitation.ts`; PII fields read from `import.meta.env` (build-time secrets).

## 5. Privacy & security

- Reality check: on a public repo, the source tree, photos, and config are visible at `github.com/<user>/<repo>` and indexed by GitHub/Google code search regardless of the site's `robots.txt`; git history keeps everything until the repo is deleted.
- Therefore: **either** private repo (GitHub Pro) **or** public repo with PII (phones, accounts) injected from GitHub Actions secrets at build time and never committed. Photos on the built site are public either way; pick the hero/og image accordingly (og.jpg is cached on Kakao's CDN).
- Site-level: `<meta name="robots" content="noindex, nofollow">` + `robots.txt Disallow: /` (reduces search exposure of the site itself).
- Kakao JS key is public by design; restrict via Web platform domain whitelist.
- No backend: the site holds no visitor-written data.
- **Takedown date**: set a calendar reminder to disable Pages / make the repo private ~2–4 weeks after the event.

## 6. Performance budget

- First-load page weight < 2.5 MB, LCP < 2.5 s on 4G
- Hero ≤ 200 KB WebP, gallery ≤ 1080 px wide with `loading="lazy"`
- Subset fonts; no framework runtime; `100dvh` with `100vh` fallback

## 7. Implementation steps

> Status 2026-09-07: Steps 0–8 implemented; repo made public; site live at https://gunwooyun.github.io/1st-birthday-invitation. Firebase-backed guestbook/doljabi removed. Remaining: Kakao app + secrets by the user (docs/SETUP.md), real photos (~2027-05-03), venue confirmation, device QA.

| Step | Work | Verification |
|------|------|--------------|
| 0 | Decide repo visibility + PII-injection strategy; set takedown reminder; `git init`, pnpm, `pnpm create astro@latest` (minimal), `site`/`base`, Prettier, `.gitignore`, commit lockfile | `pnpm dev` serves hello page |
| 1 | GitHub repo, Pages source = GitHub Actions, `deploy.yml` (checkout v7 / withastro v6 / deploy-pages v5) | Empty page live at Pages URL |
| 1.5 | Kakao Developers: app, JS key, Web platform domain = Pages URL, **카카오맵 활성화 설정 ON**; add OG tags + `public/og.jpg`; send the link to yourself in KakaoTalk | Preview card shows title/image; base path correct |
| 2 | `invitation.ts` schema with **real** hero photo/date/greeting; theme CSS, fonts, layout shell (max-width 450 px, `dvh`) | Renders on iOS/Android emulation |
| 3 | Static sections: cover, greeting, profile, date/D-day, timeline, venue text, transport, gift note, footer | Visual check on 3 devices |
| 4 | Image pipeline (`<Picture>`, webp), gallery + lightbox, growth timeline | Lighthouse mobile ≥ 90, weight within budget |
| 5 | Map: Kakao SDK, web direction links, address copy | Works in KakaoTalk in-app browser (iOS + Android) |
| 6 | Share: `Kakao.Share.sendDefault`, link copy; clear Kakao OG cache after og.jpg changes | Card correct in KakaoTalk |
| 7 | RSVP Google Form + button; D-day countdown; account accordion with secret-injected numbers | Submission lands in Sheet; secrets absent from repo |
| 8 | Privacy pass: noindex, robots.txt, `git log -p` grep for PII | Nothing sensitive in history |
| 9 | QA: iOS Safari, Android Chrome, KakaoTalk in-app, Naver in-app; family review round | Checklist pass |

## 8. Open questions for the user

- GitHub username → user site or project site? (affects `site`/`base`)
- Private repo via GitHub Pro (recommended) or public repo with secret-injected PII?
- Event date, venue, parents' names, hero photo — available now?
- ~~Include account numbers? Guestbook? Doljabi poll?~~ → accounts yes; guestbook/poll removed.
