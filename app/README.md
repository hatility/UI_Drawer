# UI Drawer — 개발 폴더

```bash
npm install
npm run dev       # http://localhost:5180
npm test          # 사전 데이터 · 찾기 검사
npm run build     # dist/
npm run release   # ../release/v<버전>/ 배포 묶음
docker compose up -d --build   # http://localhost:8081
```

- 사전 내용: `src/data.ts` (카드 하나 = 항목 하나)
- 카드 그림: `src/Preview.tsx` · `src/preview.css`
- 체험관: `src/Playground.tsx` — 사이트 UI 에 `data-ui="<사전 id>"` 를 달면 이름표가 붙어요
- 첫 화면 그림: `src/HeroStage.tsx` (Stageshow `Stage`)
- `src/kit/`: Stageshow 킷 (MIT, `src/kit/LICENSE`). 고치지 말고 필요한 파일만 불러 써요
