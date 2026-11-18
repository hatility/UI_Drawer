// 체험관 사이트 10: 음악 ‘몽글 뮤직’. 요소마다 data-ui="사전 id" 가 달려 있어 이름표가 붙어요.
// 흐르는 곡 제목 → 재생 막대 끌어 옮기기 → 소리 끄기 → 다음 곡 순서 바꾸기.
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import type { SiteHandle } from './Community'
import './sites.css'

const LEN = 214

export const Music = forwardRef<SiteHandle, { saw: (id: string) => void }>(function Music({ saw }, ref) {
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(48)
  const [mute, setMute] = useState(false)
  const [queue, setQueue] = useState(['아침 식빵 왈츠', '버터 녹는 오후', '크루아상 결 하나하나', '밤의 소금빵'])
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => { if (!playing) return; const i = setInterval(() => setT((x) => (x + 1) % LEN), 1000); return () => clearInterval(i) }, [playing])
  const mm = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const seek = (x: number) => { const r = bar.current!.getBoundingClientRect(); setT(Math.round(Math.min(1, Math.max(0, (x - r.left) / r.width)) * LEN)) }
  const move = (i: number, d: number) => { const j = i + d; if (j < 0 || j >= queue.length) return; const q = [...queue]; [q[i], q[j]] = [q[j], q[i]]; setQueue(q); saw('reorder-list') }

  useImperativeHandle(ref, () => ({
    demo(id) {
      switch (id) {
        case 'audio-player': setPlaying(true); break
        case 'scrubbing': setT(150); break
        case 'sound-toggle': setMute(true); break
        case 'reorder-list': move(2, -1); return
      }
      saw(id)
    },
  }))

  return (
    <div className="site mu">
      <header className="site-bar"><b className="site-logo">몽글 뮤직</b><small>지금 듣는 곡</small></header>
      <div className="site-scroll mu-body">
        <div className="mu-art" aria-hidden="true" />
        <div className="mu-title" data-ui="marquee"><span>빵 굽는 새벽의 노래 — 몽글 밴드 · 2026 겨울 앨범 수록곡</span></div>
        <div className="mu-player" data-ui="audio-player">
          <button className="mu-play" aria-label={playing ? '일시정지' : '재생'} onClick={() => { setPlaying(!playing); saw('audio-player') }}>{playing ? <Pause size={22} /> : <Play size={22} />}</button>
          <div className="mu-bar" ref={bar} data-ui="scrubbing" role="slider" aria-label="재생 위치" aria-valuemin={0} aria-valuemax={LEN} aria-valuenow={t} aria-valuetext={mm(t)} tabIndex={0}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); seek(e.clientX); saw('scrubbing') }}
            onPointerMove={(e) => { if (e.buttons) seek(e.clientX) }}
            onKeyDown={(e) => { if (e.key === 'ArrowRight') setT((x) => Math.min(LEN, x + 5)); if (e.key === 'ArrowLeft') setT((x) => Math.max(0, x - 5)) }}>
            <i style={{ width: `${(t / LEN) * 100}%` }} /><b style={{ left: `${(t / LEN) * 100}%` }} />
          </div>
          <small className="mu-time">{mm(t)} / {mm(LEN)}</small>
          <button className="site-icon" data-ui="sound-toggle" aria-label={mute ? '소리 켜기' : '소리 끄기'} aria-pressed={mute} onClick={() => { setMute(!mute); saw('sound-toggle') }}>{mute ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
        </div>
        <section className="mu-queue" data-ui="reorder-list">
          <div data-h="3">다음 곡</div>
          <ol>{queue.map((q, i) => <li key={q}><span>{q}</span><button className="site-icon" aria-label={`${q} 위로`} disabled={!i} onClick={() => move(i, -1)}><ArrowUp size={16} /></button><button className="site-icon" aria-label={`${q} 아래로`} disabled={i === queue.length - 1} onClick={() => move(i, 1)}><ArrowDown size={16} /></button></li>)}</ol>
        </section>
      </div>
    </div>
  )
})
