// 헷갈리는 UI (학습): 비슷해서 헷갈리는 짝을 나란히 비교하고, 퀴즈로 익혀요.
// 짝은 따로 적지 않고 사전의 ‘헷갈리는 친구(vs)’에서 저절로 모아요.
import { useEffect, useMemo, useState } from 'react'
import { Check, RotateCcw, Shuffle, X } from 'lucide-react'
import { ENTRIES, byId, josa, type Entry } from './data'
import { Preview } from './Preview'
import { BASIC, DARK_FIX, MISNAMES, tellOf } from './lore'
import { copyText } from './snack'
import { quizResult, usePrefs } from './prefs'
import { Stage } from './kit/stage'
import { Bar, Window } from './kit/window'
import { Collapse } from './kit/motion/Collapse'
import type { Act } from './kit/act'
import './learn.css'

export type Pair = { a: Entry; b: Entry; aboutA?: string; aboutB?: string }

/** vs 를 짝으로: (a, b) 한 번만, 서로 설명한 문장을 함께 */
export function makePairs(list: Entry[] = ENTRIES): Pair[] {
  const map = new Map<string, Pair>()
  for (const e of list) for (const v of e.vs ?? []) {
    const other = byId.get(v.id)
    if (!other) continue
    const [a, b] = e.id < other.id ? [e, other] : [other, e]
    const key = `${a.id}|${b.id}`
    const p = map.get(key) ?? { a, b }
    // e.vs 의 문장은 ‘상대(v.id)’를 설명해요
    if (v.id === a.id) p.aboutA ??= v.diff
    else p.aboutB ??= v.diff
    map.set(key, p)
  }
  return [...map.values()]
}

const PAGE = 12
type Mode = 'compare' | 'quiz' | 'find' | 'course' | 'fix' | 'misname' | 'speed' | 'spot' | 'reverse' | 'wrong'
// 보기 아홉 개를 둘로 묶어요. 차근차근 익히는 것과, 문제로 놀면서 확인하는 것
const GROUPS: [string, string, [Mode, string][]][] = [
  ['learn', '익히기', [['compare', '헷갈리는 짝'], ['course', '학습 코스']]],
  ['play', '문제 풀기', [['quiz', '퀴즈'], ['speed', '스피드 대결'], ['wrong', '틀린 것만 다시']]],
  ['more', '더 해 보기', [['misname', '자주 틀리는 이름'], ['fix', '잘못 만든 UI 고치기'], ['reverse', '설명 보고 고르기'], ['find', '화면 속 UI 찾기'], ['spot', '틀린 그림 찾기']]],
]
const MODES = GROUPS.flatMap(([, , m]) => m)

export function Learn({ onOpen, dex, duel, start }: { onOpen: (id: string) => void; dex: Set<string>; duel: string; start: string }) {
  const pairs = useMemo(() => makePairs(), [])
  const [mode, setMode] = useState<Mode>(duel ? 'speed' : (MODES.find(([m]) => m === start)?.[0] ?? 'compare'))
  const [shown, setShown] = useState(PAGE)

  return (
    <div className="ln">
      <header className="ln-head">
        <div>
          <h1>배우기</h1>
          <p>생김새가 비슷해서 헷갈리는 짝 {pairs.length}쌍을 나란히 보고, 문제로 확인해 봐요.</p>
        </div>
        <div className="ln-nav">
          <div className="seg" role="tablist" aria-label="배우기 묶음">
            {GROUPS.map(([g, t, ms]) => { const on = ms.some(([m]) => m === mode); return <button key={g} role="tab" aria-selected={on} className={on ? 'on' : ''} onClick={() => !on && setMode(ms[0][0])}>{on && <Check size={16} />}{t}</button> })}
          </div>
          <div className="ln-modes" role="radiogroup" aria-label="보기">
            {GROUPS.find(([, , ms]) => ms.some(([m]) => m === mode))![2].map(([m, t]) => (
              <button key={m} role="radio" aria-checked={mode === m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>{t}</button>
            ))}
          </div>
        </div>
      </header>

      {mode === 'compare' && (
      <section className="ln-hero">
        <div className="ln-hero-copy">
          <h2>가장 많이 헷갈리는 짝</h2>
          <p><b>토스트</b>와 <b>스낵바</b>는 둘 다 아래에 잠깐 뜨는 알림이에요.</p>
          <p className="ln-rule">버튼이 없으면 <b>토스트</b>, ‘실행 취소’ 같은 버튼이 하나 있으면 <b>스낵바</b>.</p>
        </div>
        <div className="ln-hero-art"><LearnStage /></div>
      </section>
      )}

      {mode === 'compare' ? (
        <>
          <div className="ln-pairs">
            {pairs.slice(0, shown).map((p) => <PairCard key={p.a.id + p.b.id} p={p} onOpen={onOpen} />)}
          </div>
          {shown < pairs.length && <button className="ln-more" onClick={() => setShown((n) => n + PAGE)}>더보기 ({pairs.length - shown}쌍 남음)</button>}
        </>
      ) : mode === 'quiz' ? <Quiz pairs={pairs} onOpen={onOpen} /> : mode === 'course' ? <Course onOpen={onOpen} dex={dex} /> : mode === 'fix' ? <Fix onOpen={onOpen} /> : mode === 'misname' ? <Misnames onOpen={onOpen} /> : mode === 'speed' ? <Speed onOpen={onOpen} duel={duel} /> : mode === 'spot' ? <Spot onOpen={onOpen} /> : mode === 'wrong' ? <Wrong onOpen={onOpen} /> : mode === 'reverse' ? <Reverse onOpen={onOpen} /> : <Finder onOpen={onOpen} />}
    </div>
  )
}

function PairCard({ p, onOpen }: { p: Pair; onOpen: (id: string) => void }) {
  return (
    <article className="ln-pair">
      {([[p.a, p.aboutA], [p.b, p.aboutB]] as const).map(([e, about]) => (
        <button key={e.id} className="ln-side" onClick={() => onOpen(e.id)}>
          <div className="ln-pv"><Preview id={e.id} /></div>
          <b>{e.ko}</b>
          <span>{about ?? e.hint}</span>
        </button>
      ))}
      <span className="ln-vs" aria-hidden="true">vs</span>
      {tellOf(p.a.id, p.b.id) && <p className="ln-tell">{tellOf(p.a.id, p.b.id)}</p>}
      <a className="ln-text ln-pair-more" href={`#/vs/${p.a.id}/${p.b.id}`}>크게 나란히 보기</a>
    </article>
  )
}

// ─── 퀴즈: 그림 하나를 보고 둘 중 무엇인지 골라요 ───
function Quiz({ pairs, onOpen }: { pairs: Pair[]; onOpen: (id: string) => void }) {
  const next = () => {
    const p = pairs[Math.floor(Math.random() * pairs.length)]
    return { p, answer: Math.random() < 0.5 ? p.a : p.b, flip: Math.random() < 0.5 }
  }
  const [q, setQ] = useState(next)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState({ right: 0, total: 0 })
  const choices = q.flip ? [q.p.b, q.p.a] : [q.p.a, q.p.b]
  const right = picked === q.answer.id
  const about = q.answer.id === q.p.a.id ? q.p.aboutA : q.p.aboutB

  const pick = (id: string) => {
    if (picked) return
    setPicked(id)
    setScore((s) => ({ right: s.right + (id === q.answer.id ? 1 : 0), total: s.total + 1 }))
  }

  return (
    <section className="ln-quiz">
      <div className="ln-quiz-top">
        <b>이건 무엇일까요? <small className="ln-daily-n">{((picked ? score.total - 1 : score.total) % 5) + 1} / 5</small></b>
        <span className="ln-score">{score.total}문제 중 {score.right}개 맞힘</span>
        <button className="ln-text" onClick={() => setScore({ right: 0, total: 0 })}><RotateCcw size={16} />처음부터</button>
      </div>
      <div className="ln-quiz-pv"><Preview id={q.answer.id} size="large" /></div>
      <div className="ln-choices">
        {choices.map((c, i) => (
          <button key={c.id} onClick={() => pick(c.id)} disabled={!!picked}
            className={picked ? (c.id === q.answer.id ? 'right' : c.id === picked ? 'wrong' : '') : ''}>
            <kbd>{i + 1}</kbd>{c.ko}<small>{c.en}</small>
          </button>
        ))}
      </div>
      {picked && (
        <div className={`ln-result ${right ? 'right' : 'wrong'}`} role="status">
          <b>{right ? <><Check size={18} />맞아요!</> : <><X size={18} />아쉬워요. 이건 {josa(q.answer.ko, '이에요', '예요')}.</>}</b>
          <p>{q.answer.desc}{about ? ` ${about}` : ''}</p>
          {tellOf(q.p.a.id, q.p.b.id) && <p className="ln-tell-q"><b>한 줄로 가르기</b> {tellOf(q.p.a.id, q.p.b.id)}</p>}
          {score.total % 5 === 0 && <p className="ln-daily"><b>5문제 한 묶음 끝!</b> 지금까지 {score.total}문제 중 {score.right}개 맞혔어요. 한 묶음 더 할까요?{score.right < score.total && <> <a href="#/learn/wrong">틀린 것만 다시</a></>}</p>}
          <div className="ln-result-actions">
            <button className="ln-btn" onClick={() => { setQ(next()); setPicked(null) }}><Shuffle size={16} />{score.total % 5 === 0 ? '다음 5문제' : '다음 문제'}</button>
            <button className="ln-text" onClick={() => onOpen(q.answer.id)}>사전에서 보기</button>
          </div>
        </div>
      )}
    </section>
  )
}

// ─── 맨 위 그림 (Stageshow Stage) ───
// 저장 → 토스트(버튼 없음)가 떴다 사라지고, 삭제 → 스낵바(실행 취소 버튼)가 떠요.
// 실행 취소를 누르면 지운 줄이 돌아와서 처음과 같아져요.
type S = { toast: boolean; snack: boolean; removed: boolean }
const initial: S = { toast: false, snack: false, removed: false }
const POSTER: S = { toast: false, snack: true, removed: true }

/** 글자를 가리지 않게 버튼의 오른쪽 아래쪽을 눌러요 (Stageshow: aim off the label) */
const aside = (a: { rect: (n: string) => { x: number; y: number; width: number; height: number } }, name: string) => { const r = a.rect(name); return { x: r.x + r.width * 0.86, y: r.y + r.height * 0.82 } }
async function script(a: Act<S>) {
  await a.wait(700)
  await a.move(aside(a, 'save'))
  await a.click()
  await a.set({ toast: true })
  await a.wait(2000)
  await a.set({ toast: false })
  await a.wait(500)
  await a.move(aside(a, 'del'))
  await a.click()
  await a.set({ removed: true, snack: true })
  await a.wait(1800)
  await a.move(aside(a, 'undo'))
  await a.wait(150)
  await a.click()
  await a.set({ removed: false, snack: false })
  await a.move('rest')
  await a.wait(900)
}

function LearnStage() {
  return (
    <Stage<S> fill width={640} height={320} compact={{ below: 600, width: 358, height: 320 }} initial={initial} poster={POSTER} script={script} cursor={{ at: { wide: { x: 470, y: 240 }, compact: { x: 250, y: 240 } } }} className="ls">
      {(s) => (
        <>
          <Window url="monggle-bakery.test" nav urlShape="pill" className="ls-win">
            <div className="ls-app">
              <div className="ls-bar">
                <b>장바구니</b>
                <span className="ls-save" data-target="save" data-cursor="pointer">저장</span>
              </div>
              <Collapse open={!s.removed}>
                <div className="ls-row ls-row--focus">
                  <i className="ls-img" /><div><b>소금빵</b><Bar w={50} h={5} tone={3} /></div>
                  <span className="ls-del" data-target="del" data-cursor="pointer">삭제</span>
                </div>
              </Collapse>
              {[64].map((w, i) => (
                <div key={i} className="ls-row"><i className="ls-img ls-img--gray" /><div><Bar w={w} h={6} tone={4} /><Bar w={40} h={5} tone={3} /></div><Bar w={28} h={20} r={10} tone={2} /></div>
              ))}

              <div className="ls-toast" data-show={s.toast || undefined}>저장했어요<span className="ls-tag">토스트 · 버튼 없음</span></div>
              <div className="ls-snack" data-show={s.snack || undefined}>
                삭제했어요<span className="ls-undo" data-target="undo" data-cursor="pointer">실행 취소</span>
                <span className="ls-tag">스낵바 · 버튼 하나</span>
              </div>
            </div>
          </Window>
          <span data-target="rest" className="ls-rest" />
        </>
      )}
    </Stage>
  )
}

// ─── 화면 속 UI 찾기: 한 화면에 섞인 UI 셋을 보고, 보기 여섯 중 맞는 이름을 모두 골라요 ───
const PARTS = ['feedback', 'loading', 'input', 'nav', 'content', 'gesture', 'icon', 'ai']
function newFind() {
  const pool = ENTRIES.filter((e) => PARTS.includes(e.drawer))
  const pick = new Set<Entry>()
  while (pick.size < 6) pick.add(pool[Math.floor(Math.random() * pool.length)])
  const all = [...pick]
  return { shown: all.slice(0, 3), opts: [...all].sort(() => Math.random() - 0.5) }
}
function Finder({ onOpen }: { onOpen: (id: string) => void }) {
  const [q, setQ] = useState(newFind)
  const [sel, setSel] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const right = new Set(q.shown.map((e) => e.id))
  const score = sel.filter((id) => right.has(id)).length - sel.filter((id) => !right.has(id)).length
  return (
    <section className="ln-quiz ln-find">
      <p className="ln-q">이 화면에 들어 있는 UI <b>세 가지</b>를 모두 골라 보세요.</p>
      <div className="ln-find-screen">{q.shown.map((e, i) => <div key={e.id} className="ln-find-pv"><em>{'ABC'[i]}</em><Preview id={e.id} /></div>)}</div>
      <div className="ln-choices ln-multi">
        {q.opts.map((o) => {
          const on = sel.includes(o.id)
          const cls = done ? (right.has(o.id) ? 'right' : on ? 'wrong' : 'dim') : on ? 'on' : ''
          return <button key={o.id} className={cls} aria-pressed={on} disabled={done} onClick={() => setSel((x) => (on ? x.filter((y) => y !== o.id) : [...x, o.id]))}>{on ? <Check size={16} /> : <span className="ln-box" />}{o.ko}</button>
        })}
      </div>
      {!done ? <button className="btn" disabled={!sel.length} onClick={() => setDone(true)}>확인</button> : (
        <div className={`ln-result ${score === 3 ? 'right' : 'wrong'}`} role="status">
          <b>{score === 3 ? <><Check size={18} />모두 맞혔어요!</> : <>정답: {q.shown.map((e, i) => `${'ABC'[i]} ${e.ko}`).join(' · ')}</>}</b>
          <div className="ln-result-actions">
            <button className="ln-btn" onClick={() => { setQ(newFind()); setSel([]); setDone(false) }}><Shuffle size={16} />다음 화면</button>
            {q.shown.map((e) => <button key={e.id} className="ln-text" onClick={() => onOpen(e.id)}>{e.ko} 보기</button>)}
          </div>
        </div>
      )}
    </section>
  )
}

// ─── 학습 코스: 입문 30장 → 중급 (영어 설명이 있는 자주 쓰는 카드). 열어 본 카드는 체크돼요 ───
function Course({ onOpen, dex }: { onOpen: (id: string) => void; dex: Set<string> }) {
  const basic = BASIC.filter((id) => byId.has(id))
  const mid = ENTRIES.filter((e) => !basic.includes(e.id) && e.vs && ['feedback', 'input', 'nav', 'content', 'loading', 'gesture', 'ai'].includes(e.drawer)).slice(0, 100).map((e) => e.id)
  const step = (title: string, ids: string[], locked: boolean) => {
    const done = ids.filter((id) => dex.has(id)).length
    return (
      <div className="ln-course" data-locked={locked || undefined}>
        <div className="ln-course-head"><b>{title}</b><span>{done} / {ids.length}</span></div>
        <div className="ln-course-bar"><i style={{ width: `${(done / ids.length) * 100}%` }} /></div>
        {locked ? <p className="ln-course-lock">1단계를 절반 넘게 보면 열려요.</p> : (
          <div className="ln-course-list">{ids.map((id) => <button key={id} className={dex.has(id) ? 'on' : ''} onClick={() => onOpen(id)}>{dex.has(id) && <Check size={14} />}{byId.get(id)!.ko}</button>)}</div>
        )}
      </div>
    )
  }
  const basicDone = basic.filter((id) => dex.has(id)).length
  return (
    <section className="ln-quiz">
      <div className="ln-build"><div><h3>UI 하나는 이렇게 생겨나요</h3><p>상자를 놓고, 글자를 넣고, 색을 입히고, 마지막에 움직임을 붙여요. 이 순서를 알면 어디를 고쳐 달라고 할지 말로 정확히 전할 수 있어요.</p></div><BuildStage /></div>
      <p className="ln-q">위에서부터 차례로 열어 보세요. 열어 본 카드에는 체크 표시가 남아요.</p>
      {step(`1단계 · 꼭 알아야 할 ${basic.length}장`, basic, false)}
      {step(`2단계 · 헷갈리기 쉬운 ${mid.length}장`, mid, basicDone < basic.length / 2)}
    </section>
  )
}

// ─── 잘못 만든 UI 고치기: 다크 패턴 그림을 보고 이름을 맞힌 뒤, 고치는 법을 봐요 ───
function newFix() {
  const dark = ENTRIES.filter((e) => e.drawer === 'dark')
  const opts = [...dark].sort(() => Math.random() - 0.5).slice(0, 4)
  return { ans: opts[Math.floor(Math.random() * 4)], opts }
}
function Fix({ onOpen }: { onOpen: (id: string) => void }) {
  const [q, setQ] = useState(newFix)
  const [pick, setPick] = useState<string | null>(null)
  const right = pick === q.ans.id
  return (
    <section className="ln-quiz">
      <p className="ln-q">이 화면은 사용자를 속이고 있어요. <b>어떤 다크 패턴</b>일까요?</p>
      <div className="ln-quiz-pv"><Preview id={q.ans.id} size="large" /></div>
      <div className="ln-choices">
        {q.opts.map((o) => <button key={o.id} disabled={!!pick} className={pick ? (o.id === q.ans.id ? 'right' : o.id === pick ? 'wrong' : 'dim') : ''} onClick={() => setPick(o.id)}>{o.ko}</button>)}
      </div>
      {pick && (
        <div className={`ln-result ${right ? 'right' : 'wrong'}`} role="status">
          <b>{right ? <><Check size={18} />맞아요, {q.ans.ko}</> : <>정답은 {q.ans.ko}</>}</b>
          <p>{q.ans.desc}</p>
          <p><b>이렇게 고쳐요</b> · {q.ans.when.join(' · ')}</p>
          {DARK_FIX[q.ans.id] && <div className="ln-fix-vs"><figure><Preview id={q.ans.id} /><figcaption>✕ 속이는 모양</figcaption></figure><figure><Preview id={DARK_FIX[q.ans.id]} /><figcaption>✓ 고친 모양 · {byId.get(DARK_FIX[q.ans.id])!.ko}</figcaption></figure></div>}
          <div className="ln-result-actions">
            <button className="ln-btn" onClick={() => { setQ(newFix()); setPick(null) }}><Shuffle size={16} />다음 문제</button>
            <button className="ln-text" onClick={() => onOpen(q.ans.id)}>{q.ans.ko} 카드 보기</button>
          </div>
        </div>
      )}
    </section>
  )
}

// ─── 자주 틀리는 이름 ───
function Misnames({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section className="ln-quiz">
      <p className="ln-q">현장에서 흔히 이렇게 부르지만, 정확한 이름은 따로 있어요.</p>
      <div className="ln-mis">{MISNAMES.map(([wrong, id, why]) => (
        <button key={wrong + id} onClick={() => onOpen(id)}><span className="ln-mis-w">“{wrong}”</span><span className="ln-mis-r">→ <b>{byId.get(id)!.ko}</b></span><small>{why}</small></button>
      ))}</div>
    </section>
  )
}

// ─── 같은 씨앗이면 같은 문제: 대결 링크에 씨앗과 점수를 담아요 ───
const rng = (seed: number) => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296 }
function questions(seed: number, n = 10) {
  const r = rng(seed), pool = ENTRIES.filter((e) => e.drawer !== 'dark' && e.drawer !== 'style')
  return Array.from({ length: n }, () => {
    const opts: Entry[] = []
    while (opts.length < 4) { const e = pool[Math.floor(r() * pool.length)]; if (!opts.includes(e)) opts.push(e) }
    return { ans: opts[Math.floor(r() * 4)], opts }
  })
}
const SPEED_SEC = 6
function Speed({ onOpen, duel }: { onOpen: (id: string) => void; duel: string }) {
  const [their] = useState(() => { const [s, sc] = duel.split('-').map(Number); return Number.isFinite(s) ? { seed: s, score: Number.isFinite(sc) ? sc : null } : null })
  const [seed, setSeed] = useState(() => their?.seed ?? Math.floor(Math.random() * 1e6))
  const qs = useMemo(() => questions(seed), [seed])
  const [i, setI] = useState(-1)
  const [score, setScore] = useState(0)
  const [left, setLeft] = useState(SPEED_SEC)
  useEffect(() => {
    if (i < 0 || i >= qs.length) return
    setLeft(SPEED_SEC)
    const t = setInterval(() => setLeft((x) => { if (x <= 1) { setI((n) => n + 1); return SPEED_SEC } return x - 1 }), 1000)
    return () => clearInterval(t)
  }, [i, qs.length])
  const answer = (id: string) => { if (id === qs[i].ans.id) setScore((n) => n + 1); setI((n) => n + 1) }
  const link = `${location.origin}${location.pathname}#/learn/duel/${seed}-${score}`
  if (i < 0) return (
    <section className="ln-quiz">
      <p className="ln-q">그림을 보고 {SPEED_SEC}초 안에 이름을 골라요. 모두 10문제예요.{their?.score != null && <> 친구가 보낸 대결이에요. 친구는 <b>{their.score}점</b>을 받았어요.</>}</p>
      <button className="btn" onClick={() => { setScore(0); setI(0) }}>시작</button>
    </section>
  )
  if (i >= qs.length) return (
    <section className="ln-quiz">
      <div className="ln-result right" role="status">
        <b>{score} / {qs.length}점{their?.score != null && (score > their.score ? ', 이겼어요!' : score === their.score ? ', 비겼어요.' : ', 아깝게 졌어요.')}</b>
        <div className="ln-result-actions">
          <button className="ln-btn" onClick={() => copyText(link, '대결 링크를 복사했어요. 친구가 열면 같은 문제를 풀어요.')}>같은 문제로 대결하기</button>
          <button className="ln-btn" onClick={() => { setSeed(Math.floor(Math.random() * 1e6)); setI(-1) }}><Shuffle size={16} />새 문제</button>
        </div>
      </div>
    </section>
  )
  const q = qs[i]
  return (
    <section className="ln-quiz">
      <p className="ln-q">{i + 1} / {qs.length} · 남은 시간 <b>{left}초</b> · 점수 {score}</p>
      <div className="ln-speed-bar"><i key={i} style={{ animationDuration: `${SPEED_SEC}s` }} /></div>
      <div className="ln-find-screen"><div className="ln-find-pv"><Preview id={q.ans.id} /></div></div>
      <div className="ln-choices">{q.opts.map((o) => <button key={o.id} onClick={() => answer(o.id)}>{o.ko}</button>)}</div>
      <button className="ln-text" onClick={() => onOpen(q.ans.id)} hidden>{q.ans.ko}</button>
    </section>
  )
}

// ─── 틀린 그림 찾기: 두 화면에서 하나만 달라요 ───
function newSpot() {
  const pool = ENTRIES.filter((e) => PARTS.includes(e.drawer))
  const pick: Entry[] = []
  while (pick.length < 4) { const e = pool[Math.floor(Math.random() * pool.length)]; if (!pick.includes(e)) pick.push(e) }
  return { a: pick.slice(0, 3), diff: Math.floor(Math.random() * 3), other: pick[3] }
}
function Spot({ onOpen }: { onOpen: (id: string) => void }) {
  const [q, setQ] = useState(newSpot)
  const [pick, setPick] = useState<number | null>(null)
  const b = q.a.map((e, i) => (i === q.diff ? q.other : e))
  return (
    <section className="ln-quiz">
      <p className="ln-q">왼쪽과 오른쪽 화면에서 <b>다른 UI 하나</b>를 찾아 눌러 보세요.</p>
      <div className="ln-spot">{[q.a, b].map((list, side) => (
        <div key={side} className="ln-find-screen">{list.map((e, i) => (
          <button key={e.id + side} className={`ln-find-pv${pick !== null && i === q.diff ? ' hit' : ''}`} disabled={pick !== null} onClick={() => setPick(i)} aria-label={`${side ? '오른쪽' : '왼쪽'} ${i + 1}번`}><em>{'ABC'[i]}</em><Preview id={e.id} /></button>
        ))}</div>
      ))}</div>
      {pick !== null && (
        <div className={`ln-result ${pick === q.diff ? 'right' : 'wrong'}`} role="status">
          <b>{pick === q.diff ? <><Check size={18} />찾았어요!</> : <>정답은 {'ABC'[q.diff]}</>} · {q.a[q.diff].ko} ↔ {q.other.ko}</b>
          <div className="ln-result-actions">
            <button className="ln-btn" onClick={() => { setQ(newSpot()); setPick(null) }}><Shuffle size={16} />다음</button>
            <button className="ln-text" onClick={() => onOpen(q.a[q.diff].id)}>{q.a[q.diff].ko} 보기</button>
            <button className="ln-text" onClick={() => onOpen(q.other.id)}>{q.other.ko} 보기</button>
          </div>
        </div>
      )}
    </section>
  )
}

// ─── 설명 보고 고르기: 말로 듣고 머릿속에 그린 모양을 그림 넷 중에서 골라요 ───
function Reverse({ onOpen }: { onOpen: (id: string) => void }) {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e6))
  const q = useMemo(() => questions(seed, 1)[0], [seed])
  const [pick, setPick] = useState<string | null>(null)
  return (
    <section className="ln-quiz">
      <p className="ln-q"><b>“{q.ans.desc}”</b> 이 설명에 맞는 그림은 어느 것일까요?</p>
      <div className="ln-reverse">{q.opts.map((o, i) => (
        <button key={o.id} className={`ln-find-pv${pick ? (o.id === q.ans.id ? ' hit' : o.id === pick ? ' miss' : '') : ''}`} disabled={!!pick} onClick={() => setPick(o.id)} aria-label={`${i + 1}번 그림`}><em>{i + 1}</em><Preview id={o.id} /></button>
      ))}</div>
      {pick && (
        <div className={`ln-result ${pick === q.ans.id ? 'right' : 'wrong'}`} role="status">
          <b>{pick === q.ans.id ? <><Check size={18} />맞아요 · {q.ans.ko}</> : <>정답은 {q.ans.ko}</>}</b>
          <div className="ln-result-actions">
            <button className="ln-btn" onClick={() => { setSeed(Math.floor(Math.random() * 1e6)); setPick(null) }}><Shuffle size={16} />다음</button>
            <button className="ln-text" onClick={() => onOpen(q.ans.id)}>{q.ans.ko} 보기</button>
          </div>
        </div>
      )}
    </section>
  )
}

// ─── Stageshow: UI 하나가 생기는 과정 (상자 → 글자 → 색 → 움직임). 스낵바 하나를 만들어요 ───
type B = { step: number; gone: boolean }
const B0: B = { step: 0, gone: false }
const B_POSTER: B = { step: 4, gone: false }
const BUILD = ['상자', '글자', '색', '움직임']
async function buildScript(a: Act<B>) {
  await a.wait(600)
  for (let i = 1; i <= 3; i++) { await a.set({ step: i }); await a.wait(1300) }
  // 움직임: 아래로 숨었다가 튀어 올라와요
  await a.set({ step: 4, gone: true })
  await a.wait(380)
  await a.set({ gone: false })
  await a.wait(2600)
  // 스낵바는 저절로 사라져요 → 빈 자리에 새 상자를 그리며 다시
  await a.set({ gone: true })
  await a.wait(700)
  await a.set({ step: 0, gone: false })
  await a.wait(500)
}
function BuildStage() {
  return (
    <Stage<B> fill width={560} height={300} compact={{ below: 600, width: 358, height: 300 }} initial={B0} poster={B_POSTER} script={buildScript} className="bs">
      {(s) => (
        <Window url="monggle-bakery.test" nav urlShape="pill" className="bs-win">
          <div className="bs-app">
            <div className="bs-steps">{BUILD.map((t, i) => <span key={t} data-on={s.step > i || undefined} data-now={s.step === i + 1 || undefined}>{i + 1} {t}</span>)}</div>
            {[70, 54].map((w, i) => <div key={i} className="bs-row"><i /><div><Bar w={w} h={6} tone={4} /><Bar w={40} h={5} tone={3} /></div></div>)}
            <div className="bs-snack" data-step={s.step} data-gone={s.gone || undefined}>
              <span className="bs-txt">찜 목록에 담았어요</span>
              <span className="bs-act">실행 취소</span>
            </div>
          </div>
        </Window>
      )}
    </Stage>
  )
}

// ─── 틀린 것만 다시: 오늘의 카드 오답 노트에 쌓인 카드로만 내요. 맞히면 노트에서 빠져요 ───
function Wrong({ onOpen }: { onOpen: (id: string) => void }) {
  const wrong = usePrefs().quiz.wrong.filter((id) => byId.has(id))
  const [seed, setSeed] = useState(0)
  const [pick, setPick] = useState<string | null>(null)
  const q = useMemo(() => {
    if (!wrong.length) return null
    const ans = byId.get(wrong[seed % wrong.length])!
    const near = ENTRIES.filter((e) => e.drawer === ans.drawer && e.id !== ans.id)
    const opts = [ans, ...[...near].sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5)
    return { ans, opts }
  }, [seed, wrong.length]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!q) return (
    <section className="ln-quiz">
      <div className="empty empty--box"><b>다시 풀 문제가 없어요.</b><p>홈의 ‘오늘의 카드’에서 틀린 문제가 여기에 모여요.</p><a className="btn-text" href="#/">오늘의 카드 풀러 가기</a></div>
    </section>
  )
  const choose = (id: string) => { if (pick) return; setPick(id); quizResult(q.ans.id, id === q.ans.id) }
  return (
    <section className="ln-quiz">
      <p className="ln-q">전에 틀렸던 카드예요. 남은 문제 {wrong.length}개.</p>
      <div className="ln-quiz-pv"><Preview id={q.ans.id} size="large" /></div>
      <div className="ln-choices">{q.opts.map((o) => <button key={o.id} disabled={!!pick} className={pick ? (o.id === q.ans.id ? 'right' : o.id === pick ? 'wrong' : 'dim') : ''} onClick={() => choose(o.id)}>{o.ko}</button>)}</div>
      {pick && (
        <div className={`ln-result ${pick === q.ans.id ? 'right' : 'wrong'}`} role="status">
          <b>{pick === q.ans.id ? <><Check size={18} />맞아요! 오답 노트에서 뺐어요.</> : <>이번에도 아쉬워요. 이건 {josa(q.ans.ko, '이에요', '예요')}.</>}</b>
          <p>{q.ans.desc}</p>
          <div className="ln-result-actions">
            <button className="ln-btn" onClick={() => { setSeed((n) => n + 1); setPick(null) }}><Shuffle size={16} />다음 문제</button>
            <button className="ln-text" onClick={() => onOpen(q.ans.id)}>{q.ans.ko} 카드 보기</button>
          </div>
        </div>
      )}
    </section>
  )
}
