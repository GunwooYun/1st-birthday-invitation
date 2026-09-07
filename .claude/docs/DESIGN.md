# Project Design Document

> This document tracks design decisions made during conversations.
> Updated automatically by the `design-tracker` skill.

## Overview

Mobile-first single-page invitation for Soeun's first birthday (돌잔치), hosted on GitHub Pages, shared via KakaoTalk. See `.claude/docs/PLAN.md`.

## Architecture

<!-- System structure, components, data flow -->

```
[Component diagram or description here]
```

## Implementation Plan

### Patterns & Approaches

<!-- Design patterns, architectural approaches -->

| Pattern | Purpose | Notes |
|---------|---------|-------|
| | | |

### Libraries & Roles

<!-- Libraries and their responsibilities -->

| Library | Role | Version | Notes |
|---------|------|---------|-------|
| Astro | Static site framework, image pipeline | 6.x | Node 22+, `base` = repo name |
| PhotoSwipe | Gallery lightbox | latest | vanilla, lazy |
| Kakao JS SDK | Maps + Share | v2 | `Kakao.Share.sendDefault`; v1 EOL 2026-12-31 |

### Key Decisions

<!-- Important decisions and their rationale -->

| Decision | Rationale | Alternatives Considered | Date |
|----------|-----------|------------------------|------|
| Astro 6 static | Zero-JS default, build-time WebP/srcset, one-off content page | Vite+React fork, vanilla HTML | 2026-09-07 |
| Google Form for RSVP | Zero backend, private results | Firestore form, Formspree (50/mo limit) | 2026-09-07 |
| No backend: guestbook + doljabi poll removed | User judged the two guest-write features not worth a Firebase setup; static site + Google Form covers RSVP | Firestore Spark, Giscus, Apps Script doPost | 2026-09-07 |
| PII via Actions secrets, never in git | Public repo/git history exposes config; copy buttons need plaintext anyway | base64 obfuscation, PIN gate | 2026-09-07 |
| Web map links over custom schemes | `kakaomap://` unreliable in iOS KakaoTalk WebView | deep-link schemes | 2026-09-07 |

## TODO

<!-- Features to implement -->

- [ ] 

## Open Questions

<!-- Unresolved issues, things to investigate -->

- [ ] 

## Changelog

| Date | Changes |
|------|---------|
| 2026-09-07 | Initial research + plan v0.2 |
| 2026-09-07 | Implemented and deployed; repo public; Firebase features removed (plan v0.4) |
