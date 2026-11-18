// RSS 피드 만들기: npm run feed → public/feed.xml (새 소식 차수마다 한 글)
// SITE 는 배포 주소예요. 도커 기본값과 같게 두고, 실제 주소가 생기면 FEED_SITE 로 바꿔요.
import { writeFileSync } from 'node:fs'
import { ENTRIES } from '../src/data'
import { NEWS } from '../src/news'

const SITE = (process.env.FEED_SITE || 'http://localhost:8081/').replace(/\/?$/, '/')
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const items = NEWS.map(([title, note, from], i) => {
  const to = i === 0 ? ENTRIES.length : NEWS[i - 1][2]
  const list = ENTRIES.slice(from, to)
  const date = /\d{4}-\d{2}-\d{2}/.exec(title)?.[0] ?? '2026-11-12'
  return `<item><title>${esc(`UI Drawer ${title} · ${list.length}장`)}</title><link>${SITE}#/news</link><guid isPermaLink="false">ui-drawer-${from}</guid><pubDate>${new Date(date + 'T09:00:00+09:00').toUTCString()}</pubDate><description>${esc(`${note} — ${list.slice(0, 12).map((e) => e.ko).join(', ')}${list.length > 12 ? ' …' : ''}`)}</description></item>`
}).join('\n')
writeFileSync(new URL('../public/feed.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>UI Drawer 새 소식</title><link>${SITE}</link><description>UI 이름 사전에 새로 들어온 카드</description><language>ko</language>
${items}
</channel></rss>
`)
console.log('✓ public/feed.xml (', NEWS.length, '개 소식 )')
