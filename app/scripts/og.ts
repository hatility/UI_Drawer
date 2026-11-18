// 카드 링크 미리보기: 빌드 뒤에 카드마다 dist/c/<id>.html 을 만들어요 (npm run build 가 함께 돌려요)
// 카톡 · 슬랙 · 디스코드는 주소의 # 뒤를 읽지 못해서, 카드마다 og:title · og:image 가 박힌 작은 페이지가 따로 있어야 해요.
// 사람이 열면 바로 사전 카드(#/w/<id>)로 넘어가요. 그림은 개발/docs/cards/<id>.png (npm run thumbs) 가 있으면 dist/og 로 복사해요.
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { ENTRIES } from '../src/data'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const cards = fileURLToPath(new URL('../../docs/cards/', import.meta.url))
// 사이트 주소(SITE_URL=https://…/)를 주면 그림 주소를 완전한 주소로 써요. 메신저 대부분이 완전한 주소만 읽어요
const SITE = (process.env.SITE_URL || process.env.FEED_SITE || '').replace(/\/?$/, '/').replace(/^\/$/, '')
const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
mkdirSync(dist + 'c', { recursive: true })
let pics = 0
if (existsSync(cards)) mkdirSync(dist + 'og', { recursive: true })
for (const e of ENTRIES) {
  const pic = existsSync(`${cards}${e.id}.png`)
  if (pic) { copyFileSync(`${cards}${e.id}.png`, `${dist}og/${e.id}.png`); pics++ }
  const img = SITE ? `${SITE}${pic ? `og/${e.id}.png` : 'og.png'}` : pic ? `../og/${e.id}.png` : '../og.png'
  writeFileSync(`${dist}c/${e.id}.html`, `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<title>${esc(e.ko)} (${esc(e.en)}) · UI Drawer</title>
<meta name="description" content="${esc(e.desc)}">
<meta property="og:type" content="article"><meta property="og:site_name" content="UI Drawer">
<meta property="og:title" content="${esc(e.ko)} · ${esc(e.en)}"><meta property="og:description" content="${esc(e.desc)}">
<meta property="og:image" content="${img}"><meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0;url=../#/w/${e.id}"><script>location.replace('../#/w/${e.id}')</script>
</head><body><a href="../#/w/${e.id}">${esc(e.ko)} 카드 보기</a></body></html>`)
}
console.log(`✓ 카드 미리보기 페이지 ${ENTRIES.length}개 · 그림 ${pics}장 → dist/c`)
