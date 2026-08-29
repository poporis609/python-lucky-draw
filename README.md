# 🐍 오늘의 Python 운세

Python 커뮤니티 행사 부스용 인터랙티브 미니게임입니다.
버튼 한 번으로 **개발자 운세 + 행운지수 + 능력치 + Python 코드 한 줄**을 뽑고,
행운지수에 따라 **1~3등 경품이 차등 지급**됩니다. 결과 화면을 직원에게 보여주면 끝!

체험 시간: 약 20~40초 · 백엔드 없음 · 새로고침해도 정상 동작

## 실행 방법

```bash
npm install
npm run dev      # http://localhost:5173
```

배포용 정적 파일 빌드:

```bash
npm run build    # dist/ 폴더 생성
npm run preview  # 빌드 결과 로컬 확인
```

`dist/` 폴더를 GitHub Pages, Netlify, Vercel 등 아무 정적 호스팅에 올리면 됩니다.
행사장에서는 노트북/태블릿 가로 화면 + 브라우저 전체화면(F11 또는 ⌃⌘F) 모드를 권장합니다.

## Railway 배포

이 저장소에는 Railway 배포용 `Dockerfile`과 `Caddyfile`이 포함되어 있습니다.
Caddy는 Railway가 주입하는 `PORT`에서 빌드 결과를 서빙하며, `/health` 헬스체크와 SPA 경로 fallback을 지원합니다.

1. 이 저장소를 GitHub에 push합니다.
2. Railway에서 **New Project → Deploy from GitHub repo**를 선택하고 저장소를 연결합니다.
3. 별도의 Build Command나 Start Command는 입력하지 않습니다. Railway가 루트의 `Dockerfile`을 자동으로 사용합니다.
4. 서비스의 **Settings → Healthcheck Path**를 `/health`로 설정합니다.
5. **Networking → Generate Domain**으로 공개 주소를 생성합니다.

환경 변수나 데이터베이스는 필요하지 않습니다. `main` 브랜치 자동 배포를 활성화하면 이후 push도 자동 반영됩니다.

Docker가 설치된 환경에서는 Railway와 동일한 방식으로 확인할 수 있습니다.

```bash
docker build -t python-lucky-draw .
docker run --rm -p 3000:3000 -e PORT=3000 python-lucky-draw
# http://localhost:3000 및 http://localhost:3000/health 확인
```

## 파일 구조

```
public/
  prizes.json              # ★ 경품 설정 (빌드 없이 수정 가능)
src/
  main.jsx                 # 엔트리 포인트
  App.jsx                  # 화면 전환 + 경품 설정 로드
  App.css                  # 전체 스타일 & 애니메이션
  index.css                # 전역 스타일 (배경, 폰트, 색상 변수)
  components/
    StartScreen.jsx        # 시작 화면 (제목 + 운세 뽑기 버튼)
    LoadingScreen.jsx      # 터미널 연출 로딩 (~1.8초)
    ResultScreen.jsx       # 운세 결과 카드 + 행운지수 + 코드 자판기 + 경품 배너
  data/                    # ★ 운영자가 수정하는 곳
    fortunes.js            # 오늘의 운세 문구 (35개)
    developerTypes.js      # 개발자 타입 (14개)
    pythonCodes.js         # 코드 자판기 데이터 (35개)
    luckyKeywords.js       # 행운의 키워드 (25개)
    extras.js              # 오늘의 한마디 (14개) + 행운의 행동 (14개)
    prizes.js              # 경품 기본값 (prizes.json 로드 실패 시 폴백)
  utils/
    random.js              # 랜덤 선택 + 행운지수/경품 추첨 로직
```

## 행운지수 & 경품 차등 지급

운세를 뽑을 때마다 **행운지수(0~100)**가 함께 추첨되고, 점수 구간에 따라 경품 등수가 결정됩니다.
경품 설정은 [public/prizes.json](public/prizes.json)에서 관리합니다.

```jsonc
{ "rank": 1, "label": "1등상", "emoji": "🏆", "minLuck": 90, "weight": 10, "prize": "" }
```

- **weight**: 당첨 확률 비중. 전체 합이 100이면 그대로 %입니다. (기본값: 1등 10% / 2등 20% / 3등 70%)
- **minLuck**: 이 등수일 때 표시되는 행운지수의 최솟값. 예: 1등은 90~100 사이 숫자가 나옴
- **prize / label / emoji**: 당일 경품에 맞게 자유롭게 수정 (등수 개수도 늘리거나 줄일 수 있음)
- 등수는 먼저 weight로 추첨된 뒤, 해당 구간 안에서 행운지수 숫자를 생성하므로 점수와 등수가 항상 일치합니다
- **빌드 후에도 수정 가능**: `dist/prizes.json`을 현장에서 직접 수정하고 새로고침하면 바로 반영됩니다
- 파일이 손상되거나 없어도 [src/data/prizes.js](src/data/prizes.js)의 기본값으로 안전하게 동작합니다

## 주요 기능

- **시작 화면**: 큰 제목 + 운세 뽑기 버튼 + 흐르는 코드 티커
- **로딩 연출**: 터미널 창에서 `python today.py` 실행 → 진행 바 → `SUCCESS!` 글리치 효과 (약 1.8초)
- **운세 결과**: 개발자 타입 / 행운지수 게이지 / 운세 / 행운의 키워드 / 능력치 4종(랜덤 40~100) / 오늘의 한마디 / 행운의 행동
- **경품 차등 지급**: 행운지수 구간별 1~3등상 자동 결정, 하단 배너에 등수 + 경품명 큰 글씨로 표시
- **코드 자판기**: 🐍 Python 코드 뽑기 버튼 → 코드 + 재미있는 해설 (로딩 없이 즉시, 반복 가능)
- **다시 뽑기**: 새 운세를 처음부터 다시 생성
- **굿즈 배너**: "직원에게 이 화면을 보여주세요" 안내 + 처음으로 버튼
- **연속 중복 방지**: 같은 항목이 연달아 두 번 나오지 않음
- **예외 처리**: 데이터 배열이 비어 있어도 기본값으로 동작

## 운영자가 쉽게 수정할 수 있는 부분

| 수정하고 싶은 것 | 파일 | 방법 |
| --- | --- | --- |
| **경품 종류/확률/등수** | `public/prizes.json` | `prize`, `weight`, `minLuck` 수정. 빌드 후엔 `dist/prizes.json` |
| 운세 문구 추가/수정 | `src/data/fortunes.js` | 배열에 문자열 추가. `` `백틱` `` 안 코드는 자동 강조 |
| 개발자 타입 | `src/data/developerTypes.js` | `{ emoji, name, tagline }` 객체 추가 |
| 코드 자판기 코드 | `src/data/pythonCodes.js` | `{ code, comment }` 객체 추가. 여러 줄은 `\n` |
| 행운의 키워드 | `src/data/luckyKeywords.js` | 문자열 추가 |
| 한마디 / 행운의 행동 | `src/data/extras.js` | 각 배열에 문자열 추가 |
| 능력치 항목/범위 | `src/utils/random.js` | `stats` 배열과 `randomStat(min, max)` 수정 |
| 로딩 시간 | `src/components/LoadingScreen.jsx` | `TOTAL_MS` 값 변경 (기본 1800ms) |
| 색상 테마 | `src/index.css` | `:root`의 `--py-blue`, `--py-yellow` 등 CSS 변수 |
| 제목/부제/버튼 문구 | `src/components/StartScreen.jsx` | JSX 텍스트 직접 수정 |
| 굿즈 안내 문구 | `src/components/ResultScreen.jsx` | `prize-banner` 부분 수정 |
| 브라우저 탭 제목 | `index.html` | `<title>` 수정 |

데이터 파일은 저장만 하면 개발 서버가 자동으로 반영합니다(HMR).
