# 설정 가이드 (배포 전 체크리스트)

순서대로 진행하면 됩니다. 각 단계에서 얻은 값은 **GitHub 시크릿**(6단계)에 넣습니다.

## 1. 카카오 개발자 (지도 + 카카오톡 공유)

1. https://developers.kakao.com → 내 애플리케이션 → **앱 추가** (앱 이름: 소은이 돌잔치 초대장)
2. 앱 설정 → 앱 키 → **JavaScript 키** 복사 → `PUBLIC_KAKAO_JS_KEY`
3. 앱 설정 → 플랫폼 → **Web** → 사이트 도메인에 아래 두 개 등록
   - `https://gunwooyun.github.io`
   - `http://localhost:4321` (로컬 개발용)
4. 제품 설정 → **카카오맵** → 활성화 설정 **ON** (2024-12 이후 필수, 안 켜면 지도가 403으로 실패)
5. 공유 미리보기 이미지(`public/og.jpg`)를 바꾼 뒤에는 https://developers.kakao.com/tool/debugger/sharing 에서 캐시 초기화

## 2. Firebase (돌잡이 투표 + 방명록)

1. https://console.firebase.google.com → 프로젝트 추가 (Google Analytics는 꺼도 됨). 요금제는 **Spark(무료)** 그대로 둡니다. 결제 정보를 등록하지 않으므로 악용되어도 비용이 아니라 무료 한도만 소진됩니다.
2. 프로젝트 설정 → 일반 → 내 앱 → **웹 앱 추가** (호스팅 체크 안 함) → 표시되는 `firebaseConfig`에서 아래 값 복사
   - `apiKey` → `PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `PUBLIC_FIREBASE_PROJECT_ID`
   - `appId` → `PUBLIC_FIREBASE_APP_ID`
3. 빌드 → **Authentication** → 시작하기 → 로그인 방법 → **익명** 사용 설정
4. Authentication → 설정 → **승인된 도메인**에 `gunwooyun.github.io` 추가
5. 빌드 → **Firestore Database** → 데이터베이스 만들기 → 위치 `asia-northeast3 (서울)` → **프로덕션 모드**
6. Firestore → **규칙** 탭에 저장소의 `firestore.rules` 내용을 붙여넣고 게시
7. (선택) Google Cloud 콘솔 → API 및 서비스 → 사용자 인증 정보 → Browser key → **HTTP 리퍼러 제한**에 `https://gunwooyun.github.io/*` 추가

컬렉션은 첫 글/첫 투표 때 자동 생성됩니다: `guestbook`, `doljabi_votes`.
행사 후 프로젝트를 삭제하면 데이터도 함께 정리됩니다.

## 3. 구글 폼 (RSVP)

1. https://forms.google.com → 새 양식: 이름, 참석 여부, 참석 인원(성인/아이), 메모
2. 설정 → 응답 → "로그인 필요" **끄기** (친척분들이 구글 계정 없이도 응답)
3. 보내기 → 링크 → **URL 단축** → `RSVP_FORM_URL`
4. 응답 탭 → 스프레드시트 연결하면 인원 집계가 편합니다

비워 두면 RSVP 섹션이 표시되지 않습니다.

## 4. 개인정보 값

| 시크릿        | 형식                       | 예시                                 |
| ------------- | -------------------------- | ------------------------------------ |
| `PHONE_DAD`   | 하이픈 포함 번호           | `010-1234-5678`                      |
| `PHONE_MOM`   | 하이픈 포함 번호           | `010-1234-5678`                      |
| `ACCOUNT_DAD` | `은행명\|계좌번호\|예금주` | `국민은행\|123456-78-901234\|윤건우` |
| `ACCOUNT_MOM` | `은행명\|계좌번호\|예금주` | `신한은행\|110-123-456789\|박서희`   |

값을 비워 두면 해당 버튼/섹션이 숨겨집니다. 이 값들은 **빌드된 HTML에는 포함**됩니다(초대장에 보여야 하므로). 저장소(git)에만 남지 않게 하는 것이 목적입니다.

## 5. 사진 교체

`src/assets/photos/` 안의 같은 파일명으로 덮어쓰기:

| 파일                                                           | 용도                               | 권장                     |
| -------------------------------------------------------------- | ---------------------------------- | ------------------------ |
| `hero.jpg`                                                     | 커버 대표 사진                     | 세로 3:4, 1080px 이상    |
| `timeline-birth.jpg`, `timeline-100.jpg`, `timeline-first.jpg` | 성장 타임라인                      | 정사각형                 |
| `gallery-01.jpg` …                                             | 갤러리 (파일명 순 정렬, 개수 자유) | 세로 4:5 권장, 1080px    |
| `public/og.jpg`                                                | 카카오톡 미리보기                  | 1200×630 JPG, 300KB 이하 |

WebP 변환과 리사이즈는 빌드가 자동으로 처리합니다. 원본이 5MB를 넘으면 미리 줄여 두세요.
날짜·문구·출생일·행사 시간은 `src/config/invitation.ts`에서 수정합니다.

## 6. GitHub 시크릿

저장소 → Settings → Secrets and variables → Actions → **New repository secret**

```
PUBLIC_KAKAO_JS_KEY
PUBLIC_FIREBASE_API_KEY
PUBLIC_FIREBASE_AUTH_DOMAIN
PUBLIC_FIREBASE_PROJECT_ID
PUBLIC_FIREBASE_APP_ID
PHONE_DAD
PHONE_MOM
ACCOUNT_DAD
ACCOUNT_MOM
RSVP_FORM_URL
```

`gh` CLI로 한 번에 넣을 수도 있습니다:

```bash
gh secret set PUBLIC_KAKAO_JS_KEY --repo GunwooYun/gunwooyun.github.io --body "..."
```

## 7. GitHub Pages

1. 저장소 `GunwooYun/gunwooyun.github.io`는 **비공개**입니다. 비공개 저장소의 Pages는 GitHub Pro 이상에서만 동작합니다. Free 플랜이면 Settings → Pages에 "Upgrade" 안내가 뜹니다.
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**
3. `main`에 푸시하면 `.github/workflows/deploy.yml`이 빌드·배포합니다 (Actions 탭에서 진행 확인)
4. 배포 후 https://gunwooyun.github.io 접속 → 카카오톡으로 링크를 나에게 보내 미리보기 카드와 인앱 브라우저 확인
5. 시크릿을 바꾼 뒤에는 Actions → Deploy to GitHub Pages → **Run workflow**로 재배포

## 8. 배포 후 점검

- [ ] iOS Safari / Android Chrome / 카카오톡 인앱 / 네이버 인앱에서 스크롤·버튼 확인
- [ ] 지도 표시, 카카오맵·네이버지도 길찾기 버튼
- [ ] 전화·문자·주소 복사·계좌 복사
- [ ] 돌잡이 투표 1회 제한, 방명록 등록
- [ ] 카카오톡 미리보기 카드 이미지/제목
- [ ] Lighthouse 모바일 성능 90 이상

## 9. 행사 후

- Settings → Pages → **Unpublish site** (또는 저장소 삭제)
- Firebase 프로젝트 삭제, 카카오 앱 삭제
- 사진이 남아 있는 저장소를 계속 둘지 결정
