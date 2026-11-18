# UI Drawer — 개발 폴더

```bash
npm install
npm run dev       # http://localhost:5180
npm test          # 사전 데이터 · 찾기 검사
npm run build     # dist/ (카드마다 미리보기 페이지 dist/c 도 함께. SITE_URL=https://주소/ 를 주면 그림 주소가 완전한 주소로)
npm run release   # ../release/v<버전>/ 배포 묶음
npm run check:cards  # 카드 · 체험 전체 자동 검사 (개발 서버 켠 채로)
npm run audit     # 사이트 전체 점검: 오류 · 넘침 · 이름 없는 버튼 · 잘린 글자 · 작은 버튼
npm run readable  # 가독성 점검: 카드 그림 · Stage 그림의 보이는 글자 크기 · 대비 · 줄 간격
npm run stills    # 화면 정지 그림 → ../docs/스크린샷
npm run feed      # public/feed.xml
npm run icons     # 앱 아이콘 PNG
npm run thumbs    # 카드 썸네일 → ../docs/cards
npm run stills -- --check  # 화면 사진 비교만 (덮어쓰지 않음)
docker compose up -d --build   # http://localhost:8081
```

- 사전 내용: `src/data.ts` (카드 하나 = 항목 하나)
- 카드 그림: `src/Preview.tsx` · `src/preview.css`
- 체험관: `src/Playground.tsx` — 사이트 UI 에 `data-ui="<사전 id>"` 를 달면 이름표가 붙어요
- 첫 화면 그림: `src/HeroStage.tsx` (Stageshow `Stage`)
- `src/kit/`: Stageshow 킷 (MIT, `src/kit/LICENSE`). 고치지 말고 필요한 파일만 불러 써요

## 만든 사람

이명균 · https://github.com/aodrha03 · 소스 코드 https://github.com/hatility/UI_Drawer · MIT
