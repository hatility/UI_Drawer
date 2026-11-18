// 카드 썸네일 자동 촬영: npm run thumbs [-- 개수] (개발 서버가 켜져 있어야 해요)
// 사전 화면의 카드 그림을 한 장씩 찍어 개발/docs/cards/<카드 id>.png 로 (공유 이미지 · 발표 자료용, 깃허브에는 안 올려요)
// 움직임 줄이기로 찍어서 멈춘 장면이에요.
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const LIMIT = Number(process.argv.find((a) => /^\d+$/.test(a))) || Infinity
const BASE = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:5180/'
const OUT = fileURLToPath(new URL('../../docs/cards/', import.meta.url))
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch())
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
await page.goto(BASE + '#/dict')
await page.waitForTimeout(1500)
// 사전은 ‘UI 부품’과 ‘주제별’ 두 묶음이라 둘 다 돌아요 (같은 카드가 두 곳에 있으면 한 번만)
const done = new Set()
let n = 0
for (const group of ['UI 부품', '주제별']) {
  await page.getByRole('radio', { name: group }).first().click().catch(() => {})
  await page.waitForTimeout(800)
  const ids = (await page.$$eval('.ec[data-card]', (els) => els.map((e) => e.dataset.card))).filter((id) => !done.has(id))
  for (const id of ids) {
    if (n >= LIMIT) break
    done.add(id)
    const pv = page.locator(`.ec[data-card="${id}"] .ec-pv`).first()
    await pv.scrollIntoViewIfNeeded()
    await pv.screenshot({ path: `${OUT}${id}.png`, animations: 'disabled' })
    if (++n % 100 === 0) console.log(`… ${n}장`)
  }
}
await browser.close()
console.log(`✓ 썸네일 ${n}장 → ${OUT}`)
