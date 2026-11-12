// UI Drawer: 이름이 생각 안 나는 UI를 서랍에서 꺼내 보는 사전. (머티리얼 3)
// 화면은 두 개뿐이에요. 왼쪽 내비게이션 드로어(= 서랍)에서 고르고, 카드를 누르면 사이드 시트가 열려요.
//  #/            사전
//  #/play        체험관
//  #/play/<id>   체험관에서 그 UI부터 보여 주기
import { useEffect, useMemo, useRef, useState } from 'react'
import { type LucideIcon, Bell, Compass, Hand, Layers, LayoutPanelTop, Loader, MessageSquare, MousePointerClick, Palette, Play, Search, Shapes, TextCursorInput, TriangleAlert, X } from 'lucide-react'
import { DRAWERS, ENTRIES, byId, search, type DrawerId, type Entry } from './data'
import { Preview } from './Preview'
import { HeroStage } from './HeroStage'
import { Playground } from './Playground'
import './app.css'

const ICONS: Record<DrawerId, LucideIcon> = {
  feedback: Bell, loading: Loader, input: TextCursorInput, nav: Compass, content: LayoutPanelTop,
  style: Palette, gesture: Hand, icon: Shapes, ai: MessageSquare, dark: TriangleAlert,
}
const EXAMPLES = ['아래에서 올라오는 창', '점 세 개', 'ㅌㅅㅌ', '유리']

const readHash = () => {
  const [, route = '', arg = ''] = location.hash.split('/')
  return { route: route === 'play' ? 'play' : 'dict', arg } as const
}

export function App() {
  const [hash, setHash] = useState(readHash)
  const [drawer, setDrawer] = useState<DrawerId | 'all'>('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => {
    const on = () => { setHash(readHash()); window.scrollTo({ top: 0 }) }
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])

  const pick = (d: DrawerId | 'all') => {
    setDrawer(d); setQ('')
    if (hash.route !== 'dict') location.hash = '#/'
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      <nav className="nd" aria-label="메뉴">
        <a className="nd-brand" href="#/" onClick={() => pick('all')}>
          <Logo /><b>UI Drawer</b>
        </a>
        <p className="nd-sub">서랍</p>
        <button className={`nd-item${hash.route === 'dict' && drawer === 'all' ? ' sel' : ''}`} onClick={() => pick('all')}><Layers size={20} />모든 서랍<small>{ENTRIES.length}</small></button>
        {DRAWERS.map((d) => {
          const Icon = ICONS[d.id]
          return (
            <button key={d.id} className={`nd-item${hash.route === 'dict' && drawer === d.id ? ' sel' : ''}`} onClick={() => pick(d.id)}>
              <Icon size={20} />{d.label}<small>{ENTRIES.filter((e) => e.drawer === d.id).length}</small>
            </button>
          )
        })}
        <hr />
        <a className={`nd-item${hash.route === 'play' ? ' sel' : ''}`} href="#/play"><MousePointerClick size={20} />체험관</a>
        <p className="nd-foot">MIT · 그림은 Stageshow 킷</p>
      </nav>

      <main className="main">
        {hash.route === 'play'
          ? <Playground onOpen={setOpen} show={hash.arg || undefined} />
          : <Dictionary drawer={drawer} q={q} setQ={setQ} onOpen={setOpen} />}
      </main>

      <Sheet id={open} onOpen={setOpen} onClose={() => setOpen(null)} />
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
function Dictionary({ drawer, q, setQ, onOpen }: { drawer: DrawerId | 'all'; q: string; setQ: (q: string) => void; onOpen: (id: string) => void }) {
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') { e.preventDefault(); input.current?.focus() }
    }
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  }, [])

  const found = useMemo(() => (q.trim() ? search(q) : null), [q])
  const shown = drawer === 'all' ? DRAWERS : DRAWERS.filter((d) => d.id === drawer)

  return (
    <>
      <div className="searchbar-wrap">
        <label className="searchbar">
          <Search size={22} />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="이름 · 초성 · 모양으로 찾기" aria-label="UI 이름 찾기" />
          {q ? <button className="icon-btn" aria-label="지우기" onClick={() => setQ('')}><X size={20} /></button> : <kbd>/</kbd>}
        </label>
      </div>

      {!found && drawer === 'all' && (
        <section className="hero">
          <div className="hero-copy">
            <h1>이름이 생각 안 나는 그 UI,<br />서랍에서 꺼내 보세요</h1>
            <p>모양만 떠올라도 괜찮아요. 적어 보세요.</p>
            <div className="chips">{EXAMPLES.map((x) => <button key={x} className="chip" onClick={() => setQ(x)}>{x}</button>)}</div>
          </div>
          <div className="hero-art"><HeroStage /></div>
        </section>
      )}

      {found ? (
        <section className="group">
          <h2>‘{q.trim()}’ <small>{found.length}장</small></h2>
          {found.length ? <Grid list={found} onOpen={onOpen} /> : <p className="empty">서랍을 다 뒤졌는데 없어요. 모양을 설명해 보세요. 예: ‘옆에서 나오는 판’</p>}
        </section>
      ) : shown.map((d) => (
        <section key={d.id} className="group">
          <h2>{d.label} <small>{d.note}</small></h2>
          <Grid list={ENTRIES.filter((e) => e.drawer === d.id)} onOpen={onOpen} />
        </section>
      ))}
    </>
  )
}

function Grid({ list, onOpen }: { list: Entry[]; onOpen: (id: string) => void }) {
  return (
    <div className="grid">
      {list.map((e) => (
        <button key={e.id} className="ec" onClick={() => onOpen(e.id)}>
          <div className="ec-pv"><Preview id={e.id} /></div>
          <b>{e.ko}</b>
          <span>{e.en}</span>
        </button>
      ))}
    </div>
  )
}

// ─── 사이드 시트: 옆에서 서랍처럼 밀려 나와요 ───
function Sheet({ id, onOpen, onClose }: { id: string | null; onOpen: (id: string) => void; onClose: () => void }) {
  const last = useRef<string | null>(null)
  if (id) last.current = id
  const e = last.current ? byId.get(last.current) : undefined
  const panel = useRef<HTMLElement>(null)

  useEffect(() => {
    panel.current?.toggleAttribute('inert', !id)
    if (!id) return
    const on = (k: KeyboardEvent) => { if (k.key === 'Escape') onClose() }
    addEventListener('keydown', on)
    panel.current?.focus()
    return () => removeEventListener('keydown', on)
  }, [id, onClose])

  return (
    <>
      <div className={`scrim${id ? ' on' : ''}`} onClick={onClose} />
      <aside ref={panel} tabIndex={-1} className={`sheet${id ? ' on' : ''}`} role="dialog" aria-modal="true" aria-label={e?.ko}>
        {e && (
          <div className="sheet-in" key={e.id}>
            <div className="sheet-head">
              <h2>{e.ko}</h2>
              <button className="icon-btn" aria-label="닫기" onClick={onClose}><X size={22} /></button>
            </div>
            <p className="sheet-en">{e.en}{e.aliases && <> · {e.aliases.join(' · ')}</>}</p>
            <div className="sheet-pv"><Preview id={e.id} size="large" /></div>
            <p className="sheet-desc">{e.desc}</p>

            <h3>{e.drawer === 'dark' ? '알아 둘 점' : '이럴 때 써요'}</h3>
            <ul className="sheet-when">{e.when.map((w) => <li key={w}>{w}</li>)}</ul>

            {e.vs && (
              <>
                <h3>헷갈리는 친구</h3>
                <div className="sheet-vs">
                  {e.vs.map((v) => (
                    <button key={v.id} onClick={() => onOpen(v.id)}>
                      <b>{byId.get(v.id)!.ko}</b><span>{v.diff}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="sheet-actions">
              {e.play && <a className="btn" href={`#/play/${e.id}`} onClick={onClose}><Play size={18} />체험관에서 보기</a>}
              {e.id !== 'drawer' && <button className="btn-text" onClick={() => onOpen('drawer')}>이 창의 이름은?</button>}
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
