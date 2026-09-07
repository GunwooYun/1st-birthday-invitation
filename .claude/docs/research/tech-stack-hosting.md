<!-- Research date: 2026-09-07 | agy model: gemini-3.1-pro-high -->

# Research Report: Building a Korean Mobile Invitation on GitHub Pages

This report provides a comprehensive guide to building a modern Korean mobile invitation (wedding or first-birthday "돌잔치") as a static site hosted on GitHub Pages.

## 1. Open-Source GitHub Repositories

Below are some of the most popular and relevant repositories for Korean mobile invitations. They vary in complexity, design, and target event.

| Repository | Framework | Key Features | Forking for 돌잔치 |
| :--- | :--- | :--- | :--- |
| **[S-jooyoung/WEDDING_INVITATION](https://github.com/S-jooyoung/WEDDING_INVITATION)** | React / TypeScript | Kakao Map, Account Copy, Gallery, BGM, Kakao Share | **Medium:** Strongly wedding-oriented but data is separated (`src/data/invitation.ts`), so replacing terms/assets is straightforward. |
| **[juhonamnam/wedding-invitation](https://github.com/juhonamnam/wedding-invitation)** | React | Guestbook, RSVP, Map, Gallery, GitHub Pages ready | **Medium:** Needs content modification but provides a solid feature set for tracking attendees. |
| **[emoket/simple-invitation](https://github.com/emoket/simple-invitation)** | Vanilla HTML/CSS/JS | Simple, Motion Effects, Photo Gallery | **Easiest:** Extremely simple and lightweight. Perfect for a quick 돌잔치 invite without dealing with build steps. |
| **[dstyle0210/firstbirthday](https://github.com/dstyle0210/firstbirthday)** | Vanilla / jQuery | Designed specifically for 돌잔치 | **Easiest:** Already tailored for a first-birthday party, requiring minimal structural changes. |
| **[uyu423/react-wedding-card](https://github.com/uyu423/react-wedding-card)** | React.js | `config.js` data injection, Simple, Gallery | **Medium:** Easy to configure via a single file, but needs asset swaps for a birthday event. |
| **[heejin-hwang/mobile-wedding-invitation](https://github.com/heejin-hwang/mobile-wedding-invitation)** | React / Vite | Confetti, Kakao Map, Fast Build | **Medium:** The confetti effect is great for birthdays, but text needs updating. |

*(Note: Star counts and last update dates vary, but most React ones are actively maintained. Vanilla HTML ones tend to be older but perfectly functional since HTML/CSS doesn't deprecate like npm packages).*

## 2. Framework Comparison

Since the site is a single-page, image-heavy application (~10 sections) that must load instantly via the KakaoTalk in-app browser, choosing the right framework is crucial.

| Framework | Build Complexity | Bundle Size | Image Optimization | Rationale for a One-Off Site |
| :--- | :--- | :--- | :--- | :--- |
| **Plain HTML/CSS/JS** | None | Tiny | Manual (requires offline optimization) | **Great** if you don't need complex state (like a guestbook UI) and want zero maintenance. |
| **Vite + React (or Preact)** | Low-Medium | Medium (~100-200kb) | Good via Vite plugins (`vite-imagetools`) | **Very Good.** Huge ecosystem of components (galleries, maps). Preact is recommended over React for a smaller bundle. |
| **Astro** | Medium | Tiny (Zero-JS by default) | Built-in (excellent `<Image />` component) | **Outstanding.** Delivers static HTML with JS only where needed (islands). Perfect for content-heavy static sites. |
| **Next.js (Static Export)**| High | Large | Limited in static export (`next/image` needs 3rd party loader) | **Overkill.** Next.js image optimization relies on a Node.js server. Static export is clunky for this specific use case. |
| **SvelteKit (Static)** | Medium | Small | Built-in via `@sveltejs/enhanced-img` | **Excellent** if you know Svelte. Extremely fast, lightweight, and easy to animate. |

**Final Recommendation:** Use **Vite + React** if you are modifying an existing template or want access to the largest pool of copy-pasteable components. Use **Astro** if you are building from scratch, as it provides the best out-of-the-box performance and image optimization for a static site.

## 3. Standard Libraries & Services

*   **Maps (Kakao Maps JS SDK):** The standard for Korean invitations.
    *   *Requirements:* You must register an App Key on [Kakao Developers](https://developers.kakao.com/) and whitelist your GitHub Pages domain (e.g., `https://username.github.io`). It works perfectly on GitHub Pages.
    *   *Fallbacks:* Naver Maps is a good alternative. Google Maps iframe embed is the easiest fallback if you don't want to deal with API keys, but it is less familiar to Korean users.
*   **KakaoTalk Share (Kakao Link):** Uses `Kakao.Share.sendDefault`. Essential for a good preview in chat rooms.
    *   *Open Graph:* Ensure `<meta property="og:title">`, `og:image`, and `og:description` are set for standard link previews when the URL is copy-pasted.
*   **Image Galleries:**
    *   [Swiper](https://swiperjs.com/): Best for swipeable carousels.
    *   [PhotoSwipe](https://photoswipe.com/): Best for fullscreen lightbox zooming.
    *   [yet-another-react-lightbox](https://yet-another-react-lightbox.com/): Best if using React.
*   **Animations:** [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/) is the lightest and easiest for fade-ins as users scroll. Avoid Framer Motion unless using React, as it adds significant bundle size.
*   **Typography:** [Pretendard](https://github.com/orioncactus/pretendard) is the modern standard (loads via CDN). Noto Sans KR or Gowun Dodum (Google Fonts) are great alternatives.
*   **Utilities:**
    *   *Copy to Clipboard:* Use the native `navigator.clipboard.writeText()` for account numbers.
    *   *BGM:* Autoplay is blocked by modern mobile browsers (iOS Safari, Chrome Android) without user interaction. You must implement a visible "Play Music" button.
*   **Image Optimization:** Use WebP or AVIF formats. If using Vite, use `vite-imagetools` to automatically generate responsive `srcset` arrays to save bandwidth on mobile.

## 4. Serverless Backends for RSVP & Guestbook

GitHub Pages is strictly static. To handle RSVP forms, guestbooks, or a 돌잡이 poll, you need a serverless backend.

| Solution | Setup Effort | Cost | Spam/Abuse Risk | Suitability (50-150 guests) |
| :--- | :--- | :--- | :--- | :--- |
| **Google Forms + Sheets** | Very Low | Free | Low (if using Form UI), High (if custom API) | **Excellent.** Easiest way to track RSVPs. For a custom UI, you can use Apps Script (`doPost`), but it requires some coding. |
| **Firebase Firestore** | Medium | Free Tier | Medium (requires Security Rules) | **Great** for a real-time guestbook. Generous free tier perfectly covers a one-off event. |
| **Supabase** | Medium-High | Free Tier | Medium (requires RLS policies) | **Good**, but overkill unless you specifically want a PostgreSQL relational database. |
| **Giscus / Utterances** | Low | Free | Zero (requires GitHub login) | **Poor** for family events. Guests (grandparents, non-devs) will not have GitHub accounts to leave a guestbook comment. |
| **Formspree** | Very Low | Free (50/mo limit) | Low | **Poor**. The free tier limit (50 submissions) is too low for 150 guests. |

**Recommendation:** Use **Firebase Firestore** for a custom, real-time guestbook UI (no login required, just basic rate-limiting rules). Use **Google Forms (embedded or via Apps Script)** for private RSVP collection.

## 5. GitHub Pages Hosting Guide

*   **User Site vs. Project Site:**
    *   *User Site:* Repo named `username.github.io`. URL: `https://username.github.io`. Easiest setup.
    *   *Project Site:* Repo named `invitation`. URL: `https://username.github.io/invitation/`.
    *   *Crucial Step for Project Sites:* If using Vite/React/Astro, you **must** set the base path configuration (e.g., in `vite.config.js`: `base: '/invitation/'`) so assets load correctly.
*   **Deployment Method:** Use **GitHub Actions** (`actions/upload-pages-artifact` + `actions/deploy-pages`). It is cleaner than maintaining a messy `gh-pages` branch.
*   **Custom Domain & HTTPS:** You can add a custom domain (e.g., `baby-minjun.com`) in Settings. GitHub automatically provisions a free Let's Encrypt SSL certificate.
*   **Limits:** 1 GB site size, 100 GB/month bandwidth. An invitation will never hit this unless you host uncompressed 4K videos.
*   **Search Engine Privacy:** To prevent the invitation from appearing on Google (highly recommended for privacy):
    1.  Add a `robots.txt` file: `User-agent: * \n Disallow: /`
    2.  Add a meta tag: `<meta name="robots" content="noindex, nofollow">`
*   **Handling API Keys:** Kakao App Keys are **public by design**. They go directly into your frontend code (e.g., `VITE_KAKAO_KEY`). You protect them by going to Kakao Developers and strictly whitelisting only your GitHub Pages URL so the key cannot be stolen and used elsewhere.

## 6. Performance Budget for Mobile

Korean mobile users expect instant loading, especially when opening links inside the KakaoTalk in-app browser.

*   **Target Page Weight:** Keep it under **2.5 MB** total.
*   **Largest Contentful Paint (LCP):** Target < 2.5 seconds. The hero image (top photo) must be aggressively compressed, saved as WebP/AVIF, and **preloaded** (`<link rel="preload" as="image" href="...">`).
*   **Image Gallery:** A gallery with 15-20 photos can easily balloon to 20MB if not careful.
    *   Resize all images to max 1080px width (mobile screens don't need more).
    *   **Lazy Loading is mandatory:** Add `loading="lazy"` to all `<img>` tags below the fold.
*   **Fonts:** Subset your fonts. A full Korean font (like Noto Sans KR) is over 2MB. Use a CDN that serves subsetted web fonts (like Google Fonts) to bring it down to ~100kb.

---
**Sources:**
- [Kakao Developers](https://developers.kakao.com/)
- [Vite Static Deploy Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Firebase Pricing & Tiers](https://firebase.google.com/pricing)
</content>
