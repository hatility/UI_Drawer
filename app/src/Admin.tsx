// 체험관 사이트 8: 관리자 화면 ‘몽글 관리’. 요소마다 data-ui="사전 id" 가 달려 있어 이름표가 붙어요.
// 기간 고르기 → 숫자 묶음(오른 · 내린 표시) → 그래프 → 정렬되는 주문 표(상태 알약) → 담당자 고르기 · 설정.
import { forwardRef, useImperativeHandle, useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import type { SiteHandle } from './Community'
import './sites.css'

const RANGES: [string, number][] = [['오늘', 0.2], ['7일', 1], ['30일', 3.6]]
const ORDERS: [string, string, number, string][] = [['#1042', '소금빵 6개', 21000, '배송 중'], ['#1041', '크루아상 4개', 18000, '완료'], ['#1040', '쿠키 상자', 12500, '취소'], ['#1039', '식빵 2개', 9000, '준비 중']]
const PEOPLE = ['김몽글', '이반죽', '박오븐']
const BARS = [5, 7, 4, 8, 6, 9, 7]

export const Admin = forwardRef<SiteHandle, { saw: (id: string) => void }>(function Admin({ saw }, ref) {
  const [range, setRange] = useState(1)
  const [sort, setSort] = useState<[number, 1 | -1]>([0, -1])
  const [who, setWho] = useState<string | null>(null)
  const [pick, setPick] = useState(false)
  const [alert, setAlert] = useState(true)
  const k = RANGES[range][1]
  const rows = [...ORDERS].sort((a, b) => (sort[0] === 2 ? a[2] - b[2] : a[sort[0]].toString().localeCompare(b[sort[0]].toString())) * sort[1])
  const head = (i: number, t: string) => <th aria-sort={sort[0] === i ? (sort[1] > 0 ? 'ascending' : 'descending') : 'none'}><button onClick={() => { setSort([i, sort[0] === i ? (-sort[1] as 1 | -1) : 1]); saw('sortable-table') }}>{t}{sort[0] === i && (sort[1] > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}</button></th>

  useImperativeHandle(ref, () => ({
    demo(id) {
      switch (id) {
        case 'date-range': setRange(2); break
        case 'sortable-table': setSort([2, -1]); break
        case 'user-picker': setPick(true); break
        case 'settings-list': setAlert(false); break
      }
      saw(id)
    },
  }))

  return (
    <div className="site ad">
      <header className="site-bar"><b className="site-logo">몽글 관리</b>
        <div className="ad-range" data-ui="date-range" role="group" aria-label="기간">{RANGES.map(([t], i) => <button key={t} aria-pressed={range === i} onClick={() => { setRange(i); saw('date-range') }}>{t}</button>)}</div>
      </header>
      <div className="site-scroll ad-body">
        <section className="ad-stats" data-ui="stat-group">
          {[['매출', `${Math.round(84 * k)}만 원`, 12], ['주문', `${Math.round(132 * k)}건`, -4], ['새 회원', `${Math.round(41 * k)}명`, 8]].map(([t, v, d]) => (
            <div key={t as string} className="ad-stat"><small>{t}</small><b>{v}</b><span className="ad-delta" data-ui={t === '매출' ? 'delta-badge' : undefined} data-up={(d as number) > 0 || undefined}>{(d as number) > 0 ? '▲' : '▼'} {Math.abs(d as number)}%</span></div>
          ))}
        </section>
        <section className="ad-chart" data-ui="chart" aria-label="요일별 주문 막대그래프">
          {BARS.map((b, i) => <i key={i} style={{ height: `${Math.min(100, b * 10 * (0.7 + k / 6))}%` }}><small>{'월화수목금토일'[i]}</small></i>)}
        </section>
        <table className="ad-table" data-ui="sortable-table">
          <thead><tr>{head(0, '주문')}{head(1, '상품')}{head(2, '금액')}<th>상태</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2].toLocaleString()}원</td><td><span className="ad-pill" data-ui={r[0] === '#1042' ? 'status-pill' : undefined} data-s={r[3]}>{r[3]}</span></td></tr>)}</tbody>
        </table>
        <section className="ad-side">
          <div className="ad-who" data-ui="user-picker">
            <small>담당자</small>
            <button className="site-btn site-btn--line" aria-expanded={pick} onClick={() => setPick(!pick)}>{who ?? '고르기'}</button>
            {pick && <div className="site-pop">{PEOPLE.map((p) => <button key={p} onClick={() => { setWho(p); setPick(false); saw('user-picker') }}><span className="site-avatar site-avatar--sm" style={{ background: '#8f4c38' }}>{p[1]}</span> {p}</button>)}</div>}
          </div>
          <ul className="ad-set" data-ui="settings-list">
            <li><span>새 주문 알림</span><input type="checkbox" role="switch" checked={alert} onChange={(e) => { setAlert(e.target.checked); saw('settings-list') }} /></li>
            <li><span>주간 보고서 메일</span><input type="checkbox" role="switch" defaultChecked /></li>
          </ul>
        </section>
      </div>
    </div>
  )
})
