// =====================================================================
// Single source of truth for all invitation content.
//
// HOW TO CHANGE THE GREETING TEXT
//   Edit the `GREETING` block right below this header. A blank line starts a new
//   paragraph; a single line break stays a line break on the page.
//
// HOW TO CHANGE THE VENUE OR DATE
//   Edit only the `EVENT` and `VENUE` blocks below. Every label on the
//   page (cover, calendar, map, directions, KakaoTalk share text, meta
//   description) is derived from them — nothing else needs touching.
//   The placeholder og.jpg text is generated separately: run
//   `npm run placeholders` after changing these, until a real image
//   replaces public/og.jpg.
//
// Private values (phones) come from environment
// variables — see astro.config.mjs and docs/SETUP.md.
// =====================================================================

// ---------------------------------------------------------------------
// GREETING — 인사말 (edit freely; blank line = new paragraph)
// ---------------------------------------------------------------------
const GREETING = `
처음 품에 안았던 날이 어제 같은데
어느덧 소은이가 첫 생일을 맞이합니다.

지난 일 년, 사랑으로 지켜봐 주신 분들께
감사한 마음을 담아 작은 자리를 마련했습니다.

소은이의 첫걸음을 함께 축복해 주시면
더없이 기쁘겠습니다.
`;

// ---------------------------------------------------------------------
// EVENT — when
// ---------------------------------------------------------------------
const EVENT = {
  // ISO 8601 with the KST offset. TODO: confirm the start time with the venue.
  startAt: '2027-05-09T12:00:00+09:00',
  // Shown after the date, e.g. "낮 12시" / "오후 1시 30분". Derived from startAt when empty.
  timeLabel: '낮 12시',
};

// ---------------------------------------------------------------------
// VENUE — where (not booked yet; may change)
// ---------------------------------------------------------------------
const VENUE = {
  name: '빕스 은평점',
  floor: '롯데몰 은평점 3층',
  address: '서울 은평구 통일로 1050',
  tel: '0507-1434-5338',
  // Keyword used for the Kakao map marker and the Kakao/Naver directions links.
  // Use the exact place name as it appears on map.kakao.com so the search hits the right spot.
  mapKeyword: '빕스 은평점',
  // Fallback map center when the keyword search fails (approximate is fine).
  lat: 37.6373,
  lng: 126.9188,
  // Directions shown under the map. Rewrite freely when the venue changes.
  transport: [
    { label: '지하철', detail: '3호선 구파발역 4번 출구에서 롯데몰 은평 방향으로 도보 약 3분' },
    { label: '버스', detail: '구파발역 · 롯데몰 은평 정류장 하차 (간선 701·704·720, 지선 7211·7723 등)' },
    { label: '자가용', detail: '내비게이션에 "롯데몰 은평" 검색 · 몰 주차장 이용 (매장에서 주차 등록 가능)' },
  ],
};

// ---------------------------------------------------------------------
// FAMILY — who
// ---------------------------------------------------------------------
const BABY = {
  name: '소은',
  fullName: '윤소은',
  birthDate: '2026-05-11',
  // Optional, e.g. "오전 10시 20분". Shown next to the birth date when set.
  birthTime: '',
};

const PARENTS = {
  dad: '윤건우',
  mom: '박서희',
};

// =====================================================================
// Derived values — no need to edit below this line.
// =====================================================================

export type TimelineEntry = { id: 'birth' | 'hundred' | 'first'; label: string; date: string; caption: string };

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const WEEKDAY_LABELS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
const HUNDRED_DAYS_OFFSET = 99; // the 100th day counting the birth day as day 1

function toKst(date: Date): Date {
  return new Date(date.getTime() + KST_OFFSET_MS);
}

function parseIsoDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00+09:00`);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function addYears(date: Date, years: number): Date {
  const kst = toKst(date);
  return new Date(Date.UTC(kst.getUTCFullYear() + years, kst.getUTCMonth(), kst.getUTCDate()) - KST_OFFSET_MS);
}

/** "2027년 5월 9일 일요일" */
export function formatKoreanDate(date: Date): string {
  const kst = toKst(date);
  return `${kst.getUTCFullYear()}년 ${kst.getUTCMonth() + 1}월 ${kst.getUTCDate()}일 ${WEEKDAY_LABELS[kst.getUTCDay()]}`;
}

/** "2027.05.09" */
export function formatDottedDate(date: Date): string {
  const kst = toKst(date);
  return `${kst.getUTCFullYear()}.${String(kst.getUTCMonth() + 1).padStart(2, '0')}.${String(kst.getUTCDate()).padStart(2, '0')}`;
}

/** "낮 12시", "오후 1시 30분" */
function formatKoreanTime(date: Date): string {
  const kst = toKst(date);
  const hours = kst.getUTCHours();
  const minutes = kst.getUTCMinutes();
  const minuteLabel = minutes === 0 ? '' : ` ${minutes}분`;
  if (hours === 12) return `낮 12시${minuteLabel}`;
  if (hours < 12) return `오전 ${hours}시${minuteLabel}`;
  return `오후 ${hours - 12}시${minuteLabel}`;
}

const eventStart = new Date(EVENT.startAt);
const birth = parseIsoDate(BABY.birthDate);
const dateLabel = formatKoreanDate(eventStart);
const timeLabel = EVENT.timeLabel || formatKoreanTime(eventStart);
const whenWhereLabel = `${dateLabel} ${timeLabel} · ${VENUE.name}`;

export const invitation = {
  baby: BABY,
  parents: PARENTS,
  event: {
    startAt: EVENT.startAt,
    dateLabel,
    timeLabel,
    title: `${BABY.name}이의 첫 번째 생일`,
  },
  venue: VENUE,
  // Paragraphs split on blank lines; leading/trailing newlines in the block are ignored.
  greeting: GREETING.trim()
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim()),
  timeline: [
    { id: 'birth', label: '탄생', date: formatDottedDate(birth), caption: '세상에 온 날' },
    {
      id: 'hundred',
      label: '백일',
      date: formatDottedDate(addDays(birth, HUNDRED_DAYS_OFFSET)),
      caption: '백 일의 기적',
    },
    { id: 'first', label: '첫돌', date: formatDottedDate(addYears(birth, 1)), caption: '첫 번째 생일' },
  ] satisfies TimelineEntry[],
  share: {
    title: `${BABY.name}이의 첫 번째 생일에 초대합니다`,
    description: whenWhereLabel,
    ogImage: 'og.jpg',
    kakaoButtonLabel: '초대장 보기',
  },
  meta: {
    title: `${BABY.name}이의 첫 번째 생일`,
    description: `${whenWhereLabel}에서 ${BABY.name}이의 첫돌을 함께 축하해 주세요.`,
    lang: 'ko',
  },
} as const;

export type Invitation = typeof invitation;
