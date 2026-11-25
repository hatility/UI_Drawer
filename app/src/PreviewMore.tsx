// 장면 틀로 그리는 카드 그림 (src/more/ 의 카드들). Stageshow 규칙은 그대로:
// 주변은 회색 뼈대, 주인공 하나만 색과 진짜 글자. 올리면 주인공이 한 번 움직여요 (pv-pop · pv-fade · pv-rise …).
import type { ReactNode } from 'react'
import { Bar } from './kit/window'
import type { Pic } from './pic'

const Lines = ({ n = 3 }: { n?: number }) => <div className="pv-lines">{[80, 64, 72, 56].slice(0, n).map((w, i) => <Bar key={i} w={`${w}%`} h={5} tone={3} />)}</div>
const Screen = ({ children, dim = false, head = true }: { children?: ReactNode; dim?: boolean; head?: boolean }) => (
  <div className={`pv-screen${dim ? ' pv-dim' : ''}`}>{head && <div className="pv-head"><Bar w={22} h={6} tone={4} /><span className="pv-sp" /><Bar w={10} h={10} r={5} tone={3} /></div>}{children}</div>
)

export function scene(p: Pic): ReactNode {
  const items = p.items ?? []
  const on = p.on ?? 0
  switch (p.k) {
    case 'toast': return <Screen><Lines /><div className={`pv-toast pv-pop${p.b ? ' pv-toast--wide' : ''}`}>{p.t}{p.b && <> <b>{p.b}</b></>}</div></Screen>
    case 'banner': return <Screen head={false}><div className="pv-banner pv-drop">{p.t}{p.b ? <b>{p.b}</b> : <span>✕</span>}</div><div className="pv-head"><Bar w={22} h={6} tone={4} /></div><Lines /></Screen>
    case 'modal': return <Screen dim><Lines /><div className="pv-modal pv-pop"><b>{p.t}</b>{p.s ? <small>{p.s}</small> : <Bar w={70} h={5} tone={3} />}<span className="pv-btn">{p.b ?? '확인'}</span></div></Screen>
    case 'perm': return <Screen dim><Lines /><div className="pv-modal pv-modal--sm pv-pop"><b>{p.t}</b>{p.s && <small>{p.s}</small>}<div className="pv-row2"><span className="pv-btn pv-btn--ghost">{p.s ? '안 함' : '취소'}</span><span className="pv-btn">{p.b ?? '허용'}</span></div></div></Screen>
    case 'sheet': return <Screen dim><Lines n={2} /><div className="pv-drawer pv-rise pm-sheet"><i className="pv-grabber" /><b>{p.t}</b>{items.slice(0, 3).map((x, i) => <span key={i}>{x}</span>)}</div></Screen>
    case 'btn': return <div className="pv-center pv-col"><span className="pv-btn pv-btn--lg pv-pop">{p.i && <i>{p.i}</i>}{p.t}</span>{p.s && <small className="pm-cap">{p.s}</small>}</div>
    case 'btn2': return <div className="pv-center"><div className="pv-row2"><span className="pv-btn pv-btn--ghost">{p.s}</span><span className="pv-btn pv-pop">{p.t}</span></div></div>
    case 'chips': return <div className="pv-center pm-wrap">{items.map((x, i) => <span key={i} className={`pv-chip${i === on ? ' on pv-pop' : ''}`}>{x}</span>)}</div>
    case 'form': return <div className="pv-form"><small>{p.s}</small><span className={`pv-input${p.i === 'err' ? ' pv-input--err' : ' pv-input--focus'}`}>{p.t}{p.i !== 'err' && <i className="pv-caret" />}</span>{p.b && <span className={p.i === 'err' ? 'pv-err pv-fade' : 'pv-okhint pv-fade'}>{p.b}</span>}</div>
    case 'toggle': return <div className="pv-form pv-gap">{items.map((x, i) => <div key={i} className="pv-setting">{i === on ? <span>{x}</span> : <Bar w={60} h={5} tone={3} />}<span className={`pv-toggle${i === on ? ' on pv-pop' : ''}`} /></div>)}</div>
    case 'seg': return <div className="pv-center"><span className="pv-seg"><i className="pv-seg-k pv-pop" />{items.map((x, i) => <span key={i} className={i === on ? 'on' : ''}>{x}</span>)}</span></div>
    case 'tabs': return <Screen><div className="pv-tabs">{items.map((x, i) => <span key={i} className={i === on ? 'on' : ''}>{x}</span>)}<i className="pv-tab-k pv-pop" /></div><Lines n={2} /></Screen>
    case 'list': return <div className="pv-form pv-gap">{items.map((x, i) => <div key={i} className={`pv-li${i === on ? ' pv-pop' : ''}`}><i className="pv-li-img" />{i === on ? <div><b>{x}</b>{p.s && <small>{p.s}</small>}</div> : <div><Bar w={60} h={5} tone={4} /><Bar w={40} h={5} tone={3} /></div>}<span>›</span></div>)}</div>
    case 'row': return <div className="pv-form pv-gap pm-rows">{items.map((x, i) => <div key={i} className={`pm-row${i === on ? ' on pv-pop' : ''}`}>{i === on ? <><b>{x}</b>{p.s && <em>{p.s}</em>}</> : <><Bar w={56} h={5} tone={3} /><Bar w={24} h={5} tone={3} /></>}</div>)}</div>
    case 'card': return <div className="pv-center"><div className="pv-card pv-pop"><i className="pv-img" /><b>{p.t}</b><small>{p.s}</small></div><div className="pv-card pv-card--ghost"><i className="pv-img" /><Bar w="60%" h={5} tone={3} /></div></div>
    case 'table': return <div className="pv-table">{[0, 1, 2, 3].map((r) => <div key={r} className={r === 0 ? 'th' : r === on + 1 ? 'pm-on pv-fade' : ''}>{r === 0 ? items.map((x, i) => <span key={i}>{x}</span>) : r === on + 1 && p.t ? <><b>{p.t}</b><Bar w="60%" h={5} tone={3} /><Bar w="50%" h={5} tone={3} /></> : <><Bar w="70%" h={5} tone={3} /><Bar w="60%" h={5} tone={3} /><Bar w="50%" h={5} tone={3} /></>}</div>)}</div>
    case 'stat': return <div className="pv-center"><div className="pv-stat pv-pop"><small>{p.s}</small><b>{p.t}</b>{p.b && <em>{p.b}</em>}</div></div>
    case 'steps': return <div className="pv-center pv-steps">{Array.from({ length: p.n ?? 3 }, (_, i) => <span key={i} className="pm-step">{i < on ? <i className="done">✓</i> : <i className={i === on ? 'on pv-pop' : ''}>{i + 1}</i>}{i < (p.n ?? 3) - 1 && <em className={i < on ? 'done' : ''} />}</span>)}</div>
    case 'progress': return <div className="pv-form"><small>{p.t} {p.s && <b>{p.s}</b>}</small><span className="pv-progress"><i className="pv-grow" style={{ width: `${p.n ?? 60}%` }} /></span></div>
    case 'badge': return <div className="pv-center pv-col"><span className="pv-bigicon">{p.i ?? '🔔'}<em className={`pv-badge pv-pop${p.n === 0 ? ' pv-badge--dot' : ''}`}>{p.n || ''}</em></span>{p.t && <small className="pm-cap">{p.t}</small>}</div>
    case 'menu': return <Screen><Lines n={2} /><div className="pv-anchor pv-anchor--r pm-menu-at"><span className="pv-ico">⋮</span><div className="pv-pop-menu pv-pop pm-menu">{items.slice(0, 3).map((x, i) => <span key={i} className={i === on ? 'on' : ''}>{x}</span>)}</div></div></Screen>
    case 'tip': return <Screen><Lines n={2} /><div className="pv-anchor"><span className="pv-ico">{p.i ?? '?'}</span><span className="pv-tip pv-fade">{p.t}</span></div></Screen>
    case 'chat': return <div className="pv-form pv-chat"><span className="them">{p.s}</span><span className="me pv-pop">{p.t}</span>{p.b && <span className="them pv-fade">{p.b}</span>}</div>
    case 'player': return <div className="pv-center"><div className="pv-player"><span className="pv-play pv-pop">{p.i ?? '▶'}</span><div className="pv-player-bar"><i><b style={{ width: `${p.n ?? 44}%` }} /></i><small>{p.t ?? '1:24 / 3:10'}</small></div></div></div>
    case 'month': return <div className="pv-month">{Array.from({ length: 21 }, (_, i) => <i key={i}>{i + 1}{i === (p.n ?? 9) && <em className="pv-pop">{p.t}</em>}</i>)}</div>
    case 'map': return <div className="pv-map"><i className="pv-road1" /><i className="pv-road2" /><span className="pv-pin pv-drop" /><span className="pv-pin-tip">{p.t}</span></div>
    case 'faces': return <div className="pv-center pv-col"><span className="pv-facepile pv-pop">{['몽', 'B', '반', '크'].slice(0, p.n ?? 4).map((x, i) => <i key={i} style={{ zIndex: 5 - i }}>{x}</i>)}{p.s && <i className="more">{p.s}</i>}</span><small>{p.t}</small></div>
    case 'keys': return <div className="pv-center pv-keys pv-pop">{items.map((x, i) => <span key={i} className="pm-key">{i > 0 && <span>+</span>}<kbd>{x}</kbd></span>)}</div>
    case 'check': return <div className="pv-form pv-gap pv-checklist">{p.t && <small>{p.t}</small>}{items.map((x, i) => <label key={i} className={`pv-check${i < on ? ' on' : ''}${i === on - 1 ? ' pv-pop' : ''}`}><span>{x}</span></label>)}</div>
    case 'bars': return <div className="pv-center pv-bars">{(p.items ?? ['30', '50', '40', '70', '55', '85']).map((h, i) => <i key={i} style={{ height: Number(h) }} className={i === (p.on ?? 5) ? 'on pv-grow' : ''} />)}</div>
    case 'phone': return <div className="pv-phone"><div className="pv-appbar"><span>‹</span><b>{p.t}</b><span>⋮</span></div>{p.s ? <div className="pv-toast pv-pop pm-inphone">{p.s}</div> : null}<Lines n={4} /></div>
    case 'icon': return <div className="pv-center pv-col"><span className="pv-glyph pv-pop">{p.i}</span>{p.t && <small className="pm-cap">{p.t}</small>}</div>
    case 'text': return <div className="pv-center pv-col pm-text"><b className="pv-pop">{p.t}</b>{p.s && <small>{p.s}</small>}</div>
    case 'empty': return <div className="pv-center pv-col"><span className="pv-empty pv-pop">{p.i ?? '📭'}</span><b className="pv-emptyt">{p.t}</b>{p.s && <small>{p.s}</small>}{p.b && <span className="pv-btn">{p.b}</span>}</div>
    case 'code': return <div className="pv-center"><pre className="pv-code pv-fade">{p.t}</pre></div>
    case 'slider': return <div className="pv-form"><small>{p.t} {p.s && <b>{p.s}</b>}</small><span className="pv-slider"><i /><b className="pv-knob pv-pop" style={{ left: `${p.n ?? 60}%` }} /></span></div>
    case 'coach': return <Screen dim><Lines n={2} /><span className="pv-spot" /><div className="pv-coach pv-fade"><b>{p.t}</b><small>{p.s ?? '1 / 3'}</small></div></Screen>
    case 'search': return <div className="pv-form"><span className="pv-input pv-input--pill pv-input--focus">🔍 {p.t}<i className="pv-caret" /></span><div className="pv-list pv-drop">{items.map((x, i) => <span key={i} className={i === on ? 'on' : ''}>{x}</span>)}</div></div>
    case 'tag': return <div className="pv-center pm-wrap">{items.map((x, i) => <span key={i} className={`pm-tag${i === on ? ' on pv-pop' : ''}`}>{x}</span>)}</div>
    case 'ring': return <div className="pv-center pv-col"><span className="pm-ring pv-pop" style={{ ['--p' as string]: `${p.n ?? 70}%` }}><b>{p.t}</b></span>{p.s && <small className="pm-cap">{p.s}</small>}</div>
  }
}

/** 장면 자체에 움직이는 부품이 없는 종류는 data-m 으로 움직여요 (preview.css 의 data-m 규칙) */
export const PIC_MOTION: Partial<Record<Pic['k'], string>> = { bars: 'grow', table: 'stagger', month: 'pop', check: 'stagger' }
