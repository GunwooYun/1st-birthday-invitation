> Researched 2026-09-07 via agy (Antigravity CLI) — model: gemini-3.1-pro-high

# Research Report: Korean Mobile Invitations (모바일 청첩장 & 돌잔치 초대장)

Mobile invitations have become the standard in Korea for major life events like weddings (청첩장) and first-birthday parties (돌잔치). They offer dynamic features, multimedia content, and seamless integration with navigation apps and messengers like KakaoTalk.

This report outlines the standard structures, differences between event types, UX best practices, privacy considerations for static hosting (like GitHub Pages), and feature prioritization.

---

## 1. Standard Section Structure

Popular Korean mobile invitation builders (e.g., 바른손카드, 더카드, 보자기카드, 페이퍼팝, and KakaoTalk-integrated services) typically follow a highly standardized, modular single-column vertical scroll structure.

### Typical Order of Sections:
1. **Cover / Intro**: Main hero image, event title, couple's/baby's name, and the core date/time/location.
2. **Greeting Text (인사말)**: A formal or sentimental message inviting guests.
3. **Host Information (혼주/가족 정보)**: Names of parents (for weddings) or parents and baby (for first birthdays).
4. **Contact (연락처)**: Call and SMS buttons linking directly to the hosts.
5. **Date & Time (일시)**: Detailed calendar view and a D-Day countdown timer.
6. **Venue & Map (오시는 길)**: Address details, an embedded map, and one-click deep links to navigation apps (**Kakao Map, Naver Map, T map**).
7. **Transport & Parking (교통 및 주차 안내)**: Public transit routes, parking availability, and shuttle bus info.
8. **Photo Gallery (갤러리)**: A grid or masonry layout of photos, usually supporting swipeable full-screen lightbox views.
9. **Account Numbers (마음 전하실 곳)**: Bank account details for sending gifts (축의금/돌반지). Usually hidden behind an accordion toggle and features a one-click **"Copy to Clipboard"** button.
10. **RSVP (참석 여부 확인)**: A form for guests to confirm attendance and dietary restrictions.
11. **Guestbook (방명록)**: A comment section for guests to leave congratulatory messages.
12. **Share (공유하기)**: Buttons to share the invitation via KakaoTalk (with rich link previews) or copy the URL.
13. **Background Music (BGM)**: Optional audio player (often paused by default due to mobile browser autoplay restrictions).

---

## 2. 돌잔치 (First Birthday) vs. Wedding Invitations

While the core structure is similar, 돌잔치 초대장 (Doljanchi invitations) have specific cultural and functional differences tailored to celebrating a baby's first year.

### Key Differences & Specific Features:
* **Focus on the Baby**: Includes the baby's name, exact birth date/time, and physical milestones.
* **Growth Timeline (성장 일기)**: A visual timeline or slider showing the baby's growth from birth, 50 days, 100 days, to 1 year.
* **Doljabi Poll (돌잡이 이벤트)**: An interactive poll where guests guess what item the baby will pick (e.g., stethoscope = doctor, microphone = entertainer, money = wealth). This builds anticipation and is often tied to a prize draw at the event.
* **Gift Policy & Dress Code**: Often includes specific phrasing regarding gifts.
  * e.g., "축의금 대신 마음만 부탁드립니다" (Please bring only your warm hearts, no monetary gifts).
* **Account Numbers**: The inclusion of bank accounts is becoming more common but is still a sensitive topic. It is highly recommended to place this inside an accordion titled "마음 전하실 곳" (Where to send your heart) so it is not immediately visible.

### Sample Greeting Texts (인사말) for 돌잔치:
* **Formal (격식 있는 문구):**
  > "저희 아이 OO가 어느덧 첫 생일을 맞이하였습니다. 귀한 걸음 하시어 축복해 주시면 감사하겠습니다."
  > *(Our child OO has already reached their first birthday. We would be grateful if you could grace us with your presence and blessings.)*
* **Sentimental (감성적인 문구):**
  > "처음 안았던 날이 어제 같은데 벌써 일 년이 지났습니다. 이 벅찬 기쁨을 소중한 분들과 함께 나누고 싶습니다."
  > *(The day we first held them feels like yesterday, but a year has already passed. We wish to share this overwhelming joy with our precious ones.)*
* **Witty (재치 있는 문구):**
  > "1년 차 신입 인간 OO의 수습 종료 파티에 초대합니다. 오셔서 축하해 주세요!"
  > *(You are invited to the end-of-probation party for 1-year-old rookie human OO. Please come and celebrate!)*

### Design & Aesthetics (돌잔치):
* **Themes**: Kid-friendly, pastel colors, soft watercolor illustrations, or cute character themes.
* **Typography**: Friendly, highly legible fonts are preferred.
  * **Pretendard / Apple SD Gothic Neo**: For clean, modern UI and numbers.
  * **Nanum Square / Nanum Bareun Pen**: For friendly headers.
  * **Gowun Dodum (고운돋움)**: For a soft, elegant touch.
  * **Cafe24 Fonts (e.g., Ssurround)**: For playful accent text.

---

## 3. Mobile UX Best Practices

Because 99% of these invitations are opened on mobile devices via messenger apps, UX optimization is critical.

* **Layout & Dimensions**: Single-column vertical scroll. For desktop viewing, cap the `max-width` at **400px - 450px** and center the container to simulate a mobile screen.
* **Viewport Units (iOS Safari Quirks)**: Use `dvh` (dynamic viewport height) instead of `100vh` for cover sections to prevent the UI from being hidden by Safari's address bar.
* **Performance**: Implement image lazy loading (`loading="lazy"`) and compress images heavily (WebP format). A tight image weight budget is essential because guests are often on cellular data.
* **Animations**: Subtle, scroll-triggered fade-in or slide-up animations (using Intersection Observer) keep the user engaged without being overwhelming.
* **Audio Autoplay**: iOS and Android strictly block autoplaying audio without user interaction. Provide a clear "Play BGM" button if music is included.
* **Copy to Clipboard UX**: When copying account numbers or addresses, immediately show a toast notification (e.g., "복사되었습니다" - Copied) so the user knows the action succeeded.
* **KakaoTalk In-App Browser**: Test heavily within the KakaoTalk in-app browser, as it has distinct caching and rendering behaviors compared to native Safari/Chrome.

### Open Graph & KakaoTalk Link Previews
When the invitation link is pasted into KakaoTalk, it scrapes the Open Graph metadata to generate a rich preview card.
* **og:image**: Crucial. Use a size of **800x400px** or **1200x630px** (1.91:1 ratio) to ensure it renders correctly in KakaoTalk without cropping.
* **og:title & og:description**: Keep these concise (e.g., Title: "OOO ♥ OOO 결혼합니다", Desc: "10월 25일 토요일 오후 1시, 신라호텔").
* **Cache Clearing**: If you update the OG metadata, you **must** clear the cache using the [Kakao Developers OG Cache Clear Tool](https://developers.kakao.com/tool/clear/og), otherwise KakaoTalk will keep showing the old preview.

---

## 4. Privacy Considerations for GitHub Pages

Hosting a mobile invitation on a public static host like GitHub Pages introduces significant privacy risks. By default, the source code and assets (baby photos, phone numbers, bank accounts, home addresses) are publicly accessible.

### Common Mitigations:
1. **Robots.txt & Noindex (Basic)**:
   Add `<meta name="robots" content="noindex, nofollow">` to the HTML `<head>` to prevent Google/Naver from indexing the page.
2. **Unlisted URLs (Security through Obscurity)**:
   Host the site on a random, unguessable path (e.g., `yourdomain.com/invitation/a7b8c9d0/`) rather than the root domain.
3. **Password / PIN Gate (Client-Side)**:
   Implement a simple JavaScript prompt asking for a 4-digit PIN (e.g., the baby's birthdate) before rendering the DOM.
   > [!WARNING]
   > Client-side PINs are not truly secure; anyone inspecting the source code can bypass them or read the hardcoded data. However, it effectively deters casual snooping and non-technical guests.
4. **Obfuscation**:
   Base64 encode sensitive strings (like bank account numbers or phone numbers) in the JavaScript and decode them at runtime. Again, not cryptographically secure, but stops simple text scrapers.
5. **Private Repo + CI/CD**:
   Keep your source code in a Private GitHub Repository. Use GitHub Actions to build the static site and deploy *only* the compiled assets to the `gh-pages` branch. Note that the `gh-pages` branch itself remains public, so assets are still exposed.
6. **Expiring Content (Crucial)**:
   Set a calendar reminder to **delete the repository or unpublish the page** immediately after the event (or a week later). Do not leave personal data hosted indefinitely.

---

## 5. Feature Prioritization (돌잔치 Focus)

If building a custom invitation, prioritize features based on guest utility versus development effort.

| Priority | Feature | Description | Importance |
| :--- | :--- | :--- | :--- |
| **Must-Have** | **Core Info & Map** | Date, Time, Venue Name, Address, and deep links to Naver/Kakao Maps. | Critical. Guests need to know when and where to go. |
| **Must-Have** | **Greeting Text** | Warm invitation message from the parents. | Sets the tone. |
| **Must-Have** | **Baby Photos** | Minimum 3-5 high-quality photos. | Essential for a first birthday. |
| **Must-Have** | **Transport/Parking** | Clear instructions for drivers and public transit. | Prevents phone calls on the day of the event. |
| **Must-Have** | **Contact Buttons** | Direct Call/SMS links to the parents. | Essential for lost guests. |
| **Nice-to-Have** | **Account Numbers** | Foldable accordion with "Copy" button. | Highly useful, though some prefer omitting it for small parties. |
| **Nice-to-Have** | **RSVP Form** | Simple form to collect attendance and pax count. | Useful for catering estimates. |
| **Nice-to-Have** | **Doljabi Poll** | Interactive voting system. | Fun engagement, but requires backend/database (e.g., Firebase/Supabase). |
| **Nice-to-Have** | **Guestbook** | Comment section. | Sentimental value, also requires a backend. |
| **Nice-to-Have** | **Growth Timeline** | Visual representation of the first year. | Cute, but requires more design effort. |

---
**Sources & References:**
* Kakao Developers Open Graph Cache Tool: [developers.kakao.com](https://developers.kakao.com/tool/clear/og)
* General UX and Structure references synthesized from popular Korean invitation builders (Barunson Card, Bojagi Card) and web development best practices for mobile sharing.
