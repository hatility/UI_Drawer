import { expect, test } from 'vitest'
import { DRAWERS, ENTRIES, byId, choseong, search } from './data'

test('항목 id 는 겹치지 않고, 서랍 · 헷갈리는 친구는 모두 있는 것을 가리켜요', () => {
  expect(byId.size).toBe(ENTRIES.length)
  const drawers = new Set(DRAWERS.map((d) => d.id))
  for (const e of ENTRIES) {
    expect(drawers.has(e.drawer), e.id).toBe(true)
    for (const v of e.vs ?? []) expect(byId.has(v.id), `${e.id} → ${v.id}`).toBe(true)
  }
})

test('이름 · 영어 · 다른 이름 · 모양 · 초성으로 찾아요', () => {
  expect(choseong('토스트')).toBe('ㅌㅅㅌ')
  expect(search('토스트')[0].id).toBe('toast')
  expect(search('snack bar')[0].id).toBe('snackbar')
  expect(search('팝업')[0].id).toBe('modal')
  expect(search('아래에서 올라오는')[0].id).toBe('bottom-sheet')
  expect(search('ㅂㄹㄷㅋㄹ')[0].id).toBe('breadcrumb')
  expect(search('유리')[0].id).toBe('glassmorphism')
  expect(search('ㄴㅁㅍㅈ')[0].id).toBe('neumorphism')
  expect(ENTRIES.filter((e) => e.drawer === 'style')).toHaveLength(50)
  expect(search('그래버')[0].id).toBe('grabber')
  expect(search('없는말쀍')).toEqual([])
  expect(search('  ')).toHaveLength(ENTRIES.length)
})

test('모든 카드에 자기 그림이 있어요 (Preview.tsx 의 case)', async () => {
  const { readFileSync } = await import('node:fs')
  const src = readFileSync(new URL('./Preview.tsx', import.meta.url), 'utf8')
  const cases = new Set([...src.matchAll(/case '([^']+)'/g)].map((m) => m[1]))
  expect(ENTRIES.filter((e) => !cases.has(e.id)).map((e) => e.id)).toEqual([])
})

test('주제별 서랍에 함께 보여 주는 카드는 모두 있는 카드예요', async () => {
  const { ALSO } = await import('./data')
  for (const [d, ids] of Object.entries(ALSO)) for (const id of ids!) expect(byId.has(id), `${d} → ${id}`).toBe(true)
})

test('체험관 표시가 붙은 카드는 체험관 어딘가에 그 요소가 있어요', async () => {
  const { readFileSync } = await import('node:fs')
  const src = ['Playground', 'Mobile', 'Community', 'Bank', 'Messenger', 'Shop', 'Booking', 'Join', 'Admin', 'Delivery', 'Music', 'Docs', 'RouteMap'].map((f) => readFileSync(new URL(`./${f}.tsx`, import.meta.url), 'utf8')).join('\n')
  // 디자인 스타일은 사이트 전체에 입혀서 요소 하나가 아니에요
  const missing = ENTRIES.filter((e) => e.play && e.drawer !== 'style' && !src.includes(`data-ui="${e.id}"`) && !new RegExp(`data-ui=\\{[^}]*'${e.id}'`).test(src)).map((e) => e.id)
  expect(missing).toEqual([])
})

test('헷갈리는 짝은 겹치지 않고, 두 카드 모두 있어요', async () => {
  const { makePairs } = await import('./Learn')
  const pairs = makePairs()
  const keys = pairs.map((p) => `${p.a.id}|${p.b.id}`)
  expect(new Set(keys).size).toBe(keys.length)
  for (const p of pairs) expect(p.a.id < p.b.id).toBe(true)
  const ts = pairs.find((p) => p.a.id === 'snackbar' && p.b.id === 'toast')!
  expect(ts.aboutA).toContain('스낵바') // toast 쪽에서 스낵바를 설명한 문장
  expect(ts.aboutB).toContain('토스트')
})

test('조사는 받침에 맞춰 붙어요', async () => {
  const { josa } = await import('./data')
  expect(josa('툴팁', '이에요', '예요')).toBe('툴팁이에요')
  expect(josa('토스트', '이에요', '예요')).toBe('토스트예요')
  expect(josa('정기 배송', '은', '는')).toBe('정기 배송은')
  expect(josa('GNB', '이에요', '예요')).toBe('GNB예요')
})

test('금액을 한글로 읽어요', async () => {
  const { readWon } = await import('./Bank')
  expect(readWon(12000)).toBe('만 이천 원')
  expect(readWon(1284500)).toBe('백이십팔만 사천오백 원')
  expect(readWon(100000000)).toBe('억 원')
  expect(readWon(0)).toBe('')
})

test('어디서나 이름표의 규칙은 모두 사전에 있는 카드로 이어져요', async () => {
  const { SCAN_RULES, bookmarklet } = await import('./scan')
  for (const [, id, ko] of SCAN_RULES) { expect(byId.has(id), id).toBe(true); expect(ko.length).toBeGreaterThan(0) }
  const code = bookmarklet('https://example.test/')
  expect(code.startsWith('javascript:')).toBe(true)
  // 북마크로 저장하면 주소로 다뤄져요: # 뒤가 잘리거나 줄바꿈이 섞이면 안 돼요
  const url = new URL(code)
  expect(url.hash).toBe('')
  expect(code).not.toMatch(/[#\n\r\t]/)
  expect(code.length).toBeLessThan(14000)
  const js = decodeURIComponent(code.slice('javascript:'.length))
  expect(js).toContain('https://example.test/')
  expect(() => new Function(js)).not.toThrow()
})

test('큰 서랍의 상세 항목에 적은 카드는 모두 그 서랍에 있어요', async () => {
  const { misplaced } = await import('./subs')
  expect(misplaced()).toEqual([])
})

test('동의어는 모두 실제 카드로 이어지고, 오타도 짐작해요', async () => {
  const { SYNONYMS, guess } = await import('./data')
  for (const [k, v] of Object.entries(SYNONYMS)) for (const w of v) expect(search(w).length, `${k} → ${w}`).toBeGreaterThan(0)
  expect(search('팝업').some((e) => e.id === 'modal')).toBe(true)
  expect(guess('스낵빠').some((e) => e.id === 'snackbar')).toBe(true)
})

test('체험 사이트 CSS가 쓰는 테마 변수는 모두 정의돼 있어요', async () => {
  const { readFileSync } = await import('node:fs')
  const used = new Set(readFileSync(new URL('./sites.css', import.meta.url), 'utf8').match(/var\(--b-[a-z0-9-]+/g)!.map((v) => v.slice(4)))
  const defs = readFileSync(new URL('./playground.css', import.meta.url), 'utf8')
  expect([...used].filter((v) => !defs.includes(`${v}:`))).toEqual([])
})

test('카드 시연에서 주인공을 직접 정한 카드는 모두 있는 카드예요', async () => {
  const { FOCUS_OF } = await import('./CardDemo')
  expect(Object.keys(FOCUS_OF).filter((id) => !byId.has(id))).toEqual([])
  expect(Object.keys(FOCUS_OF).length).toBeGreaterThanOrEqual(50)
})

test('영어 설명은 있는 카드에만', async () => {
  const { DESC_EN } = await import('./i18n')
  const { byId } = await import('./data')
  expect(Object.keys(DESC_EN).filter((id) => !byId.has(id))).toEqual([])
})

test('덧붙인 이야기(lore)에 적은 카드는 모두 있어요', async () => {
  const { loreMissing } = await import('./lore')
  expect(loreMissing()).toEqual([])
})

test('바이브 코딩 프롬프트: 모든 카드에서 만들어지고, 직접 다듬은 카드는 실제로 있어요', async () => {
  const { cardPrompt, screenPrompt, MUST, TECHS } = await import('./prompt')
  const { ENTRIES, byId } = await import('./data')
  expect(Object.keys(MUST).filter((id) => !byId.has(id))).toEqual([])
  for (const e of ENTRIES) for (const t of TECHS) { const p = cardPrompt(e, t, 'detail'); expect(p).toContain(e.ko); expect(p).not.toMatch(/undefined/) }
  expect(cardPrompt(byId.get('snackbar')!, 'React', 'detail')).toContain('토스트')
  expect(screenPrompt(ENTRIES.slice(0, 3), 'HTML')).toContain('1.')
})
