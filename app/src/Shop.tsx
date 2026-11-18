// 체험관 사이트 5: 쇼핑 결제 ‘몽글마켓’. 요소마다 data-ui="사전 id" 가 달려 있어 이름표가 붙어요.
// 상품 고르기 → 옵션 시트 → 장바구니 → 쿠폰 · 배송지 · 결제 수단 → 결제 요약 → 주문 완료
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Bell, Check, Heart, X } from 'lucide-react'
import type { SiteHandle } from './Community'
import './sites.css'

type Item = { id: number; name: string; price: number; size: string; qty: number; on: boolean }
const PRODUCTS: [string, number, number][] = [['버터 소금빵', 3500, 20], ['통밀 식빵', 5200, 0], ['초코 스콘', 3800, 10]]
const won = (n: number) => `${n.toLocaleString('ko-KR')}원`
const sale = (p: number, d: number) => Math.round((p * (100 - d)) / 1000) * 10
const COUPON = 'MONGLE3000'

export const Shop = forwardRef<SiteHandle, { saw: (id: string) => void }>(function Shop({ saw }, ref) {
  const [left, setLeft] = useState(2 * 3600 + 14 * 60 + 9)
  const [sheet, setSheet] = useState<number | null>(null)
  const [size, setSize] = useState('M')
  const [qty, setQty] = useState(1)
  const [cart, setCart] = useState<Item[]>([{ id: 1, name: '통밀 식빵', price: 5200, size: 'L', qty: 1, on: true }])
  const [code, setCode] = useState('')
  const [couponOk, setCouponOk] = useState<boolean | null>(null)
  const [pay, setPay] = useState('카드')
  const [card, setCard] = useState('')
  const [alarm, setAlarm] = useState(false)
  const [done, setDone] = useState(false)
  useEffect(() => { const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000); return () => clearInterval(t) }, [])

  const picked = cart.filter((c) => c.on)
  const goods = picked.reduce((n, c) => n + c.price * c.qty, 0)
  const ship = goods >= 15000 || !goods ? 0 : 3000
  const disc = couponOk ? Math.min(3000, goods) : 0
  const total = goods + ship - disc
  const all = cart.length > 0 && cart.every((c) => c.on), some = cart.some((c) => c.on)
  const cardFmt = card.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')

  const add = (i: number) => {
    const [name, price, d] = PRODUCTS[i]
    setCart((c) => [...c, { id: Date.now(), name, price: sale(price, d), size, qty, on: true }])
    setSheet(null); setQty(1); saw('cart-item')
  }
  const apply = () => { const ok = code.trim().toUpperCase() === COUPON; setCouponOk(ok); saw('coupon-code') }

  useImperativeHandle(ref, () => ({
    demo(id) {
      setDone(false)
      switch (id) {
        case 'option-sheet': case 'size-selector': setSheet(0); saw(id); break
        case 'coupon-code': setCode(COUPON); setCouponOk(true); saw(id); break
        case 'card-number-input': setPay('카드'); setCard('4321567890121234'); saw(id); break
        case 'price-drop-alert': setAlarm(true); saw(id); break
        case 'cashback': setPay('간편결제'); saw(id); break
        case 'indeterminate-checkbox': setCart((c) => (c.length > 1 ? c.map((x, i) => ({ ...x, on: i === 0 })) : [...c.map((x) => ({ ...x, on: true })), { id: 2, name: '버터 소금빵', price: 2800, size: 'M', qty: 2, on: false }])); saw(id); break
        default: saw(id)
      }
    },
  }))

  return (
    <div className="site sh">
      <header className="site-bar"><b className="site-logo">몽글마켓</b><span className="sh-cart">장바구니 {cart.length}</span></header>
      <div className="site-scroll sh-body">
        <section className="sh-list">
          <div className="sh-flash" data-ui="flash-sale">⚡ 타임 세일 <b>{String(Math.floor(left / 3600)).padStart(2, '0')}:{String(Math.floor(left / 60) % 60).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}</b></div>
          <div className="sh-products">
            {PRODUCTS.map(([n, p, d], i) => (
              <article key={n} className="sh-prod" data-ui={i === 0 ? 'product-card' : undefined}>
                <i className="sh-img" />
                <b>{n}</b>
                <span>{d ? <><em>{d}%</em> {won(sale(p, d))} <s>{won(p)}</s></> : won(p)}</span>
                <button className="site-btn" onClick={() => { setSheet(i); saw('option-sheet') }}>담기</button>
              </article>
            ))}
          </div>
          <button className={`sh-alarm${alarm ? ' on' : ''}`} data-ui="price-drop-alert" onClick={() => { setAlarm((a) => !a); saw('price-drop-alert') }}><Bell size={14} />{alarm ? '가격이 내려가면 알려 드릴게요' : '통밀 식빵 가격 내리면 알림 받기'}</button>
        </section>

        <section className="sh-cartbox">
          <div data-h="3">장바구니</div>
          <label className="sh-all"><span className={`sh-cb${all ? ' on' : some ? ' mid' : ''}`} data-ui="indeterminate-checkbox">{all ? <Check size={12} /> : some ? '−' : ''}</span>
            <input type="checkbox" checked={all} onChange={() => setCart((c) => c.map((x) => ({ ...x, on: !all })))} aria-label="전체 선택" />전체 선택 ({picked.length}/{cart.length})</label>
          {cart.map((c) => (
            <div key={c.id} className="sh-row" data-ui="cart-item">
              <label className={`sh-cb${c.on ? ' on' : ''}`}><input type="checkbox" checked={c.on} onChange={() => setCart((x) => x.map((y) => (y.id === c.id ? { ...y, on: !y.on } : y)))} aria-label={`${c.name} 고르기`} />{c.on && <Check size={12} />}</label>
              <i className="sh-img sm" />
              <span className="sh-row-t"><b>{c.name}</b><small>사이즈 {c.size} · {won(c.price)}</small></span>
              <span className="sh-qty" data-ui="stepper"><button aria-label="하나 빼기" disabled={c.qty <= 1} onClick={() => setCart((x) => x.map((y) => (y.id === c.id ? { ...y, qty: y.qty - 1 } : y)))}>−</button>{c.qty}<button aria-label="하나 더" onClick={() => setCart((x) => x.map((y) => (y.id === c.id ? { ...y, qty: y.qty + 1 } : y)))}>+</button></span>
              <button className="site-icon" aria-label={`${c.name} 빼기`} onClick={() => setCart((x) => x.filter((y) => y.id !== c.id))}><X size={16} /></button>
            </div>
          ))}
          {!cart.length && <p className="sh-empty">장바구니가 비었어요</p>}

          <div className="sh-coupon" data-ui="coupon-code">
            <input value={code} onChange={(e) => { setCode(e.target.value); setCouponOk(null) }} placeholder={`쿠폰 코드 (예: ${COUPON})`} aria-label="쿠폰 코드" />
            <button className="site-btn site-btn--line" onClick={apply}>적용</button>
            {couponOk !== null && <small className={couponOk ? 'ok' : 'err'}>{couponOk ? '✓ 3,000원 할인됐어요' : '쓸 수 없는 코드예요'}</small>}
          </div>

          <div className="sh-addr" data-ui="address-card"><span><b>집</b><em>기본 배송지</em></span><small>서울 성동구 성수이로 12, 3층</small></div>

          <div className="sh-pay" role="radiogroup" aria-label="결제 수단" data-ui="payment-widget">
            {['카드', '간편결제', '계좌이체'].map((p) => <button key={p} role="radio" aria-checked={pay === p} className={pay === p ? 'on' : ''} onClick={() => { setPay(p); saw('payment-widget') }}>{p}</button>)}
          </div>
          {pay === '카드' && <input className="sh-card" data-ui="card-number-input" inputMode="numeric" value={cardFmt} onChange={(e) => setCard(e.target.value)} placeholder="카드 번호 16자리" aria-label="카드 번호" />}

          <div className="sh-sum" data-ui="order-summary">
            <span>상품 금액<b>{won(goods)}</b></span>
            <span>배송비<b>{ship ? won(ship) : '무료'}</b></span>
            {disc > 0 && <span className="disc">쿠폰 할인<b>−{won(disc)}</b></span>}
            <span className="tot">합계<b>{won(total)}</b></span>
            <small data-ui="reward-points">적립 예정 +{Math.round(total * 0.01).toLocaleString()}P</small>
            {pay === '간편결제' && <small className="cb" data-ui="cashback">💸 간편결제로 {won(Math.round(total * 0.05 / 10) * 10)} 돌려받아요</small>}
          </div>
          <button className="site-btn site-btn--wide" disabled={!picked.length} onClick={() => { setDone(true); saw('success-state') }}>{won(total)} 결제하기</button>
          {done && <p className="sh-done" role="status"><Heart size={14} /> 주문했어요! (체험이라 실제 결제는 없어요)</p>}
        </section>
      </div>

      {sheet !== null && (
        <>
          <div className="sh-scrim" onClick={() => setSheet(null)} />
          <div className="sh-sheet" role="dialog" aria-label="옵션 고르기" data-ui="option-sheet">
            <span className="sh-grab" />
            <b>{PRODUCTS[sheet][0]}</b>
            <div className="sh-sizes" role="radiogroup" aria-label="사이즈" data-ui="size-selector">
              {['S', 'M', 'L', 'XL'].map((s) => <button key={s} role="radio" aria-checked={size === s} disabled={s === 'XL'} className={size === s ? 'on' : ''} onClick={() => { setSize(s); saw('size-selector') }}>{s}</button>)}
            </div>
            <div className="sh-sheet-row"><span className="sh-qty"><button aria-label="하나 빼기" disabled={qty <= 1} onClick={() => setQty(qty - 1)}>−</button>{qty}<button aria-label="하나 더" onClick={() => setQty(qty + 1)}>+</button></span><b>{won(sale(PRODUCTS[sheet][1], PRODUCTS[sheet][2]) * qty)}</b></div>
            <button className="site-btn site-btn--wide" onClick={() => add(sheet)}>장바구니 담기</button>
          </div>
        </>
      )}
    </div>
  )
})
