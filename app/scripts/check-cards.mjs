// 카드 그림 전체 자동 검사: npm run check:cards (개발 서버가 켜져 있어야 해요. 주소는 첫 인자로 바꿀 수 있어요)
//  1) 카드 크기 · 큰 그림(상세 창) 크기에서 칸 밖으로 넘치는 그림
//  2) 마우스를 올려도 움직이지 않는 그림
//  3) 상세 창 시연의 주인공(FOCUS_OF)이 그림 안에 실제로 있는지
//  4) 모든 화면 · 체험관 체험에서 콘솔 오류
// 일부러 밖으로 빼 둔 그림(길 · 끌어 내리기 · 가로 띠 등)은 ALLOW 에 적어 두고 건너뛰어요.
import { chromium } from 'playwright-core'

const BASE = process.argv[2] || 'http://localhost:5180/'
const ALLOW = '.px-canvas,.px-map,.px-vapor,.px-neon,.px-mesh,.px-aero,.px-tstack,.px-shelf,.px-sfade,.py-inf,.py-pin,.pv-marquee,.pv-carousel,.pv-scroller,.pv-hscroll,.py-spg,.py-inr,.pv-snap,.pz-circ,.pz-term,.pz-riso,.pz-chrome,.pv-road1,.pv-road2,.pv-swipe-row,.pv-dismiss,.pz-scrollto,.py-terms,.pz-glow,.px-indet,.pv-tabs--scroll,.py-fz .rest,.pq-flat,.pq-sth2 > div,.pv-par-fg'

const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch())
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(`${page.url()} · ${e.message}`))
page.on('console', (m) => { if (m.type() === 'error') errors.push(`${page.url()} · ${m.text()}`) })

await page.goto(BASE + '#/dict')
await page.waitForTimeout(1500)
const cards = await page.evaluate(async (ALLOW) => {
  const w = (ms) => new Promise((r) => setTimeout(r, ms))
  const { FOCUS_OF } = await import('/src/CardDemo.tsx')
  const over = {}, big = {}, still = [], focus = []
  const measure = (pv) => { const R = pv.getBoundingClientRect(), out = []; for (const el of pv.querySelectorAll('*')) { if (el.closest(ALLOW)) continue; const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue; const o = Math.max(R.left - r.left, r.right - R.right, R.top - r.top, r.bottom - R.bottom); if (o > 3) out.push(String(el.className.baseVal ?? el.className).slice(0, 24) + ':' + Math.round(o)) } return out.slice(0, 2) }
  let n = 0
  for (const g of ['UI 부품', '주제별']) {
    ;[...document.querySelectorAll('button')].find((x) => x.textContent.trim() === g)?.click(); await w(900)
    const pvs = [...document.querySelectorAll('.ec [data-pv]')]
    n += pvs.length
    for (const pv of pvs) { const o = measure(pv); if (o.length) over[pv.dataset.pv] = o; const sel = FOCUS_OF[pv.dataset.pv]; if (sel && !pv.querySelector(sel)) focus.push(pv.dataset.pv) }
    const olds = pvs.map((pv) => pv.getAttribute('style') || '')
    pvs.forEach((pv) => { pv.style.width = '432px'; pv.style.height = '240px'; pv.classList.add('pv--large') })
    await w(200)
    pvs.forEach((pv) => { if (!pv.getAnimations({ subtree: true }).length && getComputedStyle(pv, '::after').animationName === 'none') still.push(pv.dataset.pv) })
    await w(3300)
    pvs.forEach((pv) => { const o = measure(pv); if (o.length) big[pv.dataset.pv] = o })
    pvs.forEach((pv, i) => { pv.classList.remove('pv--large'); pv.setAttribute('style', olds[i]) })
  }
  return { n, over, big, still, focus }
}, ALLOW)

// 모든 화면 · 체험관 체험 한 바퀴
const plays = await page.evaluate(async () => (await import('/src/data.ts')).ENTRIES.filter((e) => e.play && e.drawer !== 'style').map((e) => e.id))
for (const h of ['#/', '#/learn', '#/tags', '#/mine', '#/compare', '#/news', '#/w/snackbar']) { await page.goto(BASE + h); await page.waitForTimeout(800) }
const notShown = []
for (const id of plays) {
  await page.goto(`${BASE}#/play/${id}/${Date.now()}`)
  const ok = await page.waitForSelector(`[data-ui="${id}"]`, { state: 'visible', timeout: 5000 }).then(() => true, () => false)
  if (!ok) notShown.push(id)
}
await browser.close()

const line = (t, x) => console.log(`${Object.keys(x).length || x.length ? '✗' : '✓'} ${t}: ${Array.isArray(x) ? (x.join(', ') || '없음') : (Object.entries(x).map(([k, v]) => `${k}(${v})`).join(' · ') || '없음')}`)
console.log(`카드 ${cards.n}장 · 체험 ${plays.length}개 검사`)
line('카드 크기에서 넘침', cards.over); line('큰 그림에서 넘침', cards.big); line('움직이지 않는 그림', cards.still)
line('시연 주인공이 없는 카드', cards.focus); line('체험관에서 안 나타난 체험', notShown); line('콘솔 오류', errors)
const bad = Object.keys(cards.over).length + Object.keys(cards.big).length + cards.still.length + cards.focus.length + notShown.length + errors.length
process.exit(bad ? 1 : 0)
