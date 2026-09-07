# 소은이 돌잔치 모바일 초대장

2027년 5월 9일 일요일, 빕스 은평롯데점에서 열리는 소은이의 첫 생일 초대장입니다.
GitHub Pages(`https://gunwooyun.github.io`)에 정적 사이트로 배포되며 카카오톡 링크로 공유합니다.

## 구성

| 섹션           | 내용                                        | 데이터 출처                                              |
| -------------- | ------------------------------------------- | -------------------------------------------------------- |
| 커버           | 대표 사진, 제목, 날짜, 장소                 | `src/config/invitation.ts`, `src/assets/photos/hero.jpg` |
| 인사말         | 부모 인사                                   | `invitation.greeting`                                    |
| 아이 소개      | 이름, 출생일, 부모, 전화/문자 버튼          | `PHONE_DAD`, `PHONE_MOM` 시크릿                          |
| 달력 · D-day   | 행사 월 달력, 카운트다운                    | `invitation.event.startAt`                               |
| 성장 타임라인  | 탄생 → 백일 → 첫돌                          | `src/assets/photos/timeline-*.jpg`                       |
| 갤러리         | 사진 그리드 + 라이트박스                    | `src/assets/photos/gallery-*.jpg`                        |
| 오시는 길      | 카카오맵, 주소 복사, 길찾기 링크, 교통 안내 | `PUBLIC_KAKAO_JS_KEY`                                    |
| RSVP           | 구글 폼 링크                                | `RSVP_FORM_URL` 시크릿 (비어 있으면 숨김)                |
| 돌잡이 투표    | 1인 1표 예측 투표                           | Firebase Firestore                                       |
| 마음 전하실 곳 | 계좌번호 아코디언 + 복사                    | `ACCOUNT_DAD`, `ACCOUNT_MOM` 시크릿                      |
| 축하 한마디    | 방명록                                      | Firebase Firestore                                       |
| 공유           | 카카오톡 공유, 링크 복사                    | `PUBLIC_KAKAO_JS_KEY`                                    |

전화번호·계좌번호·폼 URL은 저장소에 커밋하지 않고 빌드 시 환경변수로만 주입합니다.
Firebase/카카오 키가 없으면 해당 섹션은 자동으로 숨겨집니다.

## 로컬 개발

```bash
npm install
cp env.example .env     # 값 채우기 (실제 값은 커밋 금지)
npm run dev             # http://localhost:4321
npm run check           # 타입 검사
npm run build && npm run preview
```

임시 사진을 다시 만들려면 `npm run placeholders`. 실제 사진은 같은 파일명으로 `src/assets/photos/`에 덮어쓰면 됩니다.

## 배포와 외부 서비스 설정

`docs/SETUP.md`를 참고하세요. 카카오 개발자 등록, Firebase 프로젝트, 구글 폼, GitHub 시크릿, Pages 설정 순서로 정리되어 있습니다.

## 기술 스택

Astro 7 (정적 빌드, 빌드 시 WebP 변환) · Pretendard + Gowun Dodum · PhotoSwipe · Kakao Maps/Share JS SDK v2 · Firebase (Firestore Lite + 익명 인증) · GitHub Actions → GitHub Pages
