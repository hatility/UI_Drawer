// 사이트 전체 점검: npm run audit (개발 서버가 켜져 있어야 해요)
// 모든 화면을 PC(1280) · 휴대폰(390) · 다크 모드로 열어서 이런 것을 찾아요.
//  콘솔 오류 · 가로로 넘치는 화면 · 이름 없는 버튼과 링크 · 글자가 잘린 버튼 · 너무 작은 누르는 곳(휴대폰)
//  · 겹친 id · 설명 없는 그림 · 화면 밖으로 나간 고정 요소
import { chromium } from 'playwright-core'

const BASE = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:5180/'
const ROUTES = ['#/', '#/dict', '#/dict/feedback', '#/dict/price', '#/w/snackbar', '#/learn/compare', '#/learn/course', '#/learn/misname', '#/learn/fix', '#/learn/quiz', '#/learn/speed', '#/learn/reverse', '#/learn/find', '#/learn/spot',
  '#/learn/wrong', '#/vs/modal/bottom-sheet', '#/vs/tooltip/popover', '#/annotate', '#/play', '#/tags', '#/mine', '#/compare', '#/news', '#/audit', '#/test', '#/share/%7B%22n%22%3A%22a%22%2C%22i%22%3A%5B%22toast%22%5D%7D', '#/dict?q']
const SITES = ['community', 'bank', 'messenger', 'shop', 'booking', 'join', 'admin', 'delivery', 'music', 'docs', 'route', 'app']
const problems = []
const add = (where, what) => problems.push(`${where} · ${what}`)

const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch())
for (const [w, h, dark] of [[1280, 860, false], [390, 844, false], [390, 844, true]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: dark ? 'dark' : 'light', hasTouch: w < 500, isMobile: w < 500 })
  const tag = `${w}${dark ? ' 다크' : ''}`
  page.on('pageerror', (e) => add(`${tag} ${page.url().split('#')[1]}`, `오류: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error') add(`${tag} ${page.url().split('#')[1]}`, `콘솔: ${m.text().slice(0, 160)}`) })
  await page.addInitScript(() => { localStorage.setItem('ui-drawer-guide-seen', '1'); localStorage.setItem('ui-drawer-welcome-seen', '1') })
  const check = async (where) => {
    const found = await page.evaluate((mobile) => {
      const out = []
      const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && !el.closest('[inert],[aria-hidden="true"],.pv,.ss-stage,.ec-pv,.dtile-pv,.sheet:not(.on)') }
      const name = (el) => (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || el.querySelector('img')?.alt || '').trim()
      if (document.documentElement.scrollWidth > innerWidth + 1) out.push(`가로로 넘침 ${document.documentElement.scrollWidth - innerWidth}px`)
      for (const el of document.querySelectorAll('button, a[href], [role=button], [role=tab], [role=radio], input:not([type=hidden]), select')) {
        if (!vis(el)) continue
        const r = el.getBoundingClientRect()
        const label = name(el) || (el.id && document.querySelector(`label[for="${el.id}"]`)?.textContent) || el.closest('label')?.textContent || el.getAttribute('placeholder')
        if (!label) out.push(`이름 없는 ${el.tagName.toLowerCase()} .${[...el.classList].join('.')}`)
        if (el.matches('button, a, [role=tab], [role=radio]') && getComputedStyle(el).whiteSpace !== 'normal' && el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible') out.push(`글자 잘림 “${name(el).slice(0, 20)}”`)
        if (mobile && (r.width < 24 || r.height < 24) && !el.closest('.site, .mb, .pg-body, .ss-phone, label') && !(el.closest('p, li') && el.tagName === 'A')) out.push(`누르는 곳이 작음 ${Math.round(r.width)}×${Math.round(r.height)} “${name(el).slice(0, 16)}”`)
        if (r.right > innerWidth + 1 && !el.closest('.chips-scroll, .sub-bar, .pg-mobile-hints, .news-peek, .ln-modes, [class*=scroll]')) out.push(`화면 밖으로 나감 “${name(el).slice(0, 16)}”`)
      }
      // 글자가 칸 밖으로 넘친 제목 · 문단
      for (const el of document.querySelectorAll('h1, h2, h3, p, b, small, span')) {
        if (!vis(el) || !el.textContent.trim() || el.children.length > 2 || el.matches('.lbl')) continue
        const s = getComputedStyle(el)
        if (s.overflow === 'hidden' && s.textOverflow !== 'ellipsis' && el.scrollWidth > el.clientWidth + 2 && !el.closest('.mu-title, .site, .pg-body')) out.push(`글자가 칸을 넘음 “${el.textContent.trim().slice(0, 24)}”`)
      }
      const ids = [...document.querySelectorAll('[id]')].map((e) => e.id); const dup = ids.filter((x, i) => ids.indexOf(x) !== i)
      if (dup.length) out.push(`겹친 id: ${[...new Set(dup)].slice(0, 5).join(', ')}`)
      for (const img of document.querySelectorAll('img:not([alt])')) if (vis(img)) out.push('설명(alt) 없는 그림')
      return [...new Set(out)].slice(0, 12)
    }, w < 500)
    for (const f of found) add(where, f)
  }
  if (dark) await page.addInitScript(() => localStorage.setItem('ui-drawer-prefs', JSON.stringify({ theme: 'dark' })))
  for (const r of ROUTES) {
    await page.goto(BASE + r.replace('#/dict?q', '#/dict'))
    await page.waitForTimeout(r.startsWith('#/play') || r.startsWith('#/w/') ? 1500 : 900)
    if (r === '#/dict?q') { await page.fill('.searchbar input', '없는말없는말'); await page.waitForTimeout(400) }
    await check(`${tag} ${r}`)
    if (r === '#/w/snackbar') for (const t of ['만들기', '더 알기']) { await page.getByRole('tab', { name: t }).click(); await page.waitForTimeout(200); await check(`${tag} ${r} ${t}`) }
    if (r === '#/mine') for (const t of ['기록', '설정']) { await page.getByRole('tab', { name: t }).click(); await page.waitForTimeout(200); await check(`${tag} ${r} ${t}`) }
  }
  for (const s of SITES) {
    await page.goto(BASE + '#/play'); await page.waitForTimeout(900)
    await page.selectOption('.pg-site-pick select', s); await page.waitForTimeout(700)
    await check(`${tag} 체험관 ${s}`)
  }
  await page.close()
}
await browser.close()
console.log(problems.length ? problems.join('\n') : '문제 없음')
console.log(`\n${problems.length}건`)
