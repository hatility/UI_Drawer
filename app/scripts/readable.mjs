// 가독성 점검 (Stageshow 기준): npm run readable
//  카드 그림 · 큰 그림 · Stage 그림 · 체험관에서 실제로 보이는 글자 크기 · 대비 · 줄 간격을 재요.
//  - 보이는 크기 9px 미만 (화면에 줄여 그려진 크기 기준)
//  - 글자와 바로 뒤 바탕의 대비 3:1 미만 (흐린 글자)
//  - 13px 미만 글자의 줄 간격이 1.3 미만
//  - 가짜 앱 안의 진짜 제목 태그(h1~h6)
import { chromium } from 'playwright-core'
const BASE = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:5180/'
// 일부러 작게 · 흐리게 그린 카드: 다크 패턴(깨알 글씨 등), 스타일 견본(카와이 · 리소 · 스티커), 대비를 비교하는 카드, 브랜드 색(네이버)
const ON_PURPOSE = ['fine-print', 'hidden-unsubscribe', 'forced-app-download', 'high-contrast', 'kawaii', 'riso', 'sticker', 'social-login', 'double-tap', 'friend-spam', 'forced-continuity']
const LIMIT = Number(process.argv.find((a) => /^\d+$/.test(a))) || 0

const scan = ({ rootSel, minPx }) => {
  const lum = (c) => { const m = c.match(/[\d.]+/g); if (!m) return null; let [r, g, b, a = 1] = m.map(Number); if (c.startsWith('color(')) { r *= 255; g *= 255; b *= 255 } if (a < 0.5) return null; const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
  const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if (s.backgroundImage !== 'none') return null; const l = lum(s.backgroundColor); if (l !== null) return l } return 1 }
  const out = []
  for (const root of document.querySelectorAll(rootSel)) {
    const where = root.closest('[data-card]')?.dataset.card || root.className.toString().split(' ')[0]
    const rr = root.getBoundingClientRect(); if (!rr.width) continue
    for (const el of root.querySelectorAll('*')) {
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0)
      if (!own) continue
      const s = getComputedStyle(el); const r = el.getBoundingClientRect()
      if (!r.width || s.visibility === 'hidden' || +s.opacity === 0 || el.closest('[aria-hidden="true"]:not(.pv)') && false) continue
      // 화면에 그려진 배율: 요소의 실제 폭 / 레이아웃 폭
      const scale = el.offsetWidth ? r.width / el.offsetWidth : 1
      const px = parseFloat(s.fontSize) * scale
      const text = el.textContent.trim().slice(0, 14)
      if (px < minPx) out.push(`${where} · 보이는 글자 ${px.toFixed(1)}px “${text}”`)
      const fg = lum(s.color), bg = bgOf(el)
      if (fg !== null && bg !== null) { const c = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05); if (c < 3 && !/disabled|ghost|faint|dim|off|hint|ph|place/.test(el.className.toString())) out.push(`${where} · 흐린 글자 대비 ${c.toFixed(1)} “${text}”`) }
      const lh = parseFloat(s.lineHeight); if (parseFloat(s.fontSize) < 13 && lh && lh / parseFloat(s.fontSize) < 1.3 && (el.offsetHeight - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom) - parseFloat(s.borderTopWidth) - parseFloat(s.borderBottomWidth)) > lh * 1.5) out.push(`${where} · 여러 줄인데 줄 간격 ${(lh / parseFloat(s.fontSize)).toFixed(2)} “${text}”`)
    }
    for (const h of root.querySelectorAll('h1,h2,h3,h4,h5,h6')) out.push(`${where} · 가짜 화면 안의 진짜 제목 <${h.tagName.toLowerCase()}> “${h.textContent.trim().slice(0, 12)}”`)
  }
  return out
}

const b = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch())
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
await p.addInitScript(() => { localStorage.setItem('ui-drawer-guide-seen', '1'); localStorage.setItem('ui-drawer-welcome-seen', '1') })
const found = []
// 카드 그림 (사전 두 묶음)
await p.goto(BASE + '#/dict'); await p.waitForTimeout(1500)
for (const g of ['UI 부품', '주제별']) {
  await p.getByRole('radio', { name: g }).first().click(); await p.waitForTimeout(800)
  found.push(...await p.evaluate(scan, { rootSel: '.ec .pv', minPx: 8 }))
}
// Stage 그림 · 체험관
for (const [r, sel] of [['#/', '.hs'], ['#/learn/compare', '.ls'], ['#/learn/course', '.bs'], ['#/tags', '.ts'], ['#/play', '.pg-body, .gs']]) {
  await p.goto(BASE + r); await p.waitForTimeout(2500)
  found.push(...(await p.evaluate(scan, { rootSel: sel, minPx: 10 })).map((x) => `${r} ${x}`))
}
await b.close()
const uniq = [...new Set(found)].filter((x) => !ON_PURPOSE.some((id) => x.startsWith(id + ' ')) && !/ 0\.0px /.test(x))
console.log(uniq.join('\n'))
console.log(`\n${uniq.length}건`)
