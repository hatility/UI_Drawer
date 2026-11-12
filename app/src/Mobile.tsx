// 체험관 모바일: Stageshow Phone 안에서 진짜로 움직이는 빵집 앱.
// 마우스로도 돼요: 아래로 당기기, 줄을 왼쪽으로 밀기, 꾹 누르기, 사진 두 번 누르기, 시트 끌어내리기.
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type PointerEvent as PE } from 'react'
import { Bell, Heart, Home, Menu, Minus, Plus, Search, ShoppingBag, User, X } from 'lucide-react'
import { Phone } from './kit/phone'
import { useLabels } from './labels'
import './mobile.css'

export type MobileHandle = { demo: (id: string) => void }
type Props = { theme: string; labels: boolean; onOpen: (id: string) => void; saw: (id: string) => void }

const BREADS = [
  { id: 1, name: '소금빵', price: 3500, color: '#e7b277' },
  { id: 2, name: '우유 식빵', price: 5200, color: '#efcf9c' },
  { id: 3, name: '통밀 깜파뉴', price: 7500, color: '#c58f5a' },
  { id: 4, name: '얼그레이 쿠키', price: 2800, color: '#cfa77e' },
]
const STORIES = ['새 빵', '이벤트', '굽는 법', '매장']
const won = (n: number) => `${n.toLocaleString('ko-KR')}원`

export const Mobile = forwardRef<MobileHandle, Props>(function Mobile({ theme, labels, onOpen, saw }, ref) {
  const box = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const { overlay, spot } = useLabels(box, labels, onOpen)

  const [tab, setTab] = useState(0)
  const [nav, setNav] = useState(false)
  const [sheet, setSheet] = useState<null | 'add' | 'actions'>(null)
  const [sheetDy, setSheetDy] = useState(0)
  const [qty, setQty] = useState(1)
  const [cart, setCart] = useState([1, 3, 4])
  const [offset, setOffset] = useState<Record<number, number>>({})
  const [dragging, setDragging] = useState<number | null>(null)
  const [removed, setRemoved] = useState<{ id: number; at: number } | null>(null)
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const [liked, setLiked] = useState<number[]>([])
  const [burst, setBurst] = useState<number | null>(null)
  const [story, setStory] = useState<number | null>(null)
  const [toast, setToast] = useState<{ msg: string; undo?: boolean; k: number } | null>(null)

  const say = (msg: string, undo = false) => { setToast({ msg, undo, k: Date.now() }); saw(undo ? 'snackbar' : 'toast') }
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), toast.undo ? 4000 : 2000); return () => clearTimeout(t) }, [toast])
  useEffect(() => { if (story === null) return; const t = setTimeout(() => setStory((s) => (s !== null && s < STORIES.length - 1 ? s + 1 : null)), 3000); return () => clearTimeout(t) }, [story])

  // ─── 당겨서 새로고침 ───
  const pullFrom = useRef<number | null>(null)
  const refresh = () => {
    setRefreshing(true); setPull(56); saw('pull-refresh')
    setTimeout(() => { setRefreshing(false); setPull(0); say('새로 구운 빵을 불러왔어요') }, 1000)
  }
  const onPullDown = (e: PE) => { if ((scroller.current?.scrollTop ?? 1) <= 0 && !refreshing) pullFrom.current = e.clientY }
  const onPullMove = (e: PE) => { if (pullFrom.current !== null) setPull(Math.max(0, Math.min(80, (e.clientY - pullFrom.current) * 0.5))) }
  const onPullUp = () => { if (pullFrom.current === null) return; pullFrom.current = null; if (pull > 44) refresh(); else setPull(0) }

  // ─── 줄: 왼쪽으로 밀어 삭제 · 꾹 눌러 메뉴 ───
  const row = useRef<{ id: number; x: number; y: number; timer: number; moved: boolean } | null>(null)
  const remove = (id: number) => {
    setRemoved({ id, at: cart.indexOf(id) })
    setCart((c) => c.filter((x) => x !== id))
    setOffset((o) => ({ ...o, [id]: 0 }))
    say('장바구니에서 뺐어요', true); saw('swipe')
  }
  const longPress = () => { navigator.vibrate?.(15); setSheet('actions'); setSheetDy(0); saw('long-press') }
  const onRowDown = (id: number) => (e: PE) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    row.current = { id, x: e.clientX, y: e.clientY, moved: false, timer: window.setTimeout(() => { if (row.current && !row.current.moved) { row.current = null; longPress() } }, 500) }
  }
  const onRowMove = (e: PE) => {
    const r = row.current
    if (!r) return
    const dx = e.clientX - r.x
    if (!r.moved && (Math.abs(dx) > 6 || Math.abs(e.clientY - r.y) > 6)) { r.moved = true; clearTimeout(r.timer); setDragging(r.id) }
    if (r.moved) setOffset((o) => ({ ...o, [r.id]: Math.max(-110, Math.min(0, dx)) }))
  }
  const onRowUp = () => {
    const r = row.current
    setDragging(null)
    if (!r) return
    clearTimeout(r.timer); row.current = null
    if ((offset[r.id] ?? 0) < -70) remove(r.id)
    else setOffset((o) => ({ ...o, [r.id]: 0 }))
  }

  // ─── 바텀시트: 그래버를 끌어내리면 닫혀요 ───
  const sheetFrom = useRef<number | null>(null)
  const openSheet = (s: 'add' | 'actions') => { setSheet(s); setSheetDy(0); saw('bottom-sheet') }
  const onGrabDown = (e: PE) => { e.currentTarget.setPointerCapture(e.pointerId); sheetFrom.current = e.clientY }
  const onGrabMove = (e: PE) => { if (sheetFrom.current !== null) setSheetDy(Math.max(0, e.clientY - sheetFrom.current)) }
  const onGrabUp = () => { if (sheetFrom.current === null) return; sheetFrom.current = null; if (sheetDy > 80) { setSheet(null); saw('drag-to-dismiss') } setSheetDy(0) }

  const like = (id: number) => { setLiked((l) => (l.includes(id) ? l : [...l, id])); setBurst(id); setTimeout(() => setBurst(null), 700); saw('double-tap') }

  useImperativeHandle(ref, () => ({
    demo(id) {
      const after = (fn: () => void, ms = 400) => setTimeout(fn, ms)
      setNav(false); setStory(null); setTab(0)
      switch (id) {
        case 'bottom-sheet': case 'sticky-cta': case 'grabber': case 'drag-to-dismiss': openSheet('add'); after(() => spot(id === 'drag-to-dismiss' ? 'grabber' : id)); break
        case 'pull-refresh': scroller.current?.scrollTo({ top: 0 }); after(refresh); break
        case 'swipe': {
          const first = cart[0]
          if (first === undefined) break
          spot('swipe'); after(() => setOffset((o) => ({ ...o, [first]: -100 })), 700); after(() => remove(first), 1300); break
        }
        case 'long-press': after(longPress); break
        case 'double-tap': spot('double-tap'); after(() => like(BREADS[0].id), 600); break
        case 'hamburger-menu': setNav(true); saw('hamburger-menu'); break
        case 'story': setStory(0); saw('story'); break
        default: spot(id)
      }
    },
  }))

  const sheetOpen = sheet !== null
  return (
    <Phone width={340} className="mb-phone" dark={theme === 'dark-mode'}>
      <div ref={box} className={`mb pg-theme--${theme}${labels ? ' pg-labels' : ''}`}>
        <header className="mb-bar" data-ui="top-app-bar">
          <button className="mb-icon" data-ui="hamburger-menu" aria-label="메뉴" onClick={() => { setNav(true); saw('hamburger-menu') }}><Menu size={22} /></button>
          <b>몽글 베이커리</b>
          <button className="mb-icon" aria-label="알림" onClick={() => say('새 알림이 없어요')}><Bell size={20} /></button>
        </header>

        {tab === 0 ? (
          <div className="mb-scroll" ref={scroller} data-ui="pull-refresh" onPointerDown={onPullDown} onPointerMove={onPullMove} onPointerUp={onPullUp} onPointerLeave={onPullUp}>
            <div className="mb-pull" style={{ height: pull }}><i className={refreshing ? 'spin' : ''} style={{ rotate: `${pull * 5}deg`, opacity: Math.min(1, pull / 44) }} /></div>
            <label className="mb-search" data-ui="search-bar"><Search size={18} /><input placeholder="빵 이름으로 찾기" aria-label="빵 찾기" /></label>

            <div className="mb-stories" data-ui="story">
              {STORIES.map((t, i) => <button key={t} onClick={() => { setStory(i); saw('story') }}><i className={i < 2 ? 'new' : ''} /><small>{t}</small></button>)}
            </div>

            <h3>오늘의 빵 <small>옆으로 밀고, 사진을 두 번 눌러요</small></h3>
            <div className="mb-snap" data-ui="scroll-snap" onScroll={() => saw('scroll-snap')}>
              {BREADS.map((b) => (
                <div key={b.id} className="mb-card">
                  <div className="mb-img" style={{ ['--c' as string]: b.color }} data-ui={b.id === 1 ? 'double-tap' : undefined} onDoubleClick={() => like(b.id)}>
                    {liked.includes(b.id) && <Heart size={18} className="mb-liked" />}
                    {burst === b.id && <Heart size={64} className="mb-burst" />}
                  </div>
                  <b>{b.name}</b><span>{won(b.price)}</span>
                </div>
              ))}
            </div>

            <h3>장바구니 <small>왼쪽으로 밀기 · 꾹 누르기</small></h3>
            <ul className="mb-list" data-ui="list-item">
              {cart.map((id, i) => {
                const b = BREADS.find((x) => x.id === id)!
                return (
                  <li key={id} className="mb-row-wrap" data-ui={i === 0 ? 'swipe' : i === 1 ? 'long-press' : undefined}>
                    <span className="mb-row-del">삭제</span>
                    <div className="mb-row" style={{ translate: `${offset[id] ?? 0}px 0`, transition: dragging === id ? 'none' : undefined }}
                      onPointerDown={onRowDown(id)} onPointerMove={onRowMove} onPointerUp={onRowUp} onPointerCancel={onRowUp}>
                      <i style={{ ['--c' as string]: b.color }} />
                      <div><b>{b.name}</b><small>{won(b.price)}</small></div>
                    </div>
                  </li>
                )
              })}
              {cart.length === 0 && <li className="mb-empty">장바구니가 비었어요</li>}
            </ul>
          </div>
        ) : (
          <div className="mb-scroll mb-placeholder"><b>{['', '찾기', '찜', 'MY'][tab]}</b><small>체험관에서는 홈만 열려 있어요</small></div>
        )}

        <button className="mb-fab" data-ui="fab" aria-label="빵 담기" onClick={() => openSheet('add')}><Plus size={24} /></button>

        <nav className="mb-tabs" data-ui="tab-bar">
          {([[Home, '홈'], [Search, '찾기'], [Heart, '찜'], [User, 'MY']] as const).map(([I, t], i) => (
            <button key={t} className={tab === i ? 'on' : ''} onClick={() => { setTab(i); saw('tab-bar') }}>
              <span><I size={22} />{i === 2 && liked.length > 0 && <em>{liked.length}</em>}</span>{t}
            </button>
          ))}
        </nav>

        {/* 햄버거 메뉴 → 내비게이션 드로어 */}
        <div className={`mb-scrim${nav ? ' on' : ''}`} onClick={() => setNav(false)} />
        <aside className={`mb-drawer${nav ? ' on' : ''}`} data-ui="drawer" data-hidden={nav ? undefined : ''}>
          <b>몽글 베이커리</b>
          {['홈', '주문 내역', '쿠폰', '설정'].map((t, i) => <button key={t} className={i === 0 ? 'on' : ''} onClick={() => setNav(false)}>{t}</button>)}
        </aside>

        {/* 바텀시트 */}
        <div className={`mb-scrim${sheetOpen ? ' on' : ''}`} onClick={() => setSheet(null)} />
        <section className={`mb-sheet${sheetOpen ? ' on' : ''}`} data-ui="bottom-sheet" data-hidden={sheetOpen ? undefined : ''}
          style={sheetDy ? { translate: `0 ${sheetDy}px`, transition: 'none' } : undefined}>
          <div className="mb-grab" data-ui="grabber" onPointerDown={onGrabDown} onPointerMove={onGrabMove} onPointerUp={onGrabUp} onPointerCancel={onGrabUp}><i /></div>
          {sheet === 'actions' ? (
            <div className="mb-actions">
              {['공유하기', '찜하기', '숨기기'].map((t) => <button key={t} onClick={() => { setSheet(null); say(`${t}를 눌렀어요`) }}>{t}</button>)}
            </div>
          ) : (
            <>
              <div className="mb-sheet-item"><i style={{ ['--c' as string]: '#e7b277' }} /><div><b>소금빵</b><small>{won(3500)}</small></div>
                <span className="mb-stepper" data-ui="stepper"><button aria-label="하나 빼기" disabled={qty <= 1} onClick={() => setQty(qty - 1)}><Minus size={16} /></button><b>{qty}</b><button aria-label="하나 더" onClick={() => setQty(qty + 1)}><Plus size={16} /></button></span>
              </div>
              <p className="mb-sheet-hint">회색 막대를 아래로 끌면 닫혀요</p>
              <button className="mb-cta" data-ui="sticky-cta" onClick={() => { setSheet(null); setCart((c) => (c.includes(1) ? c : [1, ...c])); say('장바구니에 담았어요') }}><ShoppingBag size={18} />{won(3500 * qty)} 담기</button>
            </>
          )}
        </section>

        {/* 스토리 보기 */}
        {story !== null && (
          <div className="mb-story" onClick={() => setStory(story < STORIES.length - 1 ? story + 1 : null)}>
            <div className="mb-story-bars">{STORIES.map((_, i) => <i key={i} className={i < story ? 'done' : i === story ? 'on' : ''} />)}</div>
            <button className="mb-story-x" aria-label="닫기" onClick={(e) => { e.stopPropagation(); setStory(null) }}><X size={22} /></button>
            <b>{STORIES[story]}</b>
            <small>누르면 다음 · 3초마다 넘어가요</small>
          </div>
        )}

        <div className="mb-toasts">
          {toast && (
            <div key={toast.k} className={`pg-toast${toast.undo ? ' pg-snack' : ''}`} data-ui={toast.undo ? 'snackbar' : 'toast'}>
              {toast.msg}
              {toast.undo && removed && <button onClick={() => { setCart((c) => { const n = [...c]; n.splice(removed.at, 0, removed.id); return n }); setRemoved(null); setToast(null) }}>실행 취소</button>}
            </div>
          )}
        </div>
        {overlay}
      </div>
    </Phone>
  )
})
