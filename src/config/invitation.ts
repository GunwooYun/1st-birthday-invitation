// Single source of truth for all invitation content.
// Private values (phones, accounts, RSVP URL) come from environment variables — see astro.config.mjs.

export type DoljabiItem = {
  id: string;
  label: string;
  meaning: string;
  emoji: string;
};

export type TimelineEntry = {
  id: 'birth' | 'hundred' | 'first';
  label: string;
  date: string;
  caption: string;
};

export const invitation = {
  baby: {
    name: '소은',
    fullName: '윤소은',
    // TODO: confirm the actual birth date/time.
    birthDate: '2026-05-09',
    birthTime: '',
  },
  parents: {
    dad: '윤건우',
    mom: '박서희',
  },
  event: {
    // ISO 8601 with KST offset. TODO: confirm the start time.
    startAt: '2027-05-09T12:00:00+09:00',
    dateLabel: '2027년 5월 9일 일요일',
    timeLabel: '낮 12시',
    title: '소은이의 첫 번째 생일',
    subtitle: 'Soeun’s First Birthday',
  },
  venue: {
    name: '빕스 은평롯데점',
    floor: '롯데몰 은평 3층',
    address: '서울특별시 은평구 통일로 1050',
    tel: '02-6975-5338',
    // Search keyword used for the map marker and navigation links (more robust than hardcoded coordinates).
    keyword: '빕스 은평롯데점',
    // Fallback center when keyword search fails (approximate, near 구파발역/롯데몰 은평).
    lat: 37.6373,
    lng: 126.9188,
  },
  transport: [
    { label: '지하철', detail: '3호선 구파발역 4번 출구에서 롯데몰 은평 방향으로 도보 약 3분' },
    { label: '버스', detail: '구파발역 · 롯데몰 은평 정류장 하차 (간선 701·704·720, 지선 7211·7723 등)' },
    { label: '자가용', detail: '내비게이션에 "롯데몰 은평" 검색 · 몰 주차장 이용 (매장에서 주차 등록 가능)' },
  ],
  greeting: [
    '처음 품에 안았던 날이 어제 같은데\n어느덧 소은이가 첫 생일을 맞이합니다.',
    '지난 일 년, 사랑으로 지켜봐 주신 분들께\n감사한 마음을 담아 작은 자리를 마련했습니다.',
    '소은이의 첫걸음을 함께 축복해 주시면\n더없이 기쁘겠습니다.',
  ],
  timeline: [
    { id: 'birth', label: '탄생', date: '2026.05.09', caption: '세상에 온 날' },
    { id: 'hundred', label: '백일', date: '2026.08.16', caption: '백 일의 기적' },
    { id: 'first', label: '첫돌', date: '2027.05.09', caption: '첫 번째 생일' },
  ] satisfies TimelineEntry[],
  doljabi: {
    title: '소은이는 무엇을 잡을까요?',
    description: '돌잡이 결과를 미리 맞혀 보세요! 투표는 한 번만 가능합니다.',
    items: [
      { id: 'thread', label: '실', meaning: '무병장수', emoji: '🧵' },
      { id: 'money', label: '돈', meaning: '부와 풍요', emoji: '💰' },
      { id: 'pencil', label: '연필', meaning: '학문과 지혜', emoji: '✏️' },
      { id: 'stethoscope', label: '청진기', meaning: '의술과 배려', emoji: '🩺' },
      { id: 'mic', label: '마이크', meaning: '끼와 재능', emoji: '🎤' },
      { id: 'gavel', label: '판사봉', meaning: '정의와 명예', emoji: '⚖️' },
      { id: 'ball', label: '공', meaning: '건강과 활력', emoji: '⚽' },
    ] satisfies DoljabiItem[],
  },
  gift: {
    note: '참석만으로도 큰 축하가 됩니다.\n마음을 전하고 싶으신 분들을 위해 계좌번호를 남겨 둡니다.',
  },
  share: {
    title: '소은이의 첫 번째 생일에 초대합니다',
    description: '2027년 5월 9일 일요일 낮 12시 · 빕스 은평롯데점',
    ogImage: 'og.jpg',
    kakaoButtonLabel: '초대장 보기',
  },
  meta: {
    title: '소은이의 첫 번째 생일',
    description: '2027년 5월 9일 일요일 낮 12시, 빕스 은평롯데점에서 소은이의 첫돌을 함께 축하해 주세요.',
    lang: 'ko',
  },
} as const;

export type Invitation = typeof invitation;
