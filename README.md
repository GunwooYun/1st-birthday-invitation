# 소은이 돌잔치 모바일 초대장

2027년 5월 9일 일요일, 빕스 은평점에서 열리는 소은이의 첫 생일 초대장입니다.

- 사이트: https://gunwooyun.github.io/1st-birthday-invitation
- 저장소: `GunwooYun/1st-birthday-invitation` (공개)
- 배포: `main` 브랜치에 푸시하면 GitHub Actions가 자동으로 빌드·배포

이 문서는 **내용을 고치고, 확인하고, 배포하는 방법**을 다룹니다. 카카오 앱 등록이나 시크릿 같은 최초 1회 설정은 `docs/SETUP.md`에 있습니다.

---

## 1. 한눈에 보기

| 하고 싶은 일                | 고칠 곳                                        | 그다음                                        |
| --------------------------- | ---------------------------------------------- | --------------------------------------------- |
| 인사말 문구 바꾸기          | `src/config/invitation.ts` → `GREETING`        | 커밋 → 푸시                                   |
| 행사 날짜·시간 바꾸기       | `src/config/invitation.ts` → `EVENT`           | 커밋 → 푸시                                   |
| 장소·주소·교통 안내 바꾸기  | `src/config/invitation.ts` → `VENUE`           | 커밋 → 푸시                                   |
| 아기 이름·출생일, 부모 이름 | `src/config/invitation.ts` → `BABY`, `PARENTS` | 커밋 → 푸시                                   |
| 사진 바꾸기                 | `src/assets/photos/` 같은 파일명으로 덮어쓰기  | `npm run photos` → `npm run og` → 커밋 → 푸시 |
| 전화번호 바꾸기             | GitHub 시크릿 `PHONE_DAD`, `PHONE_MOM`         | Actions에서 워크플로 재실행                   |
| 말 캐릭터 색·모양           | `src/components/Horse.astro`                   | 커밋 → 푸시                                   |

푸시 후 1~2분이면 사이트에 반영됩니다. 카카오톡 미리보기 이미지를 바꿨을 때만 카카오 캐시 초기화가 추가로 필요합니다(5절).

---

## 2. 처음 한 번: 개발 환경 준비

필요한 것은 Node.js 22 이상과 git뿐입니다. 이 PC에는 Node 24가 설치되어 있습니다.

```bash
git clone git@github.com:GunwooYun/1st-birthday-invitation.git
cd 1st-birthday-invitation
npm install
cp env.example .env      # 로컬 미리보기용 값 채우기 (아래 참고)
```

`.env`는 git에 올라가지 않는 로컬 전용 파일입니다. 로컬에서 지도·전화 버튼까지 보고 싶으면 값을 채우고, 문구·사진만 확인할 거면 비워 둬도 됩니다.

```
PUBLIC_KAKAO_JS_KEY=카카오 JavaScript 키
PHONE_DAD=010-0000-0000
PHONE_MOM=010-0000-0000
```

---

## 3. 내용 수정하기

모든 문구와 날짜는 **`src/config/invitation.ts` 한 파일**에 있습니다. 파일 위쪽의 블록만 고치면 되고, "Derived values" 아래는 손대지 않아도 됩니다.

### 3-1. 인사말

```ts
const GREETING = `
처음 품에 안았던 날이 어제 같은데
어느덧 소은이가 첫 생일을 맞이합니다.

지난 일년, 사랑으로 지켜봐 주신 분들께
감사한 마음을 담아 작은 자리를 마련했습니다.
`;
```

- 빈 줄을 넣으면 문단이 나뉩니다.
- 그냥 줄바꿈은 화면에서도 줄바꿈으로 나옵니다.
- 백틱(`` ` ``) 사이에 자유롭게 쓰면 되고, 따옴표나 특수문자를 신경 쓸 필요 없습니다.

### 3-2. 날짜와 시간

```ts
const EVENT = {
  startAt: '2027-05-09T12:00:00+09:00', // 연-월-일T시:분:초+09:00
  timeLabel: '낮 12시', // 비워 두면 startAt에서 자동 생성
};
```

`startAt` 하나로 커버 날짜, 달력 제목과 강조 표시, D-day 카운트다운, 카카오톡 공유 문구가 모두 바뀝니다. 시간이 오후 1시 30분이면 `T13:30:00`으로 적고 `timeLabel`을 `'오후 1시 30분'`으로 씁니다.

### 3-3. 장소

```ts
const VENUE = {
  name: '빕스 은평점',
  floor: '롯데몰 은평점 3층',
  address: '서울 은평구 통일로 1050',
  tel: '0507-1434-5338',
  mapKeyword: '빕스 은평점', // 카카오맵에서 검색했을 때 정확히 그 매장이 나오는 이름
  lat: 37.6373, // 검색 실패 시 지도 중심 (대략값이어도 됨)
  lng: 126.9188,
  transport: [
    { label: '지하철', detail: '3호선 구파발역 4번 출구에서 도보 약 3분' },
    { label: '버스', detail: '...' },
    { label: '자가용', detail: '...' },
  ],
};
```

장소가 바뀌면 `mapKeyword`를 꼭 같이 바꿔야 지도 마커와 길찾기 버튼이 새 장소를 가리킵니다. `transport`는 줄을 늘리거나 줄여도 됩니다. 장소명은 커버, 달력 카드, 오시는 길, 카카오톡 공유 문구에 한꺼번에 반영됩니다.

### 3-4. 아기·부모 정보

```ts
const BABY = { name: '소은', fullName: '윤소은', birthDate: '2026-05-11', birthTime: '' };
const PARENTS = { dad: '윤건우', mom: '박서희' };
```

`birthDate`를 바꾸면 성장 타임라인의 백일(출생 100일째)과 첫돌 날짜가 자동으로 다시 계산됩니다. `birthTime`에 `'오전 10시 20분'`처럼 적으면 출생일 옆에 표시됩니다.

### 3-5. 사진

`src/assets/photos/`에 **같은 파일명**으로 덮어씁니다.

| 파일                                                           | 용도                          | 권장                    |
| -------------------------------------------------------------- | ----------------------------- | ----------------------- |
| `hero.jpg`                                                     | 커버 대표 사진                | 세로 사진 (3:4)         |
| `timeline-birth.jpg`, `timeline-100.jpg`, `timeline-first.jpg` | 성장 타임라인 (원형으로 잘림) | 얼굴이 가운데 오는 사진 |
| `gallery-01.jpg`, `gallery-02.jpg`, …                          | 갤러리 (파일명 순, 개수 자유) | 세로 사진 (4:5)         |

사진을 넣은 뒤 반드시 두 명령을 실행합니다.

```bash
npm run photos   # 회전 보정, 위치정보 등 EXIF 제거, 긴 변 2000px로 축소
npm run og       # 대표 사진으로 카카오톡 미리보기 이미지(public/og.jpg) 생성
```

- 휴대폰 사진은 JPG로 내보내야 합니다. iPhone HEIC는 읽지 못합니다.
- `npm run photos`는 공개 저장소에 촬영 위치가 올라가지 않도록 메타데이터를 지웁니다. **커밋 전에 꼭 실행**하세요.
- 갤러리 사진을 늘리려면 `gallery-08.jpg`처럼 번호를 이어 붙이고, 줄이려면 파일을 지우면 됩니다.
- 다른 사진으로 미리보기를 만들려면 `node scripts/make-og.mjs 경로/사진.jpg`.

### 3-6. 전화번호

전화번호는 코드에 없고 GitHub 시크릿에만 있습니다. 바꾸려면:

```bash
gh secret set PHONE_DAD --repo GunwooYun/1st-birthday-invitation --body "010-1234-5678"
gh secret set PHONE_MOM --repo GunwooYun/1st-birthday-invitation --body "010-1234-5678"
```

시크릿은 푸시가 아니라 **빌드할 때** 읽히므로, 바꾼 뒤 Actions에서 워크플로를 한 번 재실행해야 합니다(4-3절).

### 3-7. 말 캐릭터

`src/components/Horse.astro` 안의 SVG를 고칩니다. 색은 `fill="#f8d9c6"` 같은 값이고, `variant`가 `plain` / `party`(고깔모자) / `balloon`(풍선) 세 가지입니다. 커버·구분선·푸터가 같은 컴포넌트를 쓰므로 한 번 고치면 모두 바뀝니다. 다른 스타일 후보는 `src/components/HorseCandidates.astro`에 있습니다.

### 3-8. 사이트 아이콘 (파비콘)

브라우저 탭과 홈 화면에 보이는 아이콘은 말 얼굴 배지이며, `public/` 폴더의 파일 네 개입니다.

| 파일                          | 용도                                           |
| ----------------------------- | ---------------------------------------------- |
| `public/favicon.svg`          | PC·모바일 브라우저 탭 (원본, 어떤 크기든 선명) |
| `public/favicon-32.png`       | SVG를 지원하지 않는 구형 브라우저용            |
| `public/icon-192.png`         | 안드로이드 홈 화면 추가                        |
| `public/apple-touch-icon.png` | iOS 홈 화면 추가 (연분홍 배경 180px)           |

바꾸려면 `favicon.svg`를 고친 뒤 PNG 세 개를 다시 만듭니다.

```bash
node -e "
const sharp=require('sharp');const svg=require('fs').readFileSync('public/favicon.svg');
(async()=>{
  await sharp(svg).resize(32,32).png().toFile('public/favicon-32.png');
  await sharp(svg).resize(192,192).png().toFile('public/icon-192.png');
  const fg=await sharp(svg).resize(150,150).png().toBuffer();
  await sharp({create:{width:180,height:180,channels:4,background:'#fff1f4'}}).composite([{input:fg,gravity:'centre'}]).png().toFile('public/apple-touch-icon.png');
})()"
```

아이콘은 브라우저가 오래 캐시하므로, 바꾼 뒤에는 새 탭에서 열거나 강력 새로고침(Ctrl+F5)으로 확인합니다.

---

## 4. 확인하고 배포하기

### 4-1. 로컬에서 미리보기

```bash
npm run dev
```

http://localhost:4321/1st-birthday-invitation/ 을 브라우저에서 열고, 개발자 도구의 모바일 보기(폭 390px 정도)로 확인합니다. 파일을 저장하면 바로 새로고침됩니다. 지도는 카카오 키가 `.env`에 있어야 보입니다.

배포될 결과물 그대로 보고 싶으면:

```bash
npm run build      # dist/ 폴더에 정적 파일 생성
npm run preview    # 빌드 결과를 http://localhost:4321/1st-birthday-invitation/ 에서 서빙
```

### 4-2. 검사

```bash
npm run check      # 타입·문법 검사 (0 errors 여야 함)
npm run format     # 코드 정렬
```

빌드가 실패하면 대부분 `invitation.ts`의 따옴표·쉼표 누락입니다. `npm run check`가 파일과 줄 번호를 알려줍니다.

### 4-3. 배포

```bash
git add -A
git commit -m "인사말 수정"
git push
```

푸시하면 GitHub Actions가 자동으로 실행됩니다. 진행 상황은 https://github.com/GunwooYun/1st-birthday-invitation/actions 에서 볼 수 있고, 초록색 체크가 뜨면 1분 안에 사이트에 반영됩니다.

수동으로 다시 배포해야 할 때(시크릿을 바꿨을 때 등):

- 웹: Actions → "Deploy to GitHub Pages" → **Run workflow** → Run
- 터미널: `gh workflow run "Deploy to GitHub Pages" --repo GunwooYun/1st-birthday-invitation`

배포 뒤에는 휴대폰에서 링크를 열어 보고, 카카오톡으로 링크를 나에게 보내 미리보기 카드와 인앱 브라우저 화면을 확인합니다.

---

## 5. 카카오톡 미리보기 갱신

`public/og.jpg`(미리보기 이미지)나 공유 문구를 바꾸면 카카오 쪽 캐시 때문에 예전 카드가 계속 보일 수 있습니다.

1. https://developers.kakao.com/tool/debugger/sharing 접속
2. `https://gunwooyun.github.io/1st-birthday-invitation` 입력 → **초기화**

---

## 6. 문제가 생겼을 때

| 증상                               | 원인·해결                                                                                                            |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 지도가 안 뜨고 빈 공간만 있음      | 카카오 개발자 콘솔의 JavaScript 키 도메인에 `https://gunwooyun.github.io`가 있는지, 카카오맵 사용 설정이 ON인지 확인 |
| 전화·문자 버튼이 안 보임           | `PHONE_DAD`, `PHONE_MOM` 시크릿이 비어 있음 → 등록 후 워크플로 재실행                                                |
| 사진이 옆으로 누움                 | `npm run photos`를 안 돌림                                                                                           |
| Actions가 빨간색으로 실패          | Actions 로그의 build 단계 확인. 대개 `invitation.ts` 문법 오류 → `npm run check`로 로컬에서 재현                     |
| 카카오톡 카드에 예전 사진이 보임   | 5절의 캐시 초기화                                                                                                    |
| 로컬에서 CSS가 안 먹고 글자만 보임 | 주소 끝에 `/1st-birthday-invitation/`이 빠짐                                                                         |

---

## 7. 폴더 구조

```
src/config/invitation.ts      모든 문구·날짜·장소 (여기만 고치면 됨)
src/config/site.ts            하위 경로(/1st-birthday-invitation) URL 헬퍼
src/assets/photos/            사진 원본 (빌드 때 WebP로 변환)
src/components/               섹션별 화면 (Cover, Greeting, Profile, Calendar, Timeline, Gallery, Venue, Share, Horse)
src/scripts/                  지도·공유·복사·D-day 동작
src/styles/global.css         색·글꼴·공통 스타일
public/og.jpg                 카카오톡 미리보기 이미지 (npm run og로 생성)
public/favicon.svg 등         사이트 아이콘 (말 얼굴 배지, 3-8절)
scripts/                      사진 정규화·og 생성·임시 이미지 스크립트
.github/workflows/deploy.yml  자동 배포 설정
docs/SETUP.md                 최초 1회 설정 (카카오 앱, 시크릿, Pages)
```

## 8. 기술 스택

Astro 7 (정적 빌드) · PhotoSwipe (사진 확대) · Kakao Maps/Share JS SDK v2 · GitHub Actions → GitHub Pages. 서버나 데이터베이스는 없습니다.

## 9. 행사가 끝난 뒤

- 저장소 Settings → Pages → **Unpublish site** 로 사이트를 내리거나, 저장소를 삭제합니다.
- 카카오 개발자 콘솔에서 앱을 삭제합니다.
- 저장소가 공개이므로, 사진을 계속 둘지 결정합니다. 삭제하더라도 커밋 이력에는 남으므로 완전히 지우려면 저장소를 삭제해야 합니다.
