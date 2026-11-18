// README · 공유용 정지 그림 자동 촬영: npm run stills (개발 서버가 켜져 있어야 해요. 주소는 첫 인자)
// 움직임 줄이기로 찍어서 Stageshow 그림은 포스터 장면(이야기가 한 장에 담긴 장면)으로 나와요.
// 결과: 개발/docs/스크린샷/<화면>-<폭>.png
// 전에 찍은 사진이 있으면 픽셀을 비교해서 많이 바뀐 화면을 알려 줘요 (화면 사진 비교 테스트). 바뀐 곳은 <화면>-<폭>.diff.png 로 빨갛게.
// --check 를 붙이면 1% 넘게 바뀐 화면이 있을 때 실패로 끝나요 (사진은 덮어쓰지 않아요).
import { chromium } from 'playwright-core'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const CHECK = args.includes('--check')
const BASE = args.find((a) => !a.startsWith('--')) || 'http://localhost:5180/'
const changed = []
const OUT = fileURLToPath(new URL('../../docs/스크린샷/', import.meta.url))
const SHOTS = [['home', '#/'], ['dict', '#/dict'], ['learn', '#/learn'], ['play', '#/play'], ['tags', '#/tags'], ['mine', '#/mine'], ['card', '#/w/snackbar']]
const SIZES = [[1280, 800], [390, 844]]

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch())
for (const [w, h] of SIZES) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
  // 처음 안내 창이 가리지 않게
  await page.addInitScript(() => { localStorage.setItem('ui-drawer-guide-seen', '1'); localStorage.setItem('ui-drawer-welcome-seen', '1') })
  for (const [name, hash] of SHOTS) {
    await page.goto(BASE + hash)
    await page.waitForTimeout(1200)
    const file = `${OUT}${name}-${w}.png`
    const shot = await page.screenshot()
    if (existsSync(file)) {
      // 두 사진을 캔버스에 그려 픽셀 비교 (브라우저 안에서 해서 따로 깔 것이 없어요)
      const { ratio, diff } = await page.evaluate(async ([a, b]) => {
        const load = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + src })
        const [ia, ib] = await Promise.all([load(a), load(b)])
        const W = Math.max(ia.width, ib.width), H = Math.max(ia.height, ib.height)
        const ctx = (img) => { const c = new OffscreenCanvas(W, H); const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, W, H).data }
        const da = ctx(ia), db = ctx(ib)
        const out = new OffscreenCanvas(W, H), g = out.getContext('2d'); g.drawImage(ib, 0, 0); g.fillStyle = 'rgba(255,0,0,.6)'
        let n = 0
        for (let i = 0; i < da.length; i += 4) if (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]) > 48) { n++; const p = i / 4; g.fillRect(p % W, Math.floor(p / W), 1, 1) }
        const blob = await out.convertToBlob()
        const buf = new Uint8Array(await blob.arrayBuffer()); let bin = ''; for (const x of buf) bin += String.fromCharCode(x)
        return { ratio: n / (W * H), diff: btoa(bin) }
      }, [readFileSync(file).toString('base64'), shot.toString('base64')])
      const pct = (ratio * 100).toFixed(2)
      if (ratio > 0.01) { changed.push(`${name}-${w} ${pct}%`); writeFileSync(`${OUT}${name}-${w}.diff.png`, Buffer.from(diff, 'base64')) }
      console.log(`${ratio > 0.01 ? '△' : '✓'} ${name}-${w}.png · 바뀐 픽셀 ${pct}%`)
    } else console.log(`＋ ${name}-${w}.png (새 사진)`)
    if (!CHECK) writeFileSync(file, shot)
  }
  await page.close()
}
await browser.close()
console.log(`→ ${OUT}`)
if (changed.length) { console.log(`많이 바뀐 화면 ${changed.length}개: ${changed.join(' · ')} (빨간 곳은 .diff.png)`); if (CHECK) process.exit(1) }
