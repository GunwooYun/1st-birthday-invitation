# 설정 가이드 (배포 전 체크리스트)

순서대로 진행하면 됩니다. 각 단계에서 얻은 값은 **GitHub 시크릿**(4단계)에 넣습니다. 서버나 데이터베이스는 없고, 외부 서비스는 카카오(지도·공유) 하나뿐입니다.

## 1. 카카오 개발자 (지도 + 카카오톡 공유)

콘솔이 개편되어 도메인은 **앱이 아니라 JavaScript 키 단위**로 등록합니다 (2026-09 확인).

1. https://developers.kakao.com → 내 애플리케이션 → **앱 추가** (앱 이름: 소은이 돌잔치 초대장)
2. 앱 → **앱 키** → **JavaScript 키** 복사 → `PUBLIC_KAKAO_JS_KEY`
   - REST API 키도 똑같이 32자라 헷갈리기 쉽습니다. 반드시 **JavaScript 키**여야 하며, REST 키를 넣으면 `AccessDeniedError: domain mismatched`가 납니다.
3. 같은 화면의 JavaScript 키 설정 → **JavaScript SDK 도메인**에 아래 두 줄 등록 (끝에 `/`나 경로 없이)
   - `https://gunwooyun.github.io`
   - `http://localhost:4321` (로컬 개발용)
4. 앱 → **카카오맵** → 사용 설정 **상태 ON** (안 켜면 지도가 403으로 실패). 개발자 계정에서 첫 번째로 카카오맵을 켠 앱만 무료 쿼터가 적용되고, 두 번째 앱부터는 비즈월렛 연결이 필요합니다.
5. 설정은 즉시 반영되며 재배포는 필요 없습니다. 확인 명령:
   ```bash
   curl -s -o /dev/null -w "%{http_code}
   ```

" -H "Referer: https://gunwooyun.github.io/" "https://dapi.kakao.com/v2/maps/sdk.js?appkey=<JavaScript키>&autoload=false&libraries=services"

```
200이면 정상, 401이면 도메인/키 문제, 403이면 카카오맵 사용 설정 문제입니다.
6. 공유 미리보기 이미지(`public/og.jpg`)를 바꾼 뒤에는 https://developers.kakao.com/tool/debugger/sharing 에서 캐시 초기화

## 2. 개인정보 값

| 시크릿        | 형식                       | 예시                                 |
| ------------- | -------------------------- | ------------------------------------ |
| `PHONE_DAD`   | 하이픈 포함 번호           | `010-1234-5678`                      |
| `PHONE_MOM`   | 하이픈 포함 번호           | `010-1234-5678`                      |
| `ACCOUNT_DAD` | `은행명\|계좌번호\|예금주` | `국민은행\|123456-78-901234\|윤건우` |
| `ACCOUNT_MOM` | `은행명\|계좌번호\|예금주` | `신한은행\|110-123-456789\|박서희`   |

값을 비워 두면 해당 버튼/섹션이 숨겨집니다. 이 값들은 **빌드된 HTML에는 포함**됩니다(초대장에 보여야 하므로). 저장소(git)에만 남지 않게 하는 것이 목적입니다.

## 3. 사진 교체

`src/assets/photos/` 안의 같은 파일명으로 덮어쓰기:

| 파일                                                           | 용도                               | 권장                                            |
| -------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------- |
| `hero.jpg`                                                     | 커버 대표 사진                     | 세로 3:4, 긴 변 1500px 이상                     |
| `timeline-birth.jpg`, `timeline-100.jpg`, `timeline-first.jpg` | 성장 타임라인 (원형으로 잘림)      | 얼굴이 가운데 오는 정사각형 근처 사진           |
| `gallery-01.jpg`, `gallery-02.jpg`, …                          | 갤러리 (파일명 순 정렬, 개수 자유) | 세로 4:5 권장, 긴 변 1200~2000px                |
| `public/og.jpg`                                                | 카카오톡 미리보기 카드             | `npm run og`로 대표 사진에서 자동 생성 (1200×630) |

절차:

1. 휴대폰 사진은 **JPG로 내보내기** (iPhone HEIC는 그대로 쓸 수 없음: 설정 → 카메라 → 포맷 → 높은 호환성, 또는 공유 시 JPG 변환). 5MB가 넘으면 미리 줄여 두면 빌드가 빨라집니다.
2. 위 파일명으로 `src/assets/photos/`에 복사 (기존 임시 이미지 덮어쓰기). 갤러리는 `gallery-07.jpg`처럼 번호를 이어 붙이면 그만큼 늘어나고, 파일을 지우면 줄어듭니다.
3. `npm run photos` → 회전을 픽셀에 굽고, EXIF(촬영 위치 포함)를 제거하고, 긴 변 2000px로 줄입니다. **공개 저장소이므로 커밋 전에 반드시 실행**합니다.
4. `npm run og` → 대표 사진 전체를 흐린 배경 위에 얹어 `public/og.jpg`를 만듭니다. 다른 사진을 쓰려면 `node scripts/make-og.mjs 경로/사진.jpg`.
5. `npm run build` 후 `npm run preview`로 http://localhost:4321 에서 확인. WebP 변환·리사이즈·EXIF 회전은 빌드가 처리합니다.
6. 커밋 → 푸시하면 자동 배포. 카카오톡 미리보기 이미지는 캐시되므로 https://developers.kakao.com/tool/debugger/sharing 에서 초기화.

주의: 저장소가 **공개**라 커밋한 사진은 github.com에서도 보이고, 지운 뒤에도 커밋 이력에 남습니다. 테스트용으로는 공개돼도 괜찮은 사진을 쓰는 편이 안전합니다.
`npm run placeholders`는 이미 있는 파일을 건너뛰므로 실제 사진을 덮어쓰지 않습니다 (강제로 다시 만들려면 `--force`).

## 3-1. 장소·날짜 변경 (예약 확정 후)

`src/config/invitation.ts` 맨 위의 **`EVENT`**(일시)와 **`VENUE`**(장소명, 층, 주소, 전화, 지도 검색어, 교통 안내) 블록만 고치면
커버·달력·지도·길찾기·카카오톡 공유 문구·메타 설명이 모두 따라 바뀝니다.
`mapKeyword`는 카카오맵에서 검색했을 때 정확히 그 매장이 나오는 이름으로 적어 주세요.
임시 `public/og.jpg`의 문구는 `scripts/make-placeholders.mjs`의 `OG_SUBTITLE`을 고치고 `npm run placeholders`로 다시 만듭니다 (실제 이미지로 바꾼 뒤에는 불필요).

## 4. GitHub 시크릿

저장소 → Settings → Secrets and variables → Actions → **New repository secret**

```

PUBLIC_KAKAO_JS_KEY
PHONE_DAD
PHONE_MOM
ACCOUNT_DAD
ACCOUNT_MOM

````

`gh` CLI로 한 번에 넣을 수도 있습니다:

```bash
gh secret set PUBLIC_KAKAO_JS_KEY --repo GunwooYun/gunwooyun.github.io --body "..."
````

## 5. GitHub Pages

1. 저장소 `GunwooYun/gunwooyun.github.io`는 **공개**입니다 (Free 플랜은 공개 저장소만 Pages 지원). 그래서 개인정보는 시크릿으로만 주입하고, 커밋한 사진은 github.com에서도 보인다는 점을 기억하세요.
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**
3. `main`에 푸시하면 `.github/workflows/deploy.yml`이 빌드·배포합니다 (Actions 탭에서 진행 확인)
4. 배포 후 https://gunwooyun.github.io 접속 → 카카오톡으로 링크를 나에게 보내 미리보기 카드와 인앱 브라우저 확인
5. 시크릿을 바꾼 뒤에는 Actions → Deploy to GitHub Pages → **Run workflow**로 재배포

## 6. 배포 후 점검

- [ ] iOS Safari / Android Chrome / 카카오톡 인앱 / 네이버 인앱에서 스크롤·버튼 확인
- [ ] 지도 표시, 카카오맵·네이버지도 길찾기 버튼
- [ ] 전화·문자·주소 복사·계좌 복사
- [ ] 카카오톡 미리보기 카드 이미지/제목
- [ ] Lighthouse 모바일 성능 90 이상

## 7. 행사 후

- Settings → Pages → **Unpublish site** (또는 저장소 삭제)
- 카카오 앱 삭제
- 사진이 남아 있는 저장소를 계속 둘지 결정
