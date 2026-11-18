// 체험관 사이트 9: 배달 ‘몽글 배달’. 요소마다 data-ui="사전 id" 가 달려 있어 이름표가 붙어요.
// 지도에서 가게 묶음 → 가게 핀 → 받을 곳 고르기 → 배달 단계 → 리뷰 키워드.
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { MapPin } from 'lucide-react'
import type { SiteHandle } from './Community'
import './sites.css'

const STORES: [string, number, number][] = [['몽글 베이커리', 30, 38], ['크림빵 공방', 62, 30], ['식빵 연구소', 48, 64]]
const STEPS = ['주문 받음', '굽는 중', '배달 중', '도착']
const TAGS: [string, number][] = [['빵이 따뜻해요', 82], ['포장이 꼼꼼해요', 64], ['양이 많아요', 41]]

export const Delivery = forwardRef<SiteHandle, { saw: (id: string) => void }>(function Delivery({ saw }, ref) {
  const [zoom, setZoom] = useState(false)
  const [store, setStore] = useState<number | null>(null)
  const [spot, setSpot] = useState({ x: 50, y: 50 })
  const [step, setStep] = useState(-1)
  useEffect(() => { if (step < 0 || step >= 3) return; const t = setTimeout(() => setStep((s) => s + 1), 1800); return () => clearTimeout(t) }, [step])

  useImperativeHandle(ref, () => ({
    demo(id) {
      switch (id) {
        case 'map-cluster': setZoom(false); setStore(null); break
        case 'map-pin': setZoom(true); setStore(0); break
        case 'location-picker': setSpot({ x: 66, y: 58 }); break
        case 'order-tracker': setStep(0); break
      }
      saw(id)
    },
  }))

  return (
    <div className="site dv">
      <header className="site-bar"><b className="site-logo">몽글 배달</b><small>빵 30분 배달</small></header>
      <div className="site-scroll dv-body">
        <section className="dv-map" aria-label="가게 지도">
          {!zoom ? (
            <button className="dv-cluster" data-ui="map-cluster" style={{ left: '46%', top: '44%' }} onClick={() => { setZoom(true); saw('map-cluster') }}>{STORES.length}<small>곳</small></button>
          ) : STORES.map(([n, x, y], i) => (
            <button key={n} className={`dv-pin${store === i ? ' on' : ''}`} data-ui={i === 0 ? 'map-pin' : undefined} style={{ left: `${x}%`, top: `${y}%` }} onClick={() => { setStore(i); saw('map-pin') }} aria-label={n}><MapPin size={22} /></button>
          ))}
          {zoom && store !== null && <div className="dv-card"><b>{STORES[store][0]}</b><small>배달 25~35분 · 최소 12,000원</small></div>}
          {zoom && <button className="dv-back site-btn site-btn--line" onClick={() => { setZoom(false); setStore(null) }}>전체 보기</button>}
        </section>

        <section className="dv-sec" data-ui="location-picker">
          <div data-h="3">받을 곳</div>
          <div className="dv-pick" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setSpot({ x: Math.round(((e.clientX - r.left) / r.width) * 100), y: Math.round(((e.clientY - r.top) / r.height) * 100) }); saw('location-picker') }}>
            <span className="dv-pick-pin" style={{ left: `${spot.x}%`, top: `${spot.y}%` }}><MapPin size={26} /></span>
          </div>
          <small>지도를 눌러 문 앞 위치를 정확히 찍어요 · 몽글로 {12 + Math.round(spot.x / 10)}길 {spot.y}</small>
        </section>

        <section className="dv-sec">
          <button className="site-btn" onClick={() => { setStep(0); saw('order-tracker') }} disabled={step >= 0 && step < 3}>{step >= 3 ? '다시 주문하기' : step >= 0 ? '배달 중…' : '주문하기'}</button>
          <ol className="dv-steps" data-ui="order-tracker">{STEPS.map((t, i) => <li key={t} data-done={i <= step || undefined} data-now={i === step || undefined}>{t}</li>)}</ol>
        </section>

        <section className="dv-sec" data-ui="review-tags">
          <div data-h="3">리뷰에서 많이 말한 것</div>
          {TAGS.map(([t, n]) => <div key={t} className="dv-tag"><span>{t}</span><i style={{ width: `${n}%` }} /><b>{n}</b></div>)}
        </section>
      </div>
    </div>
  )
})
