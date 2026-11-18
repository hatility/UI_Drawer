// 사용성 시험: 과제 다섯 개를 차례로 주고, 걸린 시간과 거쳐 간 화면을 기록해요.
// 시험하는 사람 옆에서 진행자가 #/test 를 열고 ‘시작’을 누르면, 화면 아래에 과제 띠가 떠요.
// 기록은 이 브라우저에만 남고, 끝나면 표로 복사해서 회의에 가져가요.
import { useEffect, useState, useSyncExternalStore } from 'react'
import { copyText } from './snack'

export const TASKS = [
  '‘아래에서 올라오는 창’의 이름을 찾아서 카드를 열어 보세요.',
  '스낵바 카드를 ‘즐겨찾기’ 폴더에 담아 보세요.',
  '체험관에서 토스트를 직접 띄워 보세요.',
  '토글과 체크박스를 나란히 놓고 비교해 보세요.',
  '다크 패턴 하나를 골라서 어떻게 고치면 되는지 찾아보세요.',
]
type Row = { task: number; sec: number; ok: boolean; path: string[] }
type State = { on: boolean; i: number; t0: number; path: string[]; rows: Row[] }
const KEY = 'ui-drawer-trial'
let st: State = (() => { try { return { on: false, i: 0, t0: 0, path: [], rows: [], ...JSON.parse(sessionStorage.getItem(KEY) || '{}') } } catch { return { on: false, i: 0, t0: 0, path: [], rows: [] } } })()
const subs = new Set<() => void>()
const set = (p: Partial<State>) => { st = { ...st, ...p }; try { sessionStorage.setItem(KEY, JSON.stringify(st)) } catch { /* 이번만 */ } subs.forEach((f) => f()) }
const useTrial = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => st)

const start = () => set({ on: true, i: 0, t0: Date.now(), path: [location.hash || '#/'], rows: [] })
const finish = (ok: boolean) => {
  const row: Row = { task: st.i, sec: Math.round((Date.now() - st.t0) / 1000), ok, path: st.path }
  const rows = [...st.rows, row]
  if (st.i + 1 >= TASKS.length) { set({ on: false, rows }); location.hash = '#/test' } else set({ i: st.i + 1, t0: Date.now(), path: [location.hash || '#/'], rows })
}
const table = (rows: Row[]) => '| 과제 | 결과 | 걸린 시간 | 거쳐 간 화면 |\n|---|---|---|---|\n' + rows.map((r) => `| ${r.task + 1}. ${TASKS[r.task]} | ${r.ok ? '해냄' : '포기'} | ${r.sec}초 | ${r.path.join(' → ')} |`).join('\n')

/** 시험 중이면 화면 아래에 지금 과제를 띄워요 */
export function TrialBar() {
  const s = useTrial()
  const [, tick] = useState(0)
  useEffect(() => {
    if (!s.on) return
    const on = () => set({ path: [...st.path, location.hash || '#/'].slice(-20) })
    addEventListener('hashchange', on)
    const t = setInterval(() => tick((n) => n + 1), 1000)
    return () => { removeEventListener('hashchange', on); clearInterval(t) }
  }, [s.on])
  if (!s.on) return null
  return (
    <div className="trial" role="region" aria-label="사용성 시험 과제">
      <small>과제 {s.i + 1} / {TASKS.length} · {Math.round((Date.now() - s.t0) / 1000)}초</small>
      <b>{TASKS[s.i]}</b>
      <span className="trial-act"><button className="btn" onClick={() => finish(true)}>다 했어요</button><button className="btn-text" onClick={() => finish(false)}>모르겠어요</button></span>
    </div>
  )
}

/** #/test: 시험 안내 · 시작 · 결과 */
export function Trial() {
  const s = useTrial()
  return (
    <div className="pg-page">
      <header className="pg-page-head">
        <h1>사용성 시험</h1>
        <p>처음 써 보는 사람 옆에 앉아서 진행해요. 과제만 읽어 주고, 어디를 눌러야 하는지는 알려 주지 마세요.</p>
      </header>
      <section className="pg-sec">
        <h2>과제</h2>
        <ol className="trial-list">{TASKS.map((t) => <li key={t}>{t}</li>)}</ol>
        <p className="pg-note">시작을 누르면 화면 아래에 과제가 하나씩 떠요. 해냈으면 ‘다 했어요’, 막혀서 그만두면 ‘모르겠어요’를 눌러요. 걸린 시간과 지나간 화면이 저절로 기록돼요.</p>
        <button className="btn" onClick={() => { start(); location.hash = '#/' }} disabled={s.on}>{s.on ? '시험이 진행 중이에요' : '시험 시작'}</button>
      </section>
      <DevDwellTable />
      {s.rows.length > 0 && (
        <section className="pg-sec">
          <h2>지난 결과</h2>
          <table className="trial-table">
            <thead><tr><th>과제</th><th>결과</th><th>시간</th><th>거쳐 간 화면</th></tr></thead>
            <tbody>{s.rows.map((r) => <tr key={r.task}><td>{r.task + 1}</td><td>{r.ok ? '해냄' : '포기'}</td><td>{r.sec}초</td><td>{r.path.join(' → ')}</td></tr>)}</tbody>
          </table>
          <button className="btn-text" onClick={() => copyText(table(s.rows), '결과 표를 복사했어요. 회의록에 붙여 넣으면 돼요.')}>결과 표 복사 (Markdown)</button>
          <p className="pg-note">30초 넘게 걸렸거나 거쳐 간 화면이 많은 과제가 고칠 곳이에요. 다섯 명쯤 해 보면 같은 곳에서 막히는 게 보여요.</p>
        </section>
      )}
    </div>
  )
}

// ─── 개발용: 화면마다 머문 시간 (개발 서버에서만 세고, 배포판에는 아무것도 남기지 않아요) ───
const DWELL = 'ui-drawer-dev-dwell'
const readDwell = (): Record<string, number> => { try { return JSON.parse(localStorage.getItem(DWELL) || '{}') } catch { return {} } }
export function DevDwell() {
  useEffect(() => {
    if (!import.meta.env.DEV) return
    let at = location.hash.split('/').slice(0, 2).join('/') || '#/', t0 = Date.now()
    const flush = () => { const d = readDwell(); d[at] = (d[at] ?? 0) + Math.round((Date.now() - t0) / 1000); try { localStorage.setItem(DWELL, JSON.stringify(d)) } catch { /* 이번만 */ } t0 = Date.now() }
    const on = () => { flush(); at = location.hash.split('/').slice(0, 2).join('/') || '#/' }
    addEventListener('hashchange', on); addEventListener('pagehide', flush)
    return () => { flush(); removeEventListener('hashchange', on); removeEventListener('pagehide', flush) }
  }, [])
  return null
}
export function DevDwellTable() {
  if (!import.meta.env.DEV) return null
  const d = Object.entries(readDwell()).sort((a, b) => b[1] - a[1])
  return (
    <section className="pg-sec">
      <h2>개발용 · 화면마다 머문 시간 <small>개발 서버에서만 보여요.</small></h2>
      {d.length ? <table className="trial-table"><tbody>{d.map(([h, n]) => <tr key={h}><td>{h}</td><td>{n}초</td></tr>)}</tbody></table> : <p className="pg-note">아직 기록이 없어요.</p>}
    </section>
  )
}
