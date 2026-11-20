// UI Drawer: 이름이 생각 안 나는 UI를 서랍에서 꺼내 보는 사전. (머티리얼 3 · 반응형)
// 목적지는 다섯. PC에서는 왼쪽 레일, 휴대폰에서는 아래 탭 바로 보여요.
//  #/                홈              #/dict            사전 (전체)
//  #/dict/<서랍id>   사전 · 그 서랍   #/learn           배우기 (헷갈리는 UI)
//  #/play            체험관          #/tags            어디서나 이름표
//  #/play/<id>/<n>   체험관에서 그 UI부터 보여 주기 (n: 같은 카드를 다시 눌러도 다시 보여 주려고)
//  #/w/<id>          사전에서 그 카드를 바로 열기 (이름표 · 링크 공유)
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, Check, ChevronLeft, ChevronRight, Columns3, Download, ExternalLink, Flag, FolderPlus, GraduationCap, HelpCircle, Home as HomeIcon, Languages, Link2, Moon, MoreHorizontal, MousePointerClick, Newspaper, Play, Search, Star, Sun, SunMoon, Tag, Volume2, X, Copy } from 'lucide-react'
import { DRAWERS, ENTRIES, byId, guess, search, type DrawerId, type Entry } from './data'
import { addFolder, applyTheme, applyView, noteDay, noteMiss, noteOpen, setPrefs, toggleCompare, toggleIn, usePrefs } from './prefs'
import { a11yTips, makeTips } from './a11y'
import { cardCSS, cardHTML, cardReact, cardSVG, cardTailwind, cardVue, downloadPNG, downloadSVG } from './exportCard'
import { HISTORY, KOREA, LEVEL_NAME, NAMES, levelOf, mistakesOf, tellOf } from './lore'
import { SUBS, splitDrawer } from './subs'
import { Preview } from './Preview'
import { CardDemo } from './CardDemo'
import { Grid } from './Grid'
import { Home, dailyQuiz } from './Home'
import { Palette } from './Palette'
import { DevDwell, Trial, TrialBar } from './Trial'
// 무거운 화면은 들어갈 때 불러와요 (첫 화면을 가볍게)
const Playground = lazy(() => import('./Playground').then((m) => ({ default: m.Playground })))
const Learn = lazy(() => import('./Learn').then((m) => ({ default: m.Learn })))
const Tags = lazy(() => import('./Tags').then((m) => ({ default: m.Tags })))
const Mine = lazy(() => import('./Pages').then((m) => ({ default: m.Mine })))
const Compare = lazy(() => import('./Pages').then((m) => ({ default: m.Compare })))
const News = lazy(() => import('./Pages').then((m) => ({ default: m.News })))
const Audit = lazy(() => import('./Pages').then((m) => ({ default: m.Audit })))
const Versus = lazy(() => import('./Pages').then((m) => ({ default: m.Versus })))
const Annotate = lazy(() => import('./Annotate').then((m) => ({ default: m.Annotate })))
const ShareImport = lazy(() => import('./Pages').then((m) => ({ default: m.ShareImport })))
import { issueUrl } from './about'
import { TECHS, cardPrompt, useVibe, type Tech, type Tone } from './prompt'
import { Snackbar, copyText, say } from './snack'
import { DESC_EN, DRAWER_EN, SUB_EN, useTx } from './i18n'
import './app.css'

type Route = 'home' | 'dict' | 'play' | 'learn' | 'tags' | 'mine' | 'compare' | 'news' | 'share' | 'audit' | 'test' | 'vs' | 'annotate'
const NAV: [Route, string, string, typeof BookOpen][] = [
  ['home', '#/', '홈', HomeIcon], ['dict', '#/dict', '사전', BookOpen], ['learn', '#/learn', '배우기', GraduationCap], ['play', '#/play', '체험관', MousePointerClick], ['tags', '#/tags', '이름표', Tag],
]
const NAV_EN: Record<Route, string> = { home: 'Home', dict: 'Dictionary', learn: 'Learn', play: 'Playground', tags: 'Name tags', mine: 'My drawer', compare: 'Compare', news: 'News', share: 'Shared', audit: 'Checklist', test: 'Usability test', vs: 'Side by side', annotate: 'Label a screen' }
const isDrawer = (x: string): x is DrawerId => DRAWERS.some((d) => d.id === x)

const readHash = () => {
  const [, route = '', arg = '', n = ''] = location.hash.split('/')
  const r: Route = (['play', 'learn', 'tags', 'dict', 'mine', 'compare', 'news', 'share', 'audit', 'test', 'vs', 'annotate'] as string[]).includes(route) ? (route as Route) : route === 'w' ? 'dict' : 'home'
  return { route: r, arg: route === 'w' ? '' : arg, n, word: route === 'w' ? arg : '' }
}
/** 글자를 적는 곳에서는 단축키를 가로채지 않아요 */
const typing = (el: Element | null) => !!el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || (el as HTMLElement).isContentEditable)

// ─── 내 서랍: 열어 보거나 체험관에서 본 UI 이름을 모아요 (이 브라우저에만 저장) ───
const DEX_KEY = 'ui-drawer-dex'
function useDex() {
  const [dex, setDex] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(DEX_KEY) || '[]')) } catch { return new Set() }
  })
  const add = useCallback((id: string) => setDex((d) => {
    if (d.has(id) || !byId.has(id)) return d
    const n = new Set(d).add(id)
    try { localStorage.setItem(DEX_KEY, JSON.stringify([...n])) } catch { /* 저장이 막힌 브라우저면 이번 방문 동안만 */ }
    return n
  }), [])
  return [dex, add] as const
}

export function App() {
  const [hash, setHash] = useState(readHash)
  const [group, setGroup] = useState<'part' | 'topic'>('part')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const [dex, collect] = useDex()
  const prefs = usePrefs()
  // 다크 모드: 직접 고르거나, ‘자동’이면 기기 설정을 따라요
  useEffect(() => {
    applyTheme(prefs.theme)
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const on = () => applyTheme(prefs.theme)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [prefs.theme])
  useEffect(() => applyView(prefs.view), [prefs.view])
  // 첫 화면이 뜬 뒤 한가할 때 나머지 화면도 미리 받아 둬요 (오프라인 저장 · 빠른 이동)
  useEffect(() => { const t = setTimeout(() => { import('./Playground'); import('./Learn'); import('./Tags'); import('./Pages') }, 4000); return () => clearTimeout(t) }, [])
  const nextTheme = () => setPrefs((p) => ({ theme: p.theme === 'auto' ? 'dark' : p.theme === 'dark' ? 'light' : 'auto' }))
  const themeLabel = { auto: '테마: 기기 설정 따르기', dark: '테마: 어둡게', light: '테마: 밝게' }[prefs.theme]
  const ThemeIcon = prefs.theme === 'dark' ? Moon : prefs.theme === 'light' ? Sun : SunMoon
  const tx = useTx()
  const toggleLang = () => setPrefs((p) => ({ lang: p.lang === 'ko' ? 'en' : 'ko' }))
  // 상세 창을 열 때 방문 기록을 하나 쌓아서, 휴대폰 ‘뒤로 가기’가 사이트를 떠나지 않고 창부터 닫게 해요
  const pushed = useRef(false)
  const openRef = useRef<string | null>(null)
  openRef.current = open
  const close = useCallback(() => { if (pushed.current) { pushed.current = false; history.back() } else setOpen(null) }, [])
  const show = useCallback((id: string) => {
    if (!openRef.current && !pushed.current) { history.pushState({ sheet: true }, ''); pushed.current = true }
    setOpen(id); collect(id); noteOpen(id)
  }, [collect])
  useEffect(() => {
    const on = () => { if (openRef.current) setOpen(null); pushed.current = false }
    addEventListener('popstate', on)
    return () => removeEventListener('popstate', on)
  }, [])
  const [palette, setPalette] = useState(false)
  useEffect(() => {
    const on = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p) } }
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  }, [])
  // 오늘 처음 들렀으면 기록하고, 알림을 켜 둔 사람에게 ‘오늘의 UI’를 하나 알려 줘요 (서버 없이 이 기기에서만)
  useEffect(() => {
    if (!noteDay() || !prefs.notify || typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    const e = dailyQuiz(Math.floor(Date.now() / 864e5) + 999).answer
    try { new Notification(`오늘의 UI · ${e.ko}`, { body: e.desc, icon: 'icon-192.png', tag: 'ui-drawer-today' }).onclick = () => { focus(); show(e.id) } } catch { /* 알림이 막힌 브라우저 */ }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const drawer: DrawerId | 'all' = hash.route === 'dict' && isDrawer(hash.arg) ? hash.arg : 'all'

  // 화면을 옮기면: 열려 있던 상세 창은 닫고, 전에 보던 화면이면 보던 자리로 돌아가요
  const scrollAt = useRef<Record<string, number>>({})
  useEffect(() => {
    let h = location.hash
    const keep = () => { scrollAt.current[h] = scrollY }
    const on = () => {
      const next = readHash()
      if (!next.word) { setOpen(null); pushed.current = false }
      h = location.hash
      setHash(next)
      const y = scrollAt.current[h] ?? 0
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: y })))
    }
    addEventListener('scroll', keep, { passive: true })
    addEventListener('hashchange', on)
    return () => { removeEventListener('scroll', keep); removeEventListener('hashchange', on) }
  }, [])
  // #/w/<id>: 그 카드를 바로 열어요
  useEffect(() => { if (hash.word && byId.has(hash.word)) show(hash.word) }, [hash.word, show])

  const pick = (d: DrawerId | 'all') => { setQ(''); location.hash = d === 'all' ? '#/dict' : `#/dict/${d}` }
  const find = (x: string) => { setQ(x); location.hash = '#/dict' }

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#/"><Logo /><b>UI Drawer</b></a>
        <span className="top-tools">
          <button className="icon-btn" onClick={() => setPalette(true)} aria-label={tx('빠른 이동', 'Quick jump')} title={tx('빠른 이동 (⌘K · Ctrl+K)', 'Quick jump (⌘K)')}><Search size={20} /></button>
          <button className="icon-btn" onClick={nextTheme} aria-label={themeLabel} title={themeLabel}><ThemeIcon size={20} /></button>
          <a className="dex-pill" href="#/mine" title="내 서랍에 모은 UI 이름">{tx('내 서랍', 'My drawer')} {dex.size}/{ENTRIES.length}</a>
        </span>
      </header>

      <nav className="rail" aria-label="메뉴">
        <a className="rail-logo" href="#/" aria-label="UI Drawer 홈"><Logo /></a>
        {NAV.map(([r, href, label, Icon]) => (
          <a key={r} href={href} className={`rail-item${hash.route === r ? ' on' : ''}`} aria-current={hash.route === r ? 'page' : undefined}>
            <span><Icon size={22} /></span>{tx(label, NAV_EN[r])}
          </a>
        ))}
        <span className="rail-sp" />
        <div className="rail-mini">
          <button onClick={() => setPalette(true)} title={tx('빠른 이동 (⌘K · Ctrl+K)', 'Quick jump (⌘K)')}><Search size={18} /><span>{tx('빠른 이동', 'Jump')}</span></button>
          <a href="#/mine" className={hash.route === 'mine' ? 'on' : ''} title="내 서랍 · 폴더 · 오답 노트"><Star size={18} /><span>{tx('내 서랍', 'My drawer')}</span></a>
          <button onClick={nextTheme} title={themeLabel}><ThemeIcon size={18} /><span>{tx({ auto: '자동', dark: '어둡게', light: '밝게' }[prefs.theme], { auto: 'Auto', dark: 'Dark', light: 'Light' }[prefs.theme])}</span></button>
        </div>
      </nav>

      <main className="main">
        <Suspense fallback={<PageSkeleton />}>
        {hash.route === 'play' ? <Playground onOpen={show} onSee={collect} show={hash.arg || undefined} showKey={hash.n} />
          : hash.route === 'learn' ? <Learn key={hash.arg} onOpen={show} dex={dex} duel={hash.arg === 'duel' ? hash.n : ''} start={hash.arg} />
          : hash.route === 'tags' ? <Tags />
          : hash.route === 'home' ? <Home onOpen={show} onSearch={find} dex={dex} collect={collect} />
          : hash.route === 'mine' ? <Mine onOpen={show} dex={dex} />
          : hash.route === 'compare' ? <Compare onOpen={show} />
          : hash.route === 'news' ? <News onOpen={show} dex={dex} />
          : hash.route === 'audit' ? <Audit onOpen={show} />
          : hash.route === 'test' ? <Trial />
          : hash.route === 'annotate' ? <Annotate onOpen={show} />
          : hash.route === 'vs' ? <Versus a={hash.arg} b={hash.n} onOpen={show} />
          : hash.route === 'share' ? <ShareImport arg={hash.arg} onOpen={show} dex={dex} />
          : <Dictionary key={drawer} drawer={drawer} pick={pick} group={drawer === 'all' ? group : DRAWERS.find((d) => d.id === drawer)!.group} setGroup={(g) => { setGroup(g); pick('all') }} q={q} setQ={setQ} onOpen={show} dex={dex} />}
        </Suspense>
      </main>

      <Sheet id={open} onOpen={show} onClose={close} />
      {palette && <Palette onClose={() => setPalette(false)} onOpen={(id) => { setPalette(false); show(id) }} />}
      <Snackbar />
      <TrialBar />
      <DevDwell />
      {prefs.compare.length > 0 && hash.route !== 'compare' && (
        <div className="cmp-tray" role="status"><Columns3 size={18} /><span>비교 {prefs.compare.length}/4</span><a className="btn" href="#/compare">비교하기</a><button className="icon-btn" aria-label="비교 비우기" onClick={() => setPrefs(() => ({ compare: [] }))}><X size={18} /></button></div>
      )}
    </div>
  )
}

/** 화면을 불러오는 동안: 그 자리에 올 모양(제목 · 카드 칸)을 회색으로 먼저 보여 줘요 */
function PageSkeleton() {
  return (
    <div className="page-skel" role="status" aria-label="불러오는 중">
      <i className="t" /><i className="s" />
      <div>{Array.from({ length: 6 }, (_, k) => <i key={k} />)}</div>
    </div>
  )
}

function Logo() {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
      <rect x="2" y="3" width="28" height="26" rx="8" fill="var(--md-primary)" />
      <rect x="6.5" y="8" width="19" height="7" rx="3" fill="var(--md-primary-container)" />
      <rect x="6.5" y="17" width="19" height="7" rx="3" fill="var(--md-primary-container)" className="logo-drawer" />
      <rect x="13" y="10.5" width="6" height="2" rx="1" fill="var(--md-primary)" />
      <rect x="13" y="19.5" width="6" height="2" rx="1" fill="var(--md-primary)" className="logo-drawer" />
    </svg>
  )
}

// ─── 사전 ───
type DictProps = { drawer: DrawerId | 'all'; pick: (d: DrawerId | 'all') => void; group: 'part' | 'topic'; setGroup: (g: 'part' | 'topic') => void; q: string; setQ: (q: string) => void; onOpen: (id: string) => void; dex: Set<string> }
function Dictionary({ drawer, pick, group, setGroup, q, setQ, onOpen, dex }: DictProps) {
  const input = useRef<HTMLInputElement>(null)
  const [sub, setSub] = useState('all')
  const tx = useTx()
  useEffect(() => {
    const on = (e: KeyboardEvent) => { if (e.key === '/' && !typing(document.activeElement)) { e.preventDefault(); input.current?.focus() } }
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  }, [])

  const team = usePrefs().team
  const found = useMemo(() => {
    if (!q.trim()) return null
    const t = q.trim().replace(/\s/g, '')
    const mine = Object.entries(team).filter(([, names]) => names.some((n) => n.replace(/\s/g, '').includes(t))).map(([id]) => byId.get(id)).filter(Boolean) as Entry[]
    const rest = search(q).filter((e) => !mine.includes(e))
    return [...mine, ...rest]
  }, [q, team])
  // 검색해도 없으면 잠깐 기다렸다가 ‘없던 말’로 기록해요 (치는 중인 글자는 빼려고)
  useEffect(() => { if (!found || found.length) return; const t = setTimeout(() => noteMiss(q.trim()), 1500); return () => clearTimeout(t) }, [found, q])
  // 키보드: J · → 다음 카드, K · ← 이전 카드, Enter 열기
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (typing(document.activeElement) || e.metaKey || e.ctrlKey || e.altKey) return
      const step = e.key === 'j' || e.key === 'J' ? 1 : e.key === 'k' || e.key === 'K' ? -1 : 0
      if (!step) return
      const cards = [...document.querySelectorAll<HTMLElement>('.main .ec')]
      const i = cards.indexOf(document.activeElement as HTMLElement)
      const next = cards[Math.max(0, Math.min(cards.length - 1, i < 0 ? 0 : i + step))]
      if (next) { e.preventDefault(); next.focus(); next.scrollIntoView({ block: 'nearest' }) }
    }
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  }, [])
  const inGroup = DRAWERS.filter((d) => d.group === group)
  const subs = drawer === 'all' ? [] : splitDrawer(drawer)
  const count = (id: DrawerId) => splitDrawer(id).reduce((n, s) => n + s.list.length, 0)
  const here = DRAWERS.find((d) => d.id === drawer)

  return (
    <>
      <div className="dict-bar">
        <label className="searchbar">
          <Search size={22} />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx('이름이나 생김새로 찾아보세요', 'Search by name or shape (J · K to move)')} aria-label="UI 이름 찾기" />
          {q ? <button className="icon-btn" aria-label="지우기" onClick={() => { setQ(''); input.current?.focus() }}><X size={20} /></button> : <kbd>/</kbd>}
        </label>
        {!found && (
          <div className="drawer-bar">
            <div className="seg" role="radiogroup" aria-label="서랍 묶음">
              {(['part', 'topic'] as const).map((g) => <button key={g} role="radio" aria-checked={group === g} className={group === g ? 'on' : ''} onClick={() => setGroup(g)}>{group === g && <Check size={16} />}{g === 'part' ? tx('UI 부품', 'UI parts') : tx('주제별', 'Topics')}</button>)}
            </div>
            <div className="chips-scroll" role="tablist" aria-label="서랍">
              <button role="tab" aria-selected={drawer === 'all'} className={`fchip${drawer === 'all' ? ' on' : ''}`} onClick={() => pick('all')}>{tx('전체', 'All')}</button>
              {inGroup.map((d) => <button key={d.id} role="tab" aria-selected={drawer === d.id} className={`fchip${drawer === d.id ? ' on' : ''}`} onClick={() => pick(d.id)}>{tx(d.label, DRAWER_EN[d.id][0])}<small>{count(d.id)}</small></button>)}
            </div>
          </div>
        )}
        {!found && subs.length > 1 && (
          <div className="sub-bar" role="tablist" aria-label="상세 항목">
            {[{ key: 'all', label: '모두', n: subs.reduce((n, s) => n + s.list.length, 0) }, ...subs.map((s) => ({ key: s.key, label: s.label, n: s.list.length }))].map((s) => (
              <button key={s.key} role="tab" aria-selected={sub === s.key} className={`subchip${sub === s.key ? ' on' : ''}`} onClick={() => setSub(s.key)}>{tx(s.label, SUB_EN[s.key] ?? s.label)} <small>{s.n}</small></button>
            ))}
          </div>
        )}
      </div>

      {found ? (
        <section className="group">
          <h2>‘{q.trim()}’ <small>{found.length}장</small></h2>
          {found.length ? <Grid list={found} onOpen={onOpen} dex={dex} /> : (
            <div className="empty empty--box">
              <b>‘{q.trim()}’ 카드는 아직 없어요.</b>
              <p>이름 대신 생김새로 찾아보세요. 이런 식으로 적으면 돼요.</p>
              <div className="guess">{['아래에서 올라오는 창', '점 세 개', '빙글빙글 도는 것', '옆으로 넘기는 사진'].map((x) => <button key={x} className="chip" onClick={() => setQ(x)}>{x}</button>)}</div>
              {guess(q).length > 0 && <><p>혹시 이 카드를 찾으셨나요?</p><div className="guess">{guess(q).map((e) => <button key={e.id} className="chip" onClick={() => onOpen(e.id)}>{e.ko}</button>)}</div></>}
              <a className="btn-text" href={issueUrl('new-card', `[새 카드] ${q.trim()}`, { ko: q.trim() })} target="_blank" rel="noopener noreferrer">{tx('이 이름으로 새 카드 제안하기', 'Suggest this as a new card')}</a>
            </div>
          )}
        </section>
      ) : !here ? inGroup.map((d) => (
        <section key={d.id} className="group">
          <h2><button className="group-link" onClick={() => pick(d.id)}>{tx(d.label, DRAWER_EN[d.id][0])}</button> <small>{tx(d.note, DRAWER_EN[d.id][1])}</small></h2>
          {SUBS[d.id] ? splitDrawer(d.id).map((s) => (
            <div key={s.key} className="subgroup"><h3>{tx(s.label, SUB_EN[s.key] ?? s.label)} <small>{s.list.length}</small></h3><Grid list={s.list} onOpen={onOpen} dex={dex} /></div>
          )) : <Grid list={ENTRIES.filter((e) => e.drawer === d.id)} onOpen={onOpen} dex={dex} />}
        </section>
      )) : (
        <section className="group">
          <h2>{tx(here.label, DRAWER_EN[here.id][0])} <small>{tx(here.note, DRAWER_EN[here.id][1])}</small></h2>
          {subs.filter((s) => sub === 'all' || s.key === sub).map((s) => (
            <div key={s.key} className="subgroup">{subs.length > 1 && <h3>{tx(s.label, SUB_EN[s.key] ?? s.label)} <small>{s.list.length}</small></h3>}<Grid list={s.list} onOpen={onOpen} dex={dex} /></div>
          ))}
        </section>
      )}
    </>
  )
}

// ─── 상세: PC에서는 옆에서 나오는 사이드 시트, 휴대폰에서는 아래에서 올라오는 바텀시트 ───
// 내용은 탭 셋으로 나눠요. 이해하기(언제 · 헷갈리기 쉬운 것) · 만들기(AI 프롬프트 · 확인할 것 · 접근성, 코드는 접어 둠) · 더 알기(다른 이름 · 변천사 · 이어진 카드, 일할 때 쓰는 도구는 접어 둠)
type Tab = 'basic' | 'make' | 'more'
/** 복사할 수 있는 코드 형식 */
const FMT = { HTML: (pv: HTMLElement) => cardHTML(pv), React: cardReact, Vue: cardVue, CSS: cardCSS, Tailwind: cardTailwind, SVG: (pv: HTMLElement) => cardSVG(pv) } as const
type Fmt = keyof typeof FMT
/** ‘~요’로 끝나는 문장에는 마침표를 찍어 끝맺어요 */
const end = (t: string) => (/[요다]$/.test(t) ? t + '.' : t)
/** 이 카드의 앞뒤 카드: 같은 서랍 안에서 화면에 보이는 순서대로 */
const neighbors = (e: Entry) => { const ids = splitDrawer(e.drawer).flatMap((s) => s.list.map((x) => x.id)); const i = ids.indexOf(e.id); return [ids[i - 1], ids[i + 1]] as const }

function Sheet({ id, onOpen, onClose }: { id: string | null; onOpen: (id: string) => void; onClose: () => void }) {
  const last = useRef<string | null>(null)
  if (id) last.current = id
  const e = last.current ? byId.get(last.current) : undefined
  const panel = useRef<HTMLElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const isOpen = id !== null
  const [tab, setTab] = useState<Tab>('basic')
  const [full, setFull] = useState(false)
  const [more, setMore] = useState(false)
  const [fmt, setFmt] = useState<Fmt>('HTML')
  const [vibe, setVibe] = useVibe()
  const tx = useTx()
  const prefs = usePrefs()
  /** 상세 창의 그림(움직임을 멈춘 상태)을 꺼내요 */
  const grab = (fn: (pv: HTMLElement) => void) => { const pv = panel.current?.querySelector<HTMLElement>('.cd .pv'); if (pv) fn(pv) }
  const [prev, next] = e ? neighbors(e) : [undefined, undefined]

  useEffect(() => {
    panel.current?.toggleAttribute('inert', !isOpen)
    // 닫으면 연 자리(카드)로 초점을 돌려줘요
    if (!isOpen) { opener.current?.focus(); opener.current = null; setFull(false); return }
    if (!opener.current) opener.current = document.activeElement as HTMLElement | null
    panel.current?.focus()
    const on = (k: KeyboardEvent) => {
      if (k.key === 'Escape') onClose()
      // 좌우 화살표로 옆 카드 (글자를 적는 중이 아닐 때만)
      if (!typing(document.activeElement) && (k.key === 'ArrowLeft' || k.key === 'ArrowRight') && !(document.activeElement as HTMLElement)?.closest('[role=tablist]')) {
        const to = k.key === 'ArrowLeft' ? prev : next
        if (to) { k.preventDefault(); onOpen(to) }
      }
    }
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  }, [isOpen, onClose, onOpen, prev, next])
  useEffect(() => { setTab('basic'); setMore(false); panel.current?.querySelector('.sheet-in')?.scrollTo({ top: 0 }) }, [id])

  // 휴대폰: 손잡이를 위로 끌면 끝까지, 아래로 끌면 반 → 닫기. 그림 위에서 옆으로 밀면 옆 카드
  const drag = useRef<{ x: number; y: number } | null>(null)
  const down = (ev: React.PointerEvent) => { drag.current = { x: ev.clientX, y: ev.clientY } }
  const up = (ev: React.PointerEvent, area: 'grab' | 'pv') => {
    const d = drag.current; drag.current = null
    if (!d) return
    const dx = ev.clientX - d.x, dy = ev.clientY - d.y
    if (area === 'pv' && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { const to = dx < 0 ? next : prev; if (to) onOpen(to); return }
    if (area === 'grab') { if (dy < -40) setFull(true); else if (dy > 60) (full ? setFull(false) : onClose()); else if (Math.abs(dy) < 8) setFull((f) => !f) }
  }

  // 배포된 사이트에서는 미리보기 그림이 붙는 c/<id>.html 주소를, 개발 서버에서는 바로 가는 주소를 복사해요
  const link = () => e && copyText(`${location.origin}${location.pathname}${import.meta.env.DEV ? `#/w/${e.id}` : `c/${e.id}.html`}`, tx('카드 링크를 복사했어요. 메신저에 붙이면 그림이 같이 떠요.', 'Link copied.'))
  const codeCopy = (kind: string, make: (pv: HTMLElement) => string) => grab((pv) => copyText(make(pv), tx(`${kind} 코드를 복사했어요.`, `${kind} copied.`)))
  const inCompare = e ? prefs.compare.includes(e.id) : false

  return (
    <>
      <div className={`scrim${id ? ' on' : ''}`} onClick={onClose} />
      <aside ref={panel} tabIndex={-1} className={`sheet${id ? ' on' : ''}${full ? ' full' : ''}`} role="dialog" aria-modal="true" aria-label={e?.ko}>
        <span className="sheet-grab" aria-hidden="true" onPointerDown={down} onPointerUp={(ev) => up(ev, 'grab')}><i /></span>
        {e && (
          <div className="sheet-in" key={e.id} onScroll={(ev) => { if (!full && ev.currentTarget.scrollTop > 48) setFull(true) }}>
            <div className="sheet-head">
              <h2>{e.ko}</h2>
              <span className="sheet-nav">
                <button className="icon-btn" aria-label={tx('이전 카드', 'Previous card')} disabled={!prev} onClick={() => prev && onOpen(prev)}><ChevronLeft size={22} /></button>
                <button className="icon-btn" aria-label={tx('다음 카드', 'Next card')} disabled={!next} onClick={() => next && onOpen(next)}><ChevronRight size={22} /></button>
                <button className="icon-btn" aria-label={tx('닫기', 'Close')} onClick={onClose}><X size={22} /></button>
              </span>
            </div>
            <div className="sheet-meta">
              <span className="sheet-en">{e.en}</span>
              <span className={`sheet-lv lv${levelOf(e)}`}>{tx(LEVEL_NAME[levelOf(e)], ['', 'Basic', 'Intermediate', 'Advanced'][levelOf(e)])}</span>
              {KOREA.has(e.id) && <span className="sheet-kr">{tx('한국 앱에서 자주 봐요', 'Common in Korean apps')}</span>}
            </div>
            <div className="sheet-pv" onPointerDown={down} onPointerUp={(ev) => up(ev, 'pv')}><CardDemo key={e.id} id={e.id} /></div>
            <p className="sheet-desc">{prefs.lang === 'en' && DESC_EN[e.id] ? DESC_EN[e.id] : e.desc}</p>

            <div className="sheet-tabs" role="tablist" aria-label={tx('카드 내용', 'Card sections')}>
              {([['basic', '이해하기', 'Basics'],['make', '만들기', 'Build'], ['more', '더 알기', 'More']] as const).map(([k, ko, en]) => (
                <button key={k} role="tab" id={`st-${k}`} aria-selected={tab === k} aria-controls="st-panel" tabIndex={tab === k ? 0 : -1} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}
                  onKeyDown={(ev) => { const order: Tab[] = ['basic', 'make', 'more']; const i = order.indexOf(tab); const to = ev.key === 'ArrowRight' ? order[(i + 1) % 3] : ev.key === 'ArrowLeft' ? order[(i + 2) % 3] : null; if (to) { ev.preventDefault(); setTab(to); (ev.currentTarget.parentElement?.querySelector(`#st-${to}`) as HTMLElement)?.focus() } }}>{tx(ko, en)}</button>
              ))}
            </div>

            <div id="st-panel" role="tabpanel" aria-labelledby={`st-${tab}`} className="sheet-panel">
              {tab === 'basic' && <>
                <h3>{e.drawer === 'dark' ? tx('알아 둘 점', 'Watch out') : tx('이럴 때 써요', 'When to use')}</h3>
                <ul className="sheet-when">{e.when.map((w) => <li key={w}>{w}</li>)}</ul>
                {e.vs && <>
                  <h3>{tx('헷갈리기 쉬운 것', 'Often confused with')}</h3>
                  <VsPair id={e.id} friends={e.vs} onOpen={onOpen} />
                </>}
              </>}

              {tab === 'make' && <>
                <section className="sheet-ai" aria-labelledby="sheet-ai-h">
                  <h3 id="sheet-ai-h">{tx('AI에게 만들어 달라고 하기', 'Ask an AI to build it')}</h3>
                  <p className="sheet-note">{tx('Claude · ChatGPT · Cursor에 붙여 넣으면 이 카드대로 만들어 줘요.', 'Paste into Claude, ChatGPT or Cursor.')}</p>
                  <div className="sheet-code sheet-vibe">
                    <select value={vibe.tech} onChange={(ev) => setVibe({ ...vibe, tech: ev.target.value as Tech })} aria-label={tx('만들 기술', 'Tech')}>{TECHS.map((t) => <option key={t}>{t}</option>)}</select>
                    <select value={vibe.tone} onChange={(ev) => setVibe({ ...vibe, tone: ev.target.value as Tone })} aria-label={tx('프롬프트 길이', 'Length')}><option value="detail">{tx('자세히', 'Detailed')}</option><option value="short">{tx('짧게', 'Short')}</option></select>
                    <button className="sheet-vibe-go" onClick={() => copyText(cardPrompt(e, vibe.tech, vibe.tone), tx('프롬프트를 복사했어요. AI 채팅창에 붙여 넣어 보세요.', 'Prompt copied.'))}><Copy size={14} />{tx('프롬프트 복사', 'Copy prompt')}</button>
                  </div>
                  <details className="sheet-vibe-peek"><summary>{tx('어떤 글이 복사되나요?', 'Preview')}</summary><pre>{cardPrompt(e, vibe.tech, vibe.tone)}</pre></details>
                </section>

                <h3>{tx('만들 때 확인할 것', 'Checklist')}</h3>
                <ul className="sheet-check">
                  {e.drawer !== 'dark' && makeTips(e.drawer).map((t) => <li key={t}>{end(t)}</li>)}
                  {e.drawer !== 'dark' && mistakesOf(e.drawer).map((t) => <li key={t} className="no"><span className="sr-only">{tx('하지 마세요: ', 'Avoid: ')}</span>{end(t)}</li>)}
                </ul>
                <h3>{tx('접근성', 'Accessibility')}</h3>
                <ul className="sheet-check">{a11yTips(e.id, e.drawer).map((t) => <li key={t}>{end(t)}</li>)}</ul>

                <details className="sheet-take">
                  <summary>{tx('코드 · 그림 가져가기', 'Take the code or picture')}</summary>
                  <p className="sheet-note">{tx('모양만 옮긴 뼈대예요. 움직임과 상태는 직접 붙여 주세요.', 'Shape only. Add state and motion yourself.')}</p>
                  <div className="sheet-code" role="group" aria-label={tx('코드 복사', 'Copy code')}>
                    <select value={fmt} onChange={(ev) => setFmt(ev.target.value as Fmt)} aria-label={tx('코드 형식', 'Format')}>
                      {(Object.keys(FMT) as Fmt[]).map((k) => <option key={k} value={k}>{k === 'SVG' ? tx('SVG (피그마에 붙여 넣기)', 'SVG (for Figma)') : k}</option>)}
                    </select>
                    <button onClick={() => codeCopy(fmt, (pv) => FMT[fmt](pv, e.id))}><Copy size={14} />{tx('복사', 'Copy')}</button>
                    <button onClick={() => grab((pv) => { downloadPNG(pv, e.id); say(tx('그림을 PNG로 내려받았어요.', 'PNG saved.')) })}><Download size={14} />{tx('그림 내려받기', 'Save PNG')}</button>
                  </div>
                </details>
              </>}

              {tab === 'more' && <>
                {(NAMES[e.id] || e.aliases) && <>
                  <h3>{tx('다른 곳에서 부르는 이름', 'Names elsewhere')}</h3>
                  <dl className="sheet-names">
                    {NAMES[e.id] && (['머티리얼 · 피그마', 'iOS', 'HTML · 웹'] as const).map((k, i) => <div key={k}><dt>{k}</dt><dd>{NAMES[e.id][i]}</dd></div>)}
                    {e.aliases && <div><dt>{tx('이렇게도 불러요', 'Also called')}</dt><dd>{e.aliases.join(', ')}</dd></div>}
                  </dl>
                </>}
                {HISTORY[e.id] && <>
                  <h3>{tx('어떻게 바뀌어 왔나', 'History')}</h3>
                  <ol className="sheet-hist">{HISTORY[e.id].map(([y, t]) => <li key={y + t}><b>{y}</b>{t}</li>)}</ol>
                </>}
                <Related e={e} onOpen={onOpen} />
                <details className="sheet-take">
                  <summary>{tx('일할 때 쓰는 도구', 'Work tools')}</summary>
                  {e.vs && <>
                    <h3>{tx('바꿔 달라고 말할 때', 'Asking for a change')}</h3>
                    <div className="sheet-ask">
                      {e.vs.slice(0, 2).map((v) => { const f = byId.get(v.id)!; const line = `이 부분은 ${f.ko}(${f.en}) 말고 ${e.ko}(${e.en})로 바꿔 주세요. ${e.desc}`; return <button key={v.id} className="btn-text" onClick={() => copyText(line, tx('요청 문장을 복사했어요.', 'Request copied.'))}><Copy size={14} />{tx(`${f.ko} 대신 ${e.ko}로 바꿔 달라는 문장`, `Ask for ${e.en} instead of ${f.en}`)}</button> })}
                    </div>
                  </>}
                  <TeamName id={e.id} />
                  <h3>{tx('실제 화면', 'In the wild')}</h3>
                  <a className="btn-text" href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${e.en} UI example`)}`} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} />{tx('이미지 검색으로 실제 예시 보기', 'Search real examples')}</a>
                </details>
              </>}
            </div>

            <div className="sheet-actions">
              {e.play && <a className="btn" href={`#/play/${e.id}/${Date.now()}`} onClick={onClose}><Play size={18} />{tx('체험관에서 보기', 'Try it')}</a>}
              <FolderMenu id={e.id} />
              <button className={`btn-text${inCompare ? ' on' : ''}`} aria-pressed={inCompare} onClick={() => { toggleCompare(e.id); say(inCompare ? tx('비교에서 뺐어요.', 'Removed from compare.') : tx('비교에 담았어요.', 'Added to compare.'), () => toggleCompare(e.id)) }}><Columns3 size={16} /><span className="lbl">{tx('비교', 'Compare')}</span></button>
              <span className="sheet-more-wrap">
                <button className="icon-btn" aria-label={tx('더보기', 'More')} aria-expanded={more} aria-haspopup="menu" onClick={() => setMore((m) => !m)}><MoreHorizontal size={20} /></button>
                {more && (
                  <div className="folder-pop sheet-more-pop" role="menu" onClick={() => setMore(false)}>
                    <button role="menuitem" onClick={link}><Link2 size={16} />{tx('링크 복사', 'Copy link')}</button>
                    <button role="menuitem" onClick={() => speak(`${e.ko}. ${prefs.lang === 'en' && DESC_EN[e.id] ? DESC_EN[e.id] : e.desc}`, prefs.lang)}><Volume2 size={16} />{tx('소리로 듣기', 'Read aloud')}</button>
                    {e.vs && <a role="menuitem" href={`#/vs/${e.id}/${e.vs[0].id}`}><Columns3 size={16} />{tx(`${byId.get(e.vs[0].id)!.ko}와 나란히 보기`, 'Side by side')}</a>}
                    {e.id !== 'drawer' && e.id !== 'bottom-sheet' && <button role="menuitem" onClick={() => onOpen(matchMedia('(max-width: 839px)').matches ? 'bottom-sheet' : 'drawer')}><HelpCircle size={16} />{tx('이 창은 이름이 뭘까요?', 'What is this panel?')}</button>}
                    <a role="menuitem" href={issueUrl('bug', `[고장] ${e.ko} 카드`, { where: `카드 · ${e.ko} (${e.id})`, env: navigator.userAgent.slice(0, 200) })} target="_blank" rel="noopener noreferrer"><Flag size={16} />{tx('그림이 이상해요', 'Report a problem')}</a>
                  </div>
                )}
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

/** 이어진 카드: 이 카드를 짝으로 둔 카드 + 같은 상세 항목의 이웃 (관계 지도) */
function Related({ e, onOpen }: { e: Entry; onOpen: (id: string) => void }) {
  const tx = useTx()
  const back = ENTRIES.filter((x) => x.id !== e.id && x.vs?.some((v) => v.id === e.id) && !e.vs?.some((v) => v.id === x.id))
  const sub = Object.values(SUBS).flat().find((s) => s!.ids.includes(e.id))
  const near = (sub?.ids ?? []).filter((id) => id !== e.id && byId.has(id) && !back.some((x) => x.id === id)).slice(0, 8)
  if (!back.length && !near.length) return null
  return (
    <>
      <h3>{tx('이어진 카드', 'Related')}</h3>
      <div className="sheet-rel">
        {back.slice(0, 6).map((x) => <button key={x.id} className="chip" onClick={() => onOpen(x.id)}>{x.ko}</button>)}
        {near.map((id) => <button key={id} className="chip chip--soft" onClick={() => onOpen(id)}>{byId.get(id)!.ko}</button>)}
      </div>
      <a className="btn-text" href={`#/dict/${e.drawer}`}>{tx('이 서랍의 카드 전부 보기', 'See the whole drawer')}</a>
      {sub && <small className="sheet-rel-note">{tx(`테두리가 있는 카드는 이 카드와 자주 헷갈리는 것이고, 나머지는 같은 ‘${sub.label}’ 묶음에 있는 카드예요.`, 'Outlined cards are often confused with this one. The rest are in the same group.')}</small>}
    </>
  )
}

/** 헷갈리는 짝을 나란히: 올리면 두 그림이 같이 움직여요 */
function VsPair({ id, friends, onOpen }: { id: string; friends: { id: string; diff: string }[]; onOpen: (id: string) => void }) {
  const tx = useTx()
  const [f, setF] = useState(friends[0].id)
  useEffect(() => setF(friends[0].id), [id, friends])
  const me = byId.get(id)!
  const other = byId.get(f)
  if (!other) return null
  const why = tellOf(id, f) || friends.find((x) => x.id === f)?.diff
  return (
    <div className="vs-wrap">
      {friends.length > 1 && <div className="vs-tabs" role="group" aria-label={tx('비교할 카드', 'Compare with')}>{friends.map((x) => <button key={x.id} aria-pressed={x.id === f} className={`subchip${x.id === f ? ' on' : ''}`} onClick={() => setF(x.id)}>{byId.get(x.id)!.ko}</button>)}</div>}
      <div className="vs-pair" tabIndex={0} aria-label={`${me.ko} · ${other.ko} 나란히 보기`} title={tx('올리거나 누르면 둘이 같이 움직여요', 'Hover to play both')}>
        <figure><div><Preview id={me.id} /></div><figcaption>{me.ko}</figcaption></figure>
        <span className="vs-x">vs</span>
        <figure><div><Preview id={other.id} /></div><figcaption>{other.ko}</figcaption></figure>
      </div>
      {why && <p className="vs-why">{why}</p>}
      <button className="btn-text vs-open" onClick={() => onOpen(other.id)}>{tx(`${other.ko} 카드 열기`, `Open ${other.en}`)}<ChevronRight size={16} /></button>
    </div>
  )
}

/** 폴더에 담기: 폴더를 고르거나 새로 만들어요 */
function FolderMenu({ id }: { id: string }) {
  const p = usePrefs()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const inAny = Object.values(p.folders).some((l) => l.includes(id))
  const tx = useTx()
  return (
    <span className="folder-menu">
      <button className={`btn-text${inAny ? ' on' : ''}`} aria-expanded={open} onClick={() => setOpen((o) => !o)}><Star size={16} fill={inAny ? 'currentColor' : 'none'} /><span className="lbl">{tx('폴더에 담기', 'Save to folder')}</span></button>
      {open && (
        <div className="folder-pop" role="menu">
          {Object.entries(p.folders).map(([n, l]) => <button key={n} role="menuitemcheckbox" aria-checked={l.includes(id)} onClick={() => { toggleIn(n, id); say(l.includes(id) ? `‘${n}’에서 뺐어요.` : `‘${n}’에 담았어요.`, () => toggleIn(n, id)) }}>{l.includes(id) ? <Check size={16} /> : <span className="fp-sp" />}{n}</button>)}
          <form onSubmit={(ev) => { ev.preventDefault(); const v = name.trim(); if (v) { addFolder(v); toggleIn(v, id); setName(''); say(`새 폴더 ‘${v}’에 담았어요.`) } }}>
            <input value={name} onChange={(ev) => setName(ev.target.value)} placeholder="새 폴더" aria-label="새 폴더 이름" maxLength={20} />
            <button className="icon-btn" aria-label="새 폴더에 담기"><FolderPlus size={16} /></button>
          </form>
        </div>
      )}
    </span>
  )
}

/** 소리로 읽어 줘요 (브라우저 기본 음성). 다시 누르면 멈춰요 */
function speak(text: string, lang: 'ko' | 'en') {
  if (typeof speechSynthesis === 'undefined') { say('이 브라우저는 소리로 읽어 주기를 지원하지 않아요.'); return }
  if (speechSynthesis.speaking) { speechSynthesis.cancel(); return }
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang === 'en' ? 'en-US' : 'ko-KR'
  u.rate = 1
  speechSynthesis.speak(u)
}

/** 우리 팀이 부르는 이름: 적어 두면 검색할 때 그 이름으로도 찾아져요 */
function TeamName({ id }: { id: string }) {
  const p = usePrefs()
  const tx = useTx()
  const [v, setV] = useState('')
  const names = p.team[id] ?? []
  const save = (list: string[]) => setPrefs((q) => ({ team: { ...q.team, [id]: list } }))
  return (
    <>
      <h3>{tx('우리 팀은 이렇게 불러요', 'What your team calls it')}</h3>
      {names.length > 0 && <div className="sheet-rel">{names.map((n) => <button key={n} className="chip" onClick={() => { save(names.filter((x) => x !== n)); say(`‘${n}’을 뺐어요.`, () => save(names)) }} aria-label={`${n} 빼기`}>{n} ✕</button>)}</div>}
      <form className="sheet-team" onSubmit={(ev) => { ev.preventDefault(); const t = v.trim(); if (!t || names.includes(t)) return; save([...names, t]); setV(''); say(`이제 ‘${t}’로 검색해도 이 카드가 나와요.`) }}>
        <input value={v} onChange={(ev) => setV(ev.target.value)} placeholder={tx('예: 하단 팝업', 'e.g. bottom popup')} aria-label={tx('우리 팀이 부르는 이름', 'Team name')} maxLength={20} />
        <button className="btn-text">{tx('더하기', 'Add')}</button>
      </form>
    </>
  )
}

