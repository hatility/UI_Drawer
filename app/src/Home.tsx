// 홈: 메인 배너(Stageshow) → 오늘의 카드 · 내 서랍 → 서랍 둘러보기 → 새로 들어온 카드.
// 사전으로 바로 떨어지지 않고, 무엇을 할 수 있는지 먼저 보여 줘요.
import { AUTHOR, ORG, REPO, issueUrl } from './about'
import { useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, BookOpen, Check, MousePointerClick, Search, Shuffle, Tag, X } from 'lucide-react'
import { ENTRIES, DRAWERS, byId, josa, type Entry } from './data'
import { Preview } from './Preview'
import { HeroStage } from './HeroStage'
import { Grid } from './Grid'
import { quizResult, usePrefs } from './prefs'
import { DRAWER_EN, useTx } from './i18n'
import './home.css'

const EXAMPLES = ['아래에서 올라오는 창', '점 세 개', 'ㅌㅅㅌ', '9,900원']
/** 모은 장수에 따라 받는 배지 */
export const BADGES: [number, string][] = [[10, '서랍 첫 손님'], [50, '서랍 단골'], [150, 'UI 수집가'], [300, 'UI 박사'], [ENTRIES.length, '서랍 완성']]

const today = () => { const d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5) }
/** 날짜로 정해지는 섞기 (같은 날엔 같은 문제) */
const rng = (seed: number) => () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)

/** 오늘의 문제: 정답 하나 + 같은 서랍에서 고른 보기 셋 */
export function dailyQuiz(day: number) {
  const r = rng(day * 7 + 3)
  const answer = ENTRIES[Math.floor(r() * ENTRIES.length)]
  const near = ENTRIES.filter((e) => e.drawer === answer.drawer && e.id !== answer.id)
  const pool = near.length >= 3 ? near : ENTRIES.filter((e) => e.id !== answer.id)
  const picks = new Set<Entry>()
  while (picks.size < 3) picks.add(pool[Math.floor(r() * pool.length)])
  const opts = [answer, ...picks].sort(() => r() - 0.5)
  return { answer, opts }
}

type Props = { onOpen: (id: string) => void; onSearch: (q: string) => void; dex: Set<string>; collect: (id: string) => void }

export function Home({ onOpen, onSearch, dex, collect }: Props) {
  const [q, setQ] = useState('')
  const tx = useTx()
  const submit = (e: FormEvent) => { e.preventDefault(); if (q.trim()) onSearch(q.trim()) }
  const fresh = useMemo(() => ENTRIES.slice(-10).reverse(), [])

  return (
    <div className="home">
      <section className="hh">
        <div className="hh-copy">
          <span className="hh-kicker">{tx('UI 이름 사전', 'UI name dictionary')} · {ENTRIES.length}</span>
          <h1>{tx('이름이 생각 안 나는 그 UI,', 'Can’t remember what that UI is called?')}<br />{tx('서랍에서 꺼내 보세요', 'Pull it out of the drawer')}</h1>
          <p>{tx('모양만 떠올라도 찾아 드려요. 직접 눌러 보고, 아무 사이트에서나 이름표를 붙여 볼 수도 있어요.', 'Describe its shape and we’ll find it. Try it live, or tag UI on any website.')}</p>
          <form className="hh-search" onSubmit={submit} role="search">
            <Search size={20} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="예: 아래에서 올라오는 창" aria-label="UI 이름 찾기" />
            <button className="btn" type="submit">{tx('찾기', 'Search')}</button>
          </form>
          <div className="chips">{EXAMPLES.map((x) => <button key={x} className="chip" onClick={() => onSearch(x)}>{x}</button>)}</div>
        </div>
        <div className="hh-art"><HeroStage /></div>
      </section>

      <Welcome />

      <nav className="hh-go" aria-label="바로 가기">
        <a href="#/dict"><BookOpen size={22} /><span><b>{tx('사전 둘러보기', 'Browse the dictionary')}</b><small>{tx(`서랍 ${DRAWERS.length}개를 하나씩 열어 봐요`, `${DRAWERS.length} drawers, split into groups`)}</small></span><ArrowRight size={18} /></a>
        <a href="#/play"><MousePointerClick size={22} /><span><b>{tx('체험관에서 눌러 보기', 'Try them in the playground')}</b><small>{tx('가짜 사이트 12곳에서 직접 눌러 봐요', 'Ten pretend sites to click around')}</small></span><ArrowRight size={18} /></a>
        <a href="#/tags"><Tag size={22} /><span><b>{tx('어디서나 이름표', 'Name tags anywhere')}</b><small>{tx('다른 사이트에서도 UI 이름을 확인해요', 'Label UI on any site')}</small></span><ArrowRight size={18} /></a>
      </nav>


      {/* 홈은 단순하게: 찾기 · 바로가기 · 오늘의 카드 하나. 내 서랍은 위 막대의 ‘내 서랍’ 알약으로, 새 카드는 새 소식으로 */}
      <Today onOpen={onOpen} collect={collect} />

      <footer className="hm-foot">
        <span><a href="#/news">{tx(`새로 들어온 카드 ${fresh.length}장 보기`, 'See new cards')}</a> · <a href={issueUrl('new-card', '[새 카드] ', {})} target="_blank" rel="noopener noreferrer">{tx('없는 UI 제안하기', 'Suggest a card')}</a></span>
        <span><a href="#/about">{tx('이 사이트에 대해', 'About')}</a> · UI Drawer v{__APP_VERSION__} · <a href={REPO + '/blob/main/LICENSE'} target="_blank" rel="noopener noreferrer">MIT</a></span>
        <span>만든 사람 <a href={AUTHOR.url} target="_blank" rel="noopener noreferrer">{AUTHOR.name}</a> · 소스 코드 <a href={REPO} target="_blank" rel="noopener noreferrer">{ORG.name}</a></span>
      </footer>
    </div>
  )
}

function Today({ onOpen, collect }: { onOpen: (id: string) => void; collect: (id: string) => void }) {
  const [shift, setShift] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const { answer, opts } = useMemo(() => dailyQuiz(today() + shift * 101), [shift])
  const right = picked === answer.id
  const quiz = usePrefs().quiz
  const pick = (id: string) => { if (picked) return; setPicked(id); collect(answer.id); quizResult(answer.id, id === answer.id) }
  return (
    <section className="hm-card today" aria-labelledby="today-h">
      <div className="hm-head"><h2 id="today-h">오늘의 카드</h2><small>그림을 보고 이름을 맞혀 보세요.</small><small className="today-meta">지금 {quiz.streak}번 연속으로 맞혔어요 (최고 {quiz.best}번) · <a href="#/mine">오답 노트 {quiz.wrong.length}개</a></small></div>
      <div className="today-pv"><Preview key={answer.id} id={answer.id} size="large" /></div>
      <div className="today-opts">
        {opts.map((o, i) => (
          <button key={o.id} className={picked ? (o.id === answer.id ? 'right' : o.id === picked ? 'wrong' : 'dim') : ''} onClick={() => pick(o.id)} disabled={!!picked && o.id !== answer.id && o.id !== picked}>
            <kbd>{i + 1}</kbd>{o.ko}
          </button>
        ))}
      </div>
      {picked && (
        <div className={`today-res ${right ? 'right' : 'wrong'}`} role="status">
          <b>{right ? <><Check size={18} />맞아요!</> : <><X size={18} />정답은 {josa(answer.ko, '이에요', '예요')}.</>}</b>
          <p>{answer.desc}</p>
          <div className="today-act">
            <button className="btn-text" onClick={() => onOpen(answer.id)}>사전에서 보기</button>
            <button className="btn-text" onClick={() => { setShift((s) => s + 1); setPicked(null) }}><Shuffle size={16} />한 문제 더</button>
          </div>
        </div>
      )}
    </section>
  )
}

function MyDrawer({ dex, onOpen }: { dex: Set<string>; onOpen: (id: string) => void }) {
  const n = dex.size
  const next = BADGES.find(([k]) => n < k)
  const unseen = () => { const rest = ENTRIES.filter((e) => !dex.has(e.id)); if (rest.length) onOpen(rest[Math.floor(Math.random() * rest.length)].id) }
  const last = [...dex].slice(-4).reverse().map((id) => byId.get(id)).filter(Boolean) as Entry[]
  return (
    <section className="hm-card mine" aria-labelledby="mine-h">
      <div className="hm-head"><h2 id="mine-h">내 서랍</h2><small>열어 보거나 체험관에서 본 UI가 여기 모여요.</small></div>
      <div className="mine-num"><b>{n}</b><span>/ {ENTRIES.length}장</span></div>
      <div className="mine-bar" role="progressbar" aria-label="모은 카드" aria-valuemin={0} aria-valuemax={ENTRIES.length} aria-valuenow={n}><i style={{ width: `${(n / ENTRIES.length) * 100}%` }} /></div>
      <p className="mine-next">{next ? `${next[0] - n}장만 더 모으면 ‘${next[1]}’ 배지를 받아요.` : '모든 배지를 모았어요!'}</p>
      <ul className="badges">
        {BADGES.map(([k, name]) => <li key={k} className={n >= k ? 'on' : ''}><span>{n >= k ? '★' : k}</span>{name}</li>)}
      </ul>
      {last.length > 0 && <div className="mine-last">{last.map((e) => <button key={e.id} className="chip" onClick={() => onOpen(e.id)}>{e.ko}</button>)}</div>}
      <button className="btn" onClick={unseen}><Shuffle size={18} />아직 안 본 카드 열기</button>
    </section>
  )
}

/** 카드 제안: 적은 내용을 깃허브 이슈 양식에 맞춰 복사해 줘요 (밖으로 보내지 않아요) */
function Suggest() {
  const [ko, setKo] = useState('')
  const [desc, setDesc] = useState('')
  const [done, setDone] = useState(false)
  return (
    <form className="hm-suggest-form" onSubmit={(e) => { e.preventDefault(); setDone(true); window.open(issueUrl('new-card', `[새 카드] ${ko}`, { ko, desc }), '_blank', 'noopener') }}>
      <input value={ko} onChange={(e) => { setKo(e.target.value); setDone(false) }} placeholder="UI 이름 (예: 토스트 쌓기)" aria-label="제안할 UI 이름" maxLength={40} required />
      <input value={desc} onChange={(e) => { setDesc(e.target.value); setDone(false) }} placeholder="모양 · 쓰임새 한 줄" aria-label="모양 · 쓰임새" maxLength={200} required />
      <button className="btn">{done ? '열린 창에서 Submit을 누르면 끝나요' : '제안하러 가기'}</button>
    </form>
  )
}

/** 처음 온 사람에게 한 번만: 세 걸음으로 쓰는 법 */
const WELCOME_KEY = 'ui-drawer-welcome-seen'
function Welcome() {
  const [show, setShow] = useState(() => { try { return !localStorage.getItem(WELCOME_KEY) } catch { return false } })
  if (!show) return null
  const done = () => { setShow(false); try { localStorage.setItem(WELCOME_KEY, '1') } catch { /* 이번만 */ } }
  return (
    <section className="hm-welcome" aria-labelledby="welcome-h">
      <h2 id="welcome-h">처음 오셨나요? 이렇게 써 보세요.</h2>
      <ol>
        <li><b>생김새로 찾기</b>이름이 생각나지 않으면 ‘아래에서 올라오는 창’처럼 보이는 대로 적어 보세요.</li>
        <li><b>카드 열어 보기</b>카드를 누르면 움직이는 그림과 함께 언제 쓰는지, 무엇과 헷갈리는지 나와요.</li>
        <li><b>직접 눌러 보기</b>체험관에 있는 가짜 빵집, 은행, 쇼핑몰에서 진짜처럼 눌러 볼 수 있어요.</li>
      </ol>
      <div className="hm-welcome-act">
        <button className="btn" onClick={() => { done(); document.querySelector<HTMLInputElement>('.hh-search input')?.focus() }}>바로 찾아보기</button>
        <a className="btn-text" href="#/play" onClick={done}>체험관 먼저 보기</a>
        <button className="btn-text" onClick={done}>다시 보지 않기</button>
      </div>
    </section>
  )
}
