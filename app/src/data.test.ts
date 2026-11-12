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
  expect(ENTRIES.filter((e) => e.drawer === 'style')).toHaveLength(18)
  expect(search('그래버')[0].id).toBe('grabber')
  expect(search('없는말쀍')).toEqual([])
  expect(search('  ')).toHaveLength(ENTRIES.length)
})
