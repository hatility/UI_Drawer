// 체험관 사이트 12: 길 찾기 ‘몽글 지도’. 요소마다 data-ui="사전 id" 가 달려 있어 이름표가 붙어요.
// 위치 묻기(정확 · 대략) → 내 위치 버튼 → 혼잡도 지역 색 → 미니맵 → 단계별 진행.
import { forwardRef, useImperativeHandle, useState } from 'react'
import { LocateFixed } from 'lucide-react'
import type { SiteHandle } from './Community'
import './sites.css'

const STEPS = ['집에서 출발', '몽글 사거리', '빵집 골목', '도착']
const AREAS: [string, number][] = [['북쪽', 0.2], ['가운데', 0.8], ['남쪽', 0.5], ['동쪽', 0.35]]

export const RouteMap = forwardRef<SiteHandle, { saw: (id: string) => void }>(function RouteMap({ saw }, ref) {
  const [ask, setAsk] = useState(true)
  const [precise, setPrecise] = useState<boolean | null>(null)
  const [me, setMe] = useState(false)
  const [heat, setHeat] = useState(false)
  const [step, setStep] = useState(1)

  useImperativeHandle(ref, () => ({
    demo(id) {
      switch (id) {
        case 'location-precision': setAsk(true); break
        case 'location-icon': setAsk(false); setMe(true); break
        case 'choropleth': setAsk(false); setHeat(true); break
        case 'minimap': setAsk(false); break
        case 'segmented-progress': setAsk(false); setStep(2); break
      }
      saw(id)
    },
  }))

  return (
    <div className="site rm">
      <header className="site-bar"><b className="site-logo">몽글 지도</b><small>빵집까지 걸어서 12분</small></header>
      <div className="rm-map" data-heat={heat || undefined}>
        <div className="rm-areas" data-ui="choropleth" aria-label="지역별 혼잡도">{AREAS.map(([n, v]) => <i key={n} style={{ ['--v' as string]: v }} title={`${n} 혼잡도 ${Math.round(v * 100)}%`} />)}</div>
        <svg className="rm-route" viewBox="0 0 400 260" aria-hidden="true"><path d="M60 220 C 120 200, 140 140, 200 130 S 300 80, 340 40" /></svg>
        {me && <span className="rm-me" aria-label="내 위치" />}
        <button className="rm-btn rm-heat" onClick={() => { setHeat(!heat); saw('choropleth') }} aria-pressed={heat}>혼잡도</button>
        <button className="rm-btn rm-loc" data-ui="location-icon" aria-label="내 위치로" onClick={() => { setMe(true); saw('location-icon') }}><LocateFixed size={20} /></button>
        <div className="rm-mini" data-ui="minimap" aria-label="전체 지도"><i /><b /></div>
        {ask && (
          <div className="rm-ask" data-ui="location-precision" role="dialog" aria-label="위치 권한">
            <b>‘몽글 지도’가 위치를 써도 될까요?</b>
            <div className="rm-prec">
              <button className={precise === true ? 'on' : ''} onClick={() => { setPrecise(true); saw('location-precision') }}><span className="dot sm" />정확한 위치</button>
              <button className={precise === false ? 'on' : ''} onClick={() => { setPrecise(false); saw('location-precision') }}><span className="dot lg" />대략 위치</button>
            </div>
            <div className="rm-ask-act"><button className="site-btn site-btn--line" onClick={() => setAsk(false)}>허용 안 함</button><button className="site-btn" onClick={() => { setAsk(false); setMe(true) }}>앱을 쓰는 동안 허용</button></div>
          </div>
        )}
      </div>
      <div className="rm-steps" data-ui="segmented-progress">
        <div className="rm-bar" role="progressbar" aria-label="길 안내 진행" aria-valuemin={0} aria-valuemax={STEPS.length - 1} aria-valuenow={step}>{STEPS.slice(1).map((s, i) => <i key={s} data-on={i < step || undefined} />)}</div>
        <div className="rm-now"><b>{STEPS[Math.min(step + 1, STEPS.length - 1)]}</b>까지 가는 중<button className="site-btn site-btn--line" onClick={() => { setStep((n) => (n + 1) % STEPS.length); saw('segmented-progress') }}>다음 안내</button></div>
      </div>
    </div>
  )
})
