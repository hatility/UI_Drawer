// 이 브라우저에만 저장하는 설정 · 모음: 테마, 이름 표기, 내 폴더, 비교 목록, 퀴즈 기록.
// 저장이 막힌 브라우저(사생활 보호 창 등)에서는 이번 방문 동안만 기억해요.
import { useSyncExternalStore } from 'react'

export type Prefs = {
  theme: 'light' | 'dark' | 'auto'
  lang: 'ko' | 'en'
  folders: Record<string, string[]>
  compare: string[]
  quiz: { streak: number; best: number; wrong: string[] }
  /** 보기 설정: 큰 글자 · 고대비 */
  view: { big: boolean; contrast: boolean }
  /** 찾았는데 없던 말 (새 카드 제안용, 이 브라우저에만) */
  misses: string[]
  /** 이번 주 퀴즈 점수 */
  week: { id: string; score: number; best: number }
  /** 카드를 연 횟수 (많이 본 카드 순위, 이 브라우저에만) */
  opens: Record<string, number>
  /** 들른 날 (연속 방문 업적용, 최근 60일) */
  days: string[]
  /** 디자인 시스템 점검표: 우리 서비스에 있는 UI */
  audit: string[]
  /** 하루 한 번 ‘오늘의 UI’ 알림 */
  notify: boolean
  /** 이름표에 더할 내 규칙 [CSS 선택자, 카드 id] */
  rules: [string, string][]
  /** 우리 팀이 부르는 이름: 카드 id → 이름들 (검색에도 쓰여요) */
  team: Record<string, string[]>
}
const KEY = 'ui-drawer-prefs'
const DEFAULT: Prefs = { theme: 'auto', lang: 'ko', folders: { 즐겨찾기: [] }, compare: [], quiz: { streak: 0, best: 0, wrong: [] }, view: { big: false, contrast: false }, misses: [], week: { id: '', score: 0, best: 0 }, opens: {}, days: [], audit: [], notify: false, rules: [], team: {} }
/** 이번 주 이름 (월요일 기준, 예: 2026-W47) */
export const weekId = (d = new Date()) => { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y = t.getUTCFullYear(); return `${y}-W${String(Math.ceil(((+t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7)).padStart(2, '0')}` }

let state: Prefs = (() => {
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return DEFAULT }
})()
const subs = new Set<() => void>()

export function setPrefs(fn: (p: Prefs) => Partial<Prefs>) {
  state = { ...state, ...fn(state) }
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* 이번 방문만 */ }
  subs.forEach((f) => f())
}
export const getPrefs = () => state
export const usePrefs = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => state)

/** 폴더에 담기 · 빼기 (같은 카드를 다시 누르면 빼요) */
export const toggleIn = (folder: string, id: string) => setPrefs((p) => {
  const list = p.folders[folder] ?? []
  return { folders: { ...p.folders, [folder]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] } }
})
export const addFolder = (name: string) => setPrefs((p) => (p.folders[name] ? {} : { folders: { ...p.folders, [name]: [] } }))
export const removeFolder = (name: string) => setPrefs((p) => { const f = { ...p.folders }; delete f[name]; return { folders: Object.keys(f).length ? f : { 즐겨찾기: [] } } })
/** 비교는 최대 4장: 넘치면 가장 먼저 담은 것부터 빠져요 */
export const toggleCompare = (id: string) => setPrefs((p) => ({ compare: p.compare.includes(id) ? p.compare.filter((x) => x !== id) : [...p.compare, id].slice(-4) }))
export const quizResult = (id: string, right: boolean) => setPrefs((p) => {
  const wk = weekId(), w = p.week.id === wk ? p.week : { id: wk, score: 0, best: p.week.best }
  const week = right ? { ...w, score: w.score + 1, best: Math.max(w.best, w.score + 1) } : w
  const streak = right ? p.quiz.streak + 1 : 0
  const wrong = right ? p.quiz.wrong.filter((x) => x !== id) : [id, ...p.quiz.wrong.filter((x) => x !== id)].slice(0, 30)
  return { quiz: { streak, best: Math.max(p.quiz.best, streak), wrong }, week }
})
/** 카드를 열 때마다 세요 (최대 300종) */
export const noteOpen = (id: string) => setPrefs((p) => ({ opens: Object.fromEntries(Object.entries({ ...p.opens, [id]: (p.opens[id] ?? 0) + 1 }).sort((a, b) => b[1] - a[1]).slice(0, 300)) }))
/** 오늘 들렀다고 적어요. 새로 들른 날이면 true */
export const today = () => new Date().toLocaleDateString('sv-SE')
export const noteDay = () => { const d = today(); if (state.days.includes(d)) return false; setPrefs((p) => ({ days: [...p.days, d].slice(-60) })); return true }
/** 오늘까지 며칠 연속으로 들렀나 */
export const streakDays = (days: string[]) => { let n = 0; const t = new Date(); for (;;) { const d = new Date(t); d.setDate(t.getDate() - n); if (!days.includes(d.toLocaleDateString('sv-SE'))) return n; n++ } }
/** 검색해도 없던 말을 모아 둬요 (최대 30개) */
export const noteMiss = (q: string) => setPrefs((p) => (p.misses.includes(q) ? {} : { misses: [q, ...p.misses].slice(0, 30) }))
/** 내보낸 JSON 을 다시 넣어요. 모르는 값은 버려요 */
export function importPrefs(json: string): boolean {
  try {
    const d = JSON.parse(json)
    if (!d || typeof d !== 'object') return false
    const ok = (x: unknown): x is string[] => Array.isArray(x) && x.every((y) => typeof y === 'string')
    const folders = d.folders && typeof d.folders === 'object' ? Object.fromEntries(Object.entries(d.folders).filter(([k, v]) => typeof k === 'string' && k.length <= 20 && ok(v))) as Record<string, string[]> : undefined
    setPrefs((p) => ({ ...(folders ? { folders } : {}), ...(ok(d.compare) ? { compare: d.compare.slice(0, 4) } : {}) }))
    if (ok(d.dex)) { try { localStorage.setItem('ui-drawer-dex', JSON.stringify(d.dex)) } catch { /* 이번 방문만 */ } }
    return true
  } catch { return false }
}

/** html 의 data-theme 를 설정에 맞춰요 (auto 면 기기 설정을 따라요) */
export function applyView(v: Prefs['view']) {
  document.documentElement.toggleAttribute('data-big', v.big)
  document.documentElement.toggleAttribute('data-contrast', v.contrast)
}
export function applyTheme(t: Prefs['theme']) {
  const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
}
