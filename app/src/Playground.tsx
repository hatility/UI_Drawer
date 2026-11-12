// 체험관: 가상의 빵집 사이트 "몽글 베이커리".
// 사이트 안의 UI마다 data-ui="사전 id" 를 달아 두었어요.
//  - 이름표 켜기: 화면 위 모든 UI에 이름이 붙고, 누르면 사전 서랍이 열려요.
//  - 보여 줘: 오른쪽 목록에서 고르면 그 UI가 직접 움직여요.
//  - 방금 본 UI: 사이트를 쓰다가 뜬 UI의 이름이 기록돼요.
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { ArrowUp, ChevronLeft, ChevronRight, Heart, Info, LayoutGrid, Minus, MoreVertical, Plus, Search, ShoppingBag, Star, Trash2, X } from 'lucide-react'
import { Window } from './kit/window'
import { Check, Tag } from 'lucide-react'
import { byId } from './data'
import { relRect, useLabels, type Rect } from './labels'
import { Mobile, type MobileHandle } from './Mobile'
import './playground.css'

type Cat = '빵' | '케이크' | '쿠키'
type Product = { id: number; name: string; cat: Cat; price: number; tags: string[]; rate: number; color: string }

const PRODUCTS: Product[] = [
  { id: 1, name: '소금빵', cat: '빵', price: 3500, tags: ['통밀'], rate: 4.8, color: '#e7b277' },
  { id: 2, name: '통밀 깜파뉴', cat: '빵', price: 7500, tags: ['통밀', '비건'], rate: 4.6, color: '#c58f5a' },
  { id: 3, name: '우유 식빵', cat: '빵', price: 5200, tags: [], rate: 4.7, color: '#efcf9c' },
  { id: 4, name: '비건 바게트', cat: '빵', price: 4800, tags: ['비건'], rate: 4.4, color: '#d9a066' },
  { id: 5, name: '딸기 생크림 케이크', cat: '케이크', price: 32000, tags: [], rate: 4.9, color: '#f0b7b3' },
  { id: 6, name: '무설탕 당근 케이크', cat: '케이크', price: 28000, tags: ['무설탕'], rate: 4.5, color: '#e9a56b' },
  { id: 7, name: '얼그레이 쿠키', cat: '쿠키', price: 2800, tags: ['비건'], rate: 4.3, color: '#cfa77e' },
  { id: 8, name: '무설탕 오트 쿠키', cat: '쿠키', price: 2500, tags: ['무설탕', '통밀'], rate: 4.2, color: '#d8b98c' },
]
const CATS: Cat[] = ['빵', '케이크', '쿠키']
const TAGS = ['비건', '통밀', '무설탕']
const SORTS = ['인기', '낮은 가격', '높은 가격'] as const
const FREE = 30000
const won = (n: number) => `${n.toLocaleString('ko-KR')}원`
type Theme = 'material' | 'flat' | 'glassmorphism' | 'neumorphism' | 'brutalism' | 'dark-mode'
const THEMES: [Theme, string][] = [['material', '머티리얼'], ['flat', '플랫'], ['glassmorphism', '글래스'], ['neumorphism', '뉴모피즘'], ['brutalism', '브루탈'], ['dark-mode', '다크']]
// 모바일에서만 체험하는 것: 고르면 모바일 화면으로 바꿔서 보여 줘요
const MOBILE = new Set(['bottom-sheet', 'tab-bar', 'pull-refresh', 'swipe', 'long-press', 'double-tap', 'hamburger-menu', 'top-app-bar', 'story', 'search-bar', 'list-item', 'scroll-snap', 'sticky-cta', 'grabber', 'drag-to-dismiss'])
const MOBILE_HINTS: [string, string][] = [['pull-refresh', '아래로 당기기'], ['swipe', '왼쪽으로 밀기'], ['long-press', '꾹 누르기'], ['double-tap', '사진 두 번 누르기'], ['bottom-sheet', '바텀시트'], ['drag-to-dismiss', '끌어 내려 닫기'], ['hamburger-menu', '햄버거 메뉴'], ['story', '스토리'], ['scroll-snap', '스크롤 스냅'], ['tab-bar', '탭 바']]
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

const SLIDES = [
  { title: '갓 구운 아침을 문 앞까지', sub: '첫 주문은 무료배송', tone: 'a' },
  { title: '회원이면 10% 쿠폰', sub: '지금 받고 오늘 써요', tone: 'b', cta: '쿠폰 받기' },
  { title: '겨울 한정 밤 식빵', sub: '하루 30개만 구워요', tone: 'c' },
]

const COACH = [
  { ui: 'autocomplete', text: '먹고 싶은 빵을 여기서 찾아요' },
  { ui: 'tabs', text: '빵 · 케이크 · 쿠키를 골라 봐요' },
  { ui: 'badge', text: '담은 빵은 여기 모여요' },
]

export function Playground({ onOpen, show }: { onOpen: (id: string) => void; show?: string }) {
  const body = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)

  // ─── 사이트 상태 ───
  const [banner, setBanner] = useState(true)
  const [slide, setSlide] = useState(0)
  const [cat, setCat] = useState<Cat>('빵')
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [sort, setSort] = useState(0)
  const [maxPrice, setMaxPrice] = useState(35000)
  const [page, setPage] = useState(1)
  const [liked, setLiked] = useState<number[]>([])
  const [adding, setAdding] = useState<number | null>(null)
  const [menu, setMenu] = useState<number | null>(null)
  const [bento, setBento] = useState(false)
  const [mega, setMega] = useState(false)
  const [q, setQ] = useState('')
  const [qFocus, setQFocus] = useState(false)
  const [term, setTerm] = useState('')
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([{ id: 1, qty: 2 }])
  const [cartOpen, setCartOpen] = useState(false)
  const [removed, setRemoved] = useState<{ id: number; qty: number; at: number } | null>(null)
  const [toast, setToast] = useState<{ msg: string; k: number } | null>(null)
  const [snack, setSnack] = useState<{ msg: string; k: number } | null>(null)
  const [modal, setModal] = useState<null | 'coupon' | 'thanks'>(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const [faq, setFaq] = useState<number | null>(0)
  const [email, setEmail] = useState('')
  const [emailTried, setEmailTried] = useState(false)
  const [agree, setAgree] = useState(false)
  const [ads, setAds] = useState(true) // 기본 선택 함정: 일부러 미리 체크해 둔 거예요
  const [notify, setNotify] = useState(false)
  const [store, setStore] = useState('성수점')
  const [pack, setPack] = useState('종이 봉투')
  const [date, setDate] = useState('')
  const [fab, setFab] = useState(false)
  const [tip, setTip] = useState(false)
  const [coach, setCoach] = useState<number | null>(null)
  const [timer, setTimer] = useState(3 * 3600 - 1)

  // ─── 체험관 상태 ───
  const [labels, setLabels] = useState(false)
  const [theme, setTheme] = useState<Theme>('material')
  const [device, setDevice] = useState<'pc' | 'mobile'>('pc')
  const mobile = useRef<MobileHandle>(null)
  const [log, setLog] = useState<string[]>([])
  const saw = useCallback((id: string) => setLog((l) => [id, ...l.filter((x) => x !== id)].slice(0, 6)), [])

  // 토스트 · 스낵바는 저절로 사라져요
  const say = useCallback((msg: string) => { setToast({ msg, k: Date.now() }); saw('toast') }, [saw])
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2200); return () => clearTimeout(t) }, [toast])
  useEffect(() => { if (!snack) return; const t = setTimeout(() => setSnack(null), 5000); return () => clearTimeout(t) }, [snack])

  // 캐러셀은 5초마다 넘어가요
  useEffect(() => { const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000); return () => clearInterval(t) }, [slide])
  // 거짓 긴급성: 0이 되면 몰래 다시 3시간으로 (그래서 다크 패턴이에요)
  useEffect(() => { const t = setInterval(() => setTimer((s) => (s <= 0 ? 3 * 3600 - 1 : s - 1)), 1000); return () => clearInterval(t) }, [])

  // 탭 · 쪽을 바꾸면 잠깐 스켈레톤
  const reload = useCallback(() => { setLoading(true); saw('skeleton'); setTimeout(() => setLoading(false), 700) }, [saw])

  // 열린 작은 판은 바깥을 누르면 닫혀요
  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (!t.closest('.pg-kebab-wrap')) setMenu(null)
      if (!t.closest('.pg-bento-wrap')) setBento(false)
      if (!t.closest('.pg-search')) setQFocus(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const list = useMemo(() => {
    let l = PRODUCTS.filter((p) => (term ? p.name.includes(term) : p.cat === cat))
    l = l.filter((p) => tags.every((t) => p.tags.includes(t)) && p.price <= maxPrice)
    if (sort === 0) l = [...l].sort((a, b) => b.rate - a.rate)
    if (sort === 1) l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 2) l = [...l].sort((a, b) => b.price - a.price)
    return l
  }, [cat, tags, maxPrice, sort, term])
  useEffect(() => { if (list.length === 0) saw('empty-state') }, [list.length, saw])

  const suggestions = q.trim() ? PRODUCTS.filter((p) => p.name.includes(q.trim())).slice(0, 5) : []
  const count = cart.reduce((n, c) => n + c.qty, 0)
  const total = cart.reduce((n, c) => n + PRODUCTS.find((p) => p.id === c.id)!.price * c.qty, 0)
  const emailBad = emailTried && !EMAIL.test(email)

  const like = (p: Product) => {
    const on = !liked.includes(p.id)
    setLiked((l) => (on ? [...l, p.id] : l.filter((x) => x !== p.id)))
    saw('micro-interaction')
    if (on) say('찜 목록에 저장했어요')
  }
  const add = (p: Product) => {
    setAdding(p.id); saw('spinner')
    setTimeout(() => {
      setAdding(null)
      setCart((c) => (c.some((x) => x.id === p.id) ? c.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x)) : [...c, { id: p.id, qty: 1 }]))
      say('장바구니에 담았어요'); saw('badge')
    }, 800)
  }
  const remove = (id: number) => {
    const at = cart.findIndex((c) => c.id === id)
    if (at < 0) return
    setRemoved({ ...cart[at], at })
    setCart((c) => c.filter((x) => x.id !== id))
    setSnack({ msg: '장바구니에서 뺐어요', k: Date.now() }); saw('snackbar')
  }
  const undo = () => {
    if (!removed) return
    setCart((c) => { const n = [...c]; n.splice(removed.at, 0, { id: removed.id, qty: removed.qty }); return n })
    setRemoved(null); setSnack(null)
  }
  const openCart = () => { setCartOpen(true); saw('drawer') }
  const search = (word: string) => { setTerm(word); setQ(word); setQFocus(false); reload(); saw('autocomplete') }

  // 이름표 · 반짝 (labels.tsx)
  const { overlay, spot, measure } = useLabels(body, labels, onOpen)

  const top = () => scroller.current?.scrollTo({ top: 0, behavior: 'smooth' })
  const demo = (id: string) => {
    if (MOBILE.has(id)) { setDevice('mobile'); setTimeout(() => mobile.current?.demo(id), 350); return }
    if (device === 'mobile' && !['material', 'flat', 'glassmorphism', 'neumorphism', 'brutalism', 'dark-mode', 'toast', 'snackbar', 'fab', 'drawer'].includes(id)) { setDevice('pc'); setTimeout(() => demoRef.current(id), 350); return }
    setMenu(null); setBento(false); setMega(false)
    const after = (fn: () => void, ms = 450) => setTimeout(fn, ms)
    switch (id) {
      case 'toast': case 'micro-interaction': spot('card'); after(() => like(list[0] ?? PRODUCTS[0])); break
      case 'snackbar': openCart(); after(() => { if (cart.length) remove(cart[0].id); else { setCart([{ id: 3, qty: 1 }]); setRemoved({ id: 3, qty: 1, at: 0 }); setSnack({ msg: '장바구니에서 뺐어요', k: Date.now() }); saw('snackbar') } }, 500); break
      case 'banner': setBanner(true); top(); after(() => spot('banner')); break
      case 'modal': case 'confirmshaming': top(); setSlide(1); after(() => { setModal('coupon'); saw('modal') }); break
      case 'alert': openCart(); after(() => { setAlertOpen(true); saw('alert') }, 600); break
      case 'tooltip': spot('tooltip'); after(() => { setTip(true); saw('tooltip'); after(() => setTip(false), 2400) }); break
      case 'popover': case 'kebab': spot('card'); after(() => { setMenu(list[0]?.id ?? null); saw('popover') }); break
      case 'coachmark': top(); after(() => { setCoach(0); saw('coachmark') }); break
      case 'spinner': spot('card'); after(() => list[0] && add(list[0])); break
      case 'skeleton': spot('tabs'); after(reload); break
      case 'drawer': case 'stepper': case 'progress': case 'select': case 'radio': case 'date-picker': openCart(); after(() => spot(id), 500); break
      case 'mega-menu': top(); after(() => { setMega(true); saw('mega-menu') }); break
      case 'bento': top(); after(() => { setBento(true); saw('bento') }); break
      case 'autocomplete': top(); setQ('소금'); setQFocus(true); saw('autocomplete'); break
      case 'clear-icon': top(); setQ('소금빵'); after(() => spot('clear-icon')); break
      case 'empty-state': setTerm(''); spot('chip'); after(() => setTags(['비건', '무설탕'])); break
      case 'inline-error': setEmail('hello@'); setEmailTried(true); saw('inline-error'); after(() => spot('text-field'), 50); break
      case 'fab': scroller.current?.scrollTo({ top: 900, behavior: 'smooth' }); after(() => spot('fab'), 800); break
      case 'material': case 'flat': case 'glassmorphism': case 'neumorphism': case 'brutalism': case 'dark-mode': setTheme(id); saw(id); break
      default: spot(id)
    }
  }
  const demoRef = useRef(demo)
  demoRef.current = demo

  // 사전에서 "체험관에서 보기"로 들어오면 그 UI부터 보여 줘요
  useEffect(() => {
    if (!show) return
    const t = setTimeout(() => demoRef.current(show), 350)
    return () => clearTimeout(t)
  }, [show])

  // 코치마크 위치
  const [coachRect, setCoachRect] = useState<Rect | null>(null)
  useLayoutEffect(() => {
    if (coach === null || !body.current) { setCoachRect(null); return }
    const el = body.current.querySelector(`[data-ui="${COACH[coach].ui}"]`)
    setCoachRect(el ? relRect(el, body.current) : null)
  }, [coach])

  const hh = String(Math.floor(timer / 3600)).padStart(2, '0')
  const mm = String(Math.floor((timer % 3600) / 60)).padStart(2, '0')
  const ss = String(timer % 60).padStart(2, '0')

  return (
    <div className="pg">
      {/* 도구 줄: 방금 본 UI · 사이트 스타일 · 이름표 */}
      <div className="pg-bar">
        <h1>체험관</h1>
        {log[0] ? (
          <button key={log[0]} className="pg-last" onClick={() => onOpen(log[0])}>방금 본 UI <b>{byId.get(log[0])?.ko}</b></button>
        ) : <span className="pg-hint">가상의 빵집에서 아무거나 눌러 보세요</span>}
        <span className="pg-sp" />
        <div className="pg-styles" role="radiogroup" aria-label="화면">
          {(['pc', 'mobile'] as const).map((d) => (
            <button key={d} role="radio" aria-checked={device === d} className={device === d ? 'on' : ''} onClick={() => setDevice(d)}>
              {device === d && <Check size={16} />}{d === 'pc' ? 'PC' : '모바일'}
            </button>
          ))}
        </div>
        <div className="pg-styles" role="radiogroup" aria-label="사이트 스타일">
          {THEMES.map(([t, name]) => (
            <button key={t} role="radio" aria-checked={theme === t} className={theme === t ? 'on' : ''} onClick={() => { setTheme(t); saw(t) }}>
              {theme === t && <Check size={16} />}{name}
            </button>
          ))}
        </div>
        <button className={`pg-switch-label${labels ? ' on' : ''}`} role="switch" aria-checked={labels} onClick={() => setLabels((l) => !l)}>
          <Tag size={16} />이름표<span className="pg-track"><i /></span>
        </button>
      </div>
      {device === 'mobile' && (
        <div className="pg-mobile pg-stage ss-stage">
          <div className="pg-mobile-hints"><p>해 볼 것</p>{MOBILE_HINTS.map(([id, t]) => <button key={id} onClick={() => mobile.current?.demo(id)}>{t}</button>)}</div>
          <Mobile ref={mobile} theme={theme} labels={labels} onOpen={onOpen} saw={saw} />
        </div>
      )}
      <div className="pg-stage ss-stage" hidden={device === 'mobile'}>
        <Window url="monggle-bakery.test" nav urlShape="pill" className="pg-win">
          <div className={`pg-body pg-theme--${theme}${labels ? ' pg-labels' : ''}`} ref={body}>
            <div className="pg-scroll" ref={scroller} onScroll={(e) => { setFab(e.currentTarget.scrollTop > 320); if (labels) measure() }}>
              {/* 배너 */}
              {banner && (
                <div className="pg-banner" data-ui="banner">
                  <span>첫 주문은 무료배송이에요 · 이번 주 일요일까지</span>
                  <button aria-label="배너 닫기" onClick={() => setBanner(false)}><X size={14} /></button>
                </div>
              )}

              {/* 스티키 헤더 + GNB */}
              <header className="pg-header" data-ui="sticky-header">
                <div className="pg-header-in">
                  <span className="pg-logo">몽글 베이커리</span>
                  <nav className="pg-gnb" data-ui="gnb" onMouseLeave={() => setMega(false)}>
                    <button className="pg-gnb-all" data-ui="mega-menu" onMouseEnter={() => { setMega(true); saw('mega-menu') }} onClick={() => setMega((m) => !m)}>전체 메뉴</button>
                    {CATS.map((c) => <button key={c} className={!term && cat === c ? 'on' : ''} onClick={() => { setTerm(''); setCat(c); reload() }}>{c}</button>)}
                    {mega && (
                      <div className="pg-mega">
                        {CATS.map((c) => (
                          <div key={c}>
                            <b>{c}</b>
                            {PRODUCTS.filter((p) => p.cat === c).map((p) => <button key={p.id} onClick={() => { setMega(false); search(p.name) }}>{p.name}</button>)}
                          </div>
                        ))}
                        <div className="pg-mega-note"><b>이 판의 이름은?</b><button onClick={() => onOpen('mega-menu')}>메가 메뉴 →</button></div>
                      </div>
                    )}
                  </nav>
                  <div className="pg-search" data-ui="autocomplete">
                    <Search size={15} />
                    <input value={q} placeholder="빵 이름으로 찾기" onFocus={() => setQFocus(true)} onChange={(e) => { setQ(e.target.value); setQFocus(true) }} onKeyDown={(e) => { if (e.key === 'Enter') search(q.trim()) }} aria-label="빵 찾기" />
                    {q && <button className="pg-clear" data-ui="clear-icon" aria-label="지우기" onClick={() => { setQ(''); setTerm('') }}><X size={11} /></button>}
                    {qFocus && suggestions.length > 0 && (
                      <div className="pg-suggest">
                        {suggestions.map((p) => {
                          const w = q.trim()
                          const i = p.name.indexOf(w)
                          return <button key={p.id} onMouseDown={(e) => { e.preventDefault(); search(p.name) }}>{p.name.slice(0, i)}<b>{w}</b>{p.name.slice(i + w.length)}</button>
                        })}
                      </div>
                    )}
                  </div>
                  <div className="pg-bento-wrap">
                    <button className="pg-icon" data-ui="bento" aria-label="다른 서비스" onClick={() => { setBento((b) => !b); saw('bento') }}><LayoutGrid size={17} /></button>
                    {bento && (
                      <div className="pg-popover pg-popover--bento" data-ui="popover">
                        {['몽글 카페', '빵 클래스', '정기 배송', '선물하기'].map((t) => <button key={t} onClick={() => { setBento(false); say(`${t}는 체험관에 없어요`) }}><i />{t}</button>)}
                      </div>
                    )}
                  </div>
                  <span className="pg-avatar" data-ui="avatar" title="체험 손님">몽</span>
                  <button className="pg-icon pg-cart" aria-label="장바구니" data-ui="badge" onClick={openCart}>
                    <ShoppingBag size={18} />
                    {count > 0 && <em key={count} className="pg-badge">{count}</em>}
                  </button>
                </div>
              </header>

              <main className="pg-main">
                <div className="pg-crumb" data-ui="breadcrumb">
                  <button onClick={() => { setTerm(''); setCat('빵') }}>홈</button><ChevronRight size={12} />
                  <button onClick={() => setTerm('')}>{term ? '검색' : cat}</button><ChevronRight size={12} />
                  <b>{term ? `‘${term}’` : '전체'}</b>
                </div>

                {/* 히어로 + 캐러셀 */}
                <section className="pg-hero" data-ui="hero">
                  <div className="pg-carousel" data-ui="carousel">
                    <div className="pg-slides" style={{ '--i': slide } as CSSProperties}>
                      {SLIDES.map((s, i) => (
                        <div key={i} className={`pg-slide pg-slide--${s.tone}`} aria-hidden={i !== slide}>
                          <div>
                            <small>{s.sub}</small>
                            <h2>{s.title}</h2>
                            {i === 0 && <span className="pg-timer" data-ui="false-urgency">마감까지 {hh}:{mm}:{ss}</span>}
                            {s.cta && <button className="pg-btn" tabIndex={i === slide ? 0 : -1} onClick={() => { setModal('coupon'); saw('modal') }}>{s.cta}</button>}
                          </div>
                          <span className={`pg-hero-art pg-hero-art--${s.tone}`} />
                        </div>
                      ))}
                    </div>
                    <button className="pg-arrow pg-arrow--l" aria-label="이전" onClick={() => setSlide((s) => (s + SLIDES.length - 1) % SLIDES.length)}><ChevronLeft size={18} /></button>
                    <button className="pg-arrow pg-arrow--r" aria-label="다음" onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}><ChevronRight size={18} /></button>
                    <div className="pg-dots">{SLIDES.map((_, i) => <button key={i} aria-label={`${i + 1}번째`} className={i === slide ? 'on' : ''} onClick={() => setSlide(i)} />)}</div>
                  </div>
                  <button className="pg-tour" onClick={() => { setCoach(0); saw('coachmark') }}>처음 오셨나요? 둘러보기</button>
                </section>

                {/* 탭 */}
                <div className="pg-tabs" data-ui="tabs" role="tablist">
                  {CATS.map((c) => <button key={c} role="tab" aria-selected={!term && cat === c} className={!term && cat === c ? 'on' : ''} onClick={() => { setTerm(''); setCat(c); reload() }}>{c}</button>)}
                  <span className="pg-tab-k" data-off={term ? '' : undefined} style={{ '--i': CATS.indexOf(cat) } as CSSProperties} />
                </div>

                {/* 고르기 줄: 칩 · 세그먼티드 · 슬라이더 · 툴팁 */}
                <div className="pg-tools">
                  <div className="pg-chips" data-ui="chip">
                    {TAGS.map((t) => <button key={t} className={tags.includes(t) ? 'on' : ''} onClick={() => setTags((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))}>{t}{tags.includes(t) && <X size={11} />}</button>)}
                  </div>
                  <div className="pg-seg" data-ui="segmented" style={{ '--i': sort } as CSSProperties}>
                    <span className="pg-seg-k" />
                    {SORTS.map((s, i) => <button key={s} className={sort === i ? 'on' : ''} onClick={() => setSort(i)}>{s}</button>)}
                  </div>
                  <label className="pg-slider" data-ui="slider">
                    <span>{won(maxPrice)}까지</span>
                    <input type="range" min={2000} max={35000} step={500} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} />
                  </label>
                  <span className="pg-tipwrap" data-ui="tooltip" tabIndex={0} onMouseEnter={() => saw('tooltip')}>
                    무료배송 <Info size={14} />
                    <span className={`pg-tip${tip ? ' on' : ''}`} role="tooltip">3만 원 넘게 사면 무료예요</span>
                  </span>
                </div>

                {/* 상품 카드 */}
                {loading ? (
                  <div className="pg-grid" data-ui="skeleton">
                    {[0, 1, 2, 3].map((i) => <div key={i} className="pg-card pg-sk"><i className="pg-sk-img" /><i /><i /></div>)}
                  </div>
                ) : list.length ? (
                  <div className="pg-grid">
                    {list.map((p) => (
                      <article key={p.id} className="pg-card" data-ui="card">
                        <div className={`pg-img pg-img--${p.cat}`} style={{ '--c': p.color } as CSSProperties}>
                          <button className={`pg-heart${liked.includes(p.id) ? ' on' : ''}`} data-ui="micro-interaction" aria-label="찜" aria-pressed={liked.includes(p.id)} onClick={() => like(p)}><Heart size={16} /></button>
                          <div className="pg-kebab-wrap">
                            <button className="pg-kebab" data-ui="kebab" aria-label="더보기" onClick={() => { setMenu((m) => (m === p.id ? null : p.id)); saw('popover') }}><MoreVertical size={16} /></button>
                            {menu === p.id && (
                              <div className="pg-popover" data-ui="popover">
                                <button onClick={() => { setMenu(null); say('링크를 복사했어요') }}>공유하기</button>
                                <button onClick={() => { setMenu(null); setTerm(''); setCat(p.cat); reload() }}>비슷한 빵 보기</button>
                                <button className="pg-danger" onClick={() => { setMenu(null); say('숨겼어요 (체험이라 그대로 있어요)') }}>숨기기</button>
                              </div>
                            )}
                          </div>
                          {p.tags.length > 0 && <span className="pg-tag">{p.tags.join(' · ')}</span>}
                        </div>
                        <b className="pg-name">{p.name}</b>
                        <span className="pg-rate" data-ui="rating" aria-label={`별점 ${p.rate}`}>
                          {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={12} className={n <= Math.round(p.rate) ? 'on' : ''} />)}<small>{p.rate}</small>
                        </span>
                        <div className="pg-price-row">
                          <span className="pg-price">{won(p.price)}</span>
                          <button className="pg-add" disabled={adding === p.id} onClick={() => add(p)}>
                            {adding === p.id ? <><i className="pg-spin" data-ui="spinner" />담는 중</> : '담기'}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="pg-empty" data-ui="empty-state">
                    <span><Search size={22} /></span>
                    <b>조건에 맞는 빵이 없어요</b>
                    <small>필터를 줄이거나 다른 이름으로 찾아보세요</small>
                    <button className="pg-btn pg-btn--line" onClick={() => { setTags([]); setMaxPrice(35000); setTerm(''); setQ('') }}>필터 지우기</button>
                  </div>
                )}

                <div className="pg-pages" data-ui="pagination">
                  <button aria-label="이전 쪽" onClick={() => { setPage((p) => Math.max(1, p - 1)); reload() }}><ChevronLeft size={14} /></button>
                  {[1, 2, 3].map((n) => <button key={n} className={page === n ? 'on' : ''} onClick={() => { setPage(n); reload() }}>{n}</button>)}
                  <button aria-label="다음 쪽" onClick={() => { setPage((p) => Math.min(3, p + 1)); reload() }}><ChevronRight size={14} /></button>
                </div>

                {/* 자주 묻는 질문 */}
                <section className="pg-section">
                  <h3>자주 묻는 질문</h3>
                  <div className="pg-acc" data-ui="accordion">
                    {[
                      ['언제 구워서 보내요?', '새벽 5시에 구워서 아침 9시 전에 보내요.'],
                      ['얼려 둬도 되나요?', '한 개씩 랩으로 싸서 얼리면 2주까지 괜찮아요.'],
                      ['매장에서 찾을 수 있나요?', '장바구니에서 픽업 매장과 날짜를 골라 주세요.'],
                    ].map(([t, d], i) => (
                      <div key={i} className={`pg-acc-item${faq === i ? ' open' : ''}`}>
                        <button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}>{t}<ChevronRight size={16} /></button>
                        <div className="pg-acc-body"><p>{d}</p></div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 소식 받기 폼 */}
                <section className="pg-section pg-news">
                  <div>
                    <h3>새 빵 소식 받기</h3>
                    <p>한 달에 두 번, 새로 나온 빵만 알려 드려요.</p>
                  </div>
                  <form className="pg-form" noValidate onSubmit={(e) => { e.preventDefault(); setEmailTried(true); if (EMAIL.test(email) && agree) { setModal('thanks'); saw('modal') } else saw('inline-error') }}>
                    <label className="pg-field" data-ui="text-field">
                      <span>이메일</span>
                      <input value={email} placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} className={emailBad ? 'bad' : ''} aria-invalid={emailBad} />
                      {emailBad && <small className="pg-err" data-ui="inline-error">이메일 형식이 맞지 않아요 (예: name@example.com)</small>}
                      {emailTried && !agree && !emailBad && <small className="pg-err" data-ui="inline-error">필수 동의에 체크해 주세요</small>}
                    </label>
                    <label className="pg-check" data-ui="checkbox"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> (필수) 개인정보 수집에 동의해요</label>
                    <label className="pg-check" data-ui="preselection"><input type="checkbox" checked={ads} onChange={(e) => setAds(e.target.checked)} /> (선택) 광고 문자도 받을래요</label>
                    <label className="pg-switch" data-ui="toggle">
                      <span>새 빵 알림 바로 받기</span>
                      <input type="checkbox" role="switch" checked={notify} onChange={(e) => { setNotify(e.target.checked); say(e.target.checked ? '알림을 켰어요' : '알림을 껐어요') }} />
                    </label>
                    <button className="pg-btn" type="submit">구독하기</button>
                  </form>
                </section>
                <footer className="pg-foot">몽글 베이커리는 UI Drawer 체험관을 위한 가상의 가게예요. 실제로 주문 · 결제되지 않아요.</footer>
              </main>
            </div>

            {/* 플로팅 버튼 */}
            <button className={`pg-fab${fab ? ' on' : ''}`} data-ui="fab" data-hidden={fab ? undefined : ''} aria-label="맨 위로" tabIndex={fab ? 0 : -1} onClick={top}><ArrowUp size={18} /></button>

            {/* 장바구니 드로어 */}
            <div className={`pg-scrim${cartOpen ? ' on' : ''}`} onClick={() => setCartOpen(false)} />
            <aside className={`pg-drawer${cartOpen ? ' on' : ''}`} data-ui="drawer" data-hidden={cartOpen ? undefined : ''} aria-hidden={!cartOpen}>
              <div className="pg-drawer-head"><b>장바구니</b><button className="pg-icon" aria-label="닫기" onClick={() => setCartOpen(false)}><X size={18} /></button></div>
              {cart.length ? (
                <>
                  <div className="pg-free" data-ui="progress">
                    <small>{total >= FREE ? '무료배송이에요!' : <>무료배송까지 <b>{won(FREE - total)}</b></>}</small>
                    <span><i style={{ width: `${Math.min(100, (total / FREE) * 100)}%` }} /></span>
                  </div>
                  <ul className="pg-lines">
                    {cart.map((c) => {
                      const p = PRODUCTS.find((x) => x.id === c.id)!
                      return (
                        <li key={c.id}>
                          <i className={`pg-thumb pg-img--${p.cat}`} style={{ '--c': p.color } as CSSProperties} />
                          <div><b>{p.name}</b><small>{won(p.price * c.qty)}</small></div>
                          <span className="pg-stepper" data-ui="stepper">
                            <button aria-label="하나 빼기" disabled={c.qty <= 1} onClick={() => setCart((x) => x.map((y) => (y.id === c.id ? { ...y, qty: y.qty - 1 } : y)))}><Minus size={13} /></button>
                            <span>{c.qty}</span>
                            <button aria-label="하나 더" onClick={() => setCart((x) => x.map((y) => (y.id === c.id ? { ...y, qty: y.qty + 1 } : y)))}><Plus size={13} /></button>
                          </span>
                          <button className="pg-icon" aria-label="빼기" onClick={() => remove(c.id)}><Trash2 size={15} /></button>
                        </li>
                      )
                    })}
                  </ul>
                  <div className="pg-opts">
                    <label className="pg-field" data-ui="select"><span>픽업 매장</span>
                      <select value={store} onChange={(e) => setStore(e.target.value)}>{['성수점', '합정점', '강남점', '판교점'].map((s) => <option key={s}>{s}</option>)}</select>
                    </label>
                    <label className="pg-field" data-ui="date-picker"><span>픽업 날짜</span>
                      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </label>
                    <fieldset className="pg-radios" data-ui="radio"><legend>포장</legend>
                      {['종이 봉투', '선물 상자', '포장 없이'].map((t) => <label key={t}><input type="radio" name="pack" checked={pack === t} onChange={() => setPack(t)} />{t}</label>)}
                    </fieldset>
                  </div>
                  <div className="pg-drawer-foot">
                    <span>합계 <b>{won(total)}</b></span>
                    <button className="pg-btn" onClick={() => { setAlertOpen(true); saw('alert') }}>주문하기</button>
                  </div>
                </>
              ) : (
                <div className="pg-empty pg-empty--sm" data-ui="empty-state">
                  <span><ShoppingBag size={20} /></span>
                  <b>장바구니가 비었어요</b>
                  <button className="pg-btn pg-btn--line" onClick={() => setCartOpen(false)}>빵 고르러 가기</button>
                </div>
              )}
            </aside>

            {/* 모달 · 얼럿 */}
            {(modal || alertOpen) && <div className="pg-dim" onClick={() => { setModal(null); setAlertOpen(false) }} />}
            {modal === 'coupon' && (
              <div className="pg-modal" role="dialog" aria-modal="true" data-ui="modal">
                <button className="pg-icon pg-modal-x" aria-label="닫기" onClick={() => setModal(null)}><X size={16} /></button>
                <span className="pg-coupon">10%</span>
                <h4>회원 쿠폰을 받을까요?</h4>
                <p>오늘 담은 빵에 바로 쓸 수 있어요.</p>
                <button className="pg-btn pg-btn--wide" onClick={() => { setModal(null); say('쿠폰을 받았어요') }}>받을래요</button>
                <button className="pg-shame" data-ui="confirmshaming" onClick={() => setModal(null)}>아니요, 저는 할인이 싫어요</button>
              </div>
            )}
            {modal === 'thanks' && (
              <div className="pg-modal" role="dialog" aria-modal="true" data-ui="modal">
                <h4>구독해 주셔서 고마워요</h4>
                <p>{email}{ads ? ' · 광고 문자도 받기로 되어 있어요. 미리 체크된 것, 눈치채셨나요?' : ''}</p>
                <button className="pg-btn pg-btn--wide" onClick={() => setModal(null)}>확인</button>
              </div>
            )}
            {alertOpen && (
              <div className="pg-modal pg-modal--alert" role="alertdialog" aria-modal="true" data-ui="alert">
                <h4>{won(total)}을 주문할까요?</h4>
                <p>체험관이라 진짜 주문은 되지 않아요.</p>
                <div className="pg-row"><button className="pg-btn pg-btn--line" onClick={() => setAlertOpen(false)}>취소</button><button className="pg-btn" onClick={() => { setAlertOpen(false); setCartOpen(false); setCart([]); say('주문했어요 (체험이에요)') }}>주문하기</button></div>
              </div>
            )}

            {/* 토스트 · 스낵바 */}
            <div className="pg-toasts">
              {toast && <div key={toast.k} className="pg-toast" data-ui="toast" role="status">{toast.msg}</div>}
              {snack && <div key={snack.k} className="pg-toast pg-snack" data-ui="snackbar" role="status">{snack.msg}<button onClick={undo}>실행 취소</button></div>}
            </div>

            {/* 코치마크 */}
            {coach !== null && coachRect && (
              <div className="pg-coach" data-ui="coachmark">
                <span className="pg-coach-hole" style={{ left: coachRect.x - 6, top: coachRect.y - 6, width: coachRect.w + 12, height: coachRect.h + 12 }} />
                <div className="pg-coach-tip" style={{ left: Math.min(coachRect.x, (body.current?.clientWidth ?? 800) - 300), top: coachRect.y + coachRect.h + 16 }}>
                  <b>{COACH[coach].text}</b>
                  <div className="pg-row"><small>{coach + 1} / {COACH.length}</small><span className="pg-sp" /><button className="pg-btn pg-btn--line" onClick={() => setCoach(null)}>그만 보기</button><button className="pg-btn" onClick={() => setCoach(coach + 1 < COACH.length ? coach + 1 : null)}>{coach + 1 < COACH.length ? '다음' : '끝'}</button></div>
                </div>
              </div>
            )}

            {overlay}
          </div>
        </Window>
      </div>

    </div>
  )
}
