// 체험관 사이트 4: 메신저 ‘몽글톡’. 요소마다 data-ui="사전 id" 가 달려 있어 이름표가 붙어요.
// 보내면 안 읽음 숫자가 줄고 → 상대가 입력 중 → 답장이 와요. 말풍선을 옆으로 밀면 답장 상태가 돼요.
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type PointerEvent as PE } from 'react'
import { Pin, Play, Pause, Send, X } from 'lucide-react'
import type { SiteHandle } from './Community'
import './sites.css'

type Msg = { id: number; me: boolean; who?: string; text: string; unread?: number; reply?: string; kind?: 'voice' | 'link' }
const CHATS: [string, string, number, boolean][] = [['빵 모임', '#8f4c38', 3, true], ['하늘', '#3e7bfa', 0, false], ['지민', '#22a06b', 1, false], ['몽글 베이커리', '#e6a23c', 0, false]]
const START: Msg[] = [
  { id: 1, me: false, who: '하늘', text: '내일 성수점 몇 시에 만나?' },
  { id: 2, me: true, text: '2시 어때요?', unread: 0 },
  { id: 3, me: false, who: '지민', text: 'mongle.shop/bread', kind: 'link' },
  { id: 4, me: false, who: '하늘', text: '0:12', kind: 'voice' },
]
const NEW: Msg[] = [{ id: 5, me: false, who: '지민', text: '저 조금 늦을 것 같아요' }, { id: 6, me: false, who: '하늘', text: '소금빵 미리 사 둘게요!' }]
const SMART = ['좋아요!', '천천히 와요', '저도 갈게요']

export const Messenger = forwardRef<SiteHandle, { saw: (id: string) => void }>(function Messenger({ saw }, ref) {
  const [msgs, setMsgs] = useState<Msg[]>(START)
  const [fresh, setFresh] = useState(true)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [replyTo, setReplyTo] = useState<Msg | null>(null)
  const [pinned, setPinned] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [drag, setDrag] = useState<{ id: number; x: number } | null>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => { scroll.current?.scrollTo({ top: 9999, behavior: 'smooth' }) }, [msgs.length, typing])
  useEffect(() => { if (!playing) return; const t = setTimeout(() => setPlaying(false), 3000); return () => clearTimeout(t) }, [playing])

  const send = (text: string) => {
    if (!text.trim()) return
    const id = Date.now()
    setMsgs((m) => [...m, { id, me: true, text: text.trim(), unread: 2, reply: replyTo?.text }])
    setDraft(''); setReplyTo(null); saw('chat-bubble')
    // 한 명씩 읽으면 숫자가 줄고, 다 읽으면 사라져요 → 상대가 입력 중 → 답장
    later(() => { setMsgs((m) => m.map((x) => (x.id === id ? { ...x, unread: 1 } : x))); saw('read-receipt') }, 900)
    later(() => { setMsgs((m) => m.map((x) => (x.id === id ? { ...x, unread: 0 } : x))); setTyping(true); saw('typing-indicator') }, 1800)
    later(() => { setTyping(false); setMsgs((m) => [...m, { id: id + 1, me: false, who: '하늘', text: '좋아요, 거기서 봐요!' }]) }, 3400)
  }
  // 밀어서 답장: 말풍선을 오른쪽으로 56px 넘게 밀면 답장 상태가 돼요
  const down = (m: Msg) => (e: PE) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); setDrag({ id: m.id, x: e.clientX }) }
  const move = (e: PE) => { if (drag) (e.currentTarget as HTMLElement).style.setProperty('--dx', `${Math.max(0, Math.min(72, e.clientX - drag.x))}px`) }
  const up = (m: Msg) => (e: PE) => {
    const dx = drag ? e.clientX - drag.x : 0
    ;(e.currentTarget as HTMLElement).style.setProperty('--dx', '0px')
    setDrag(null)
    if (dx > 56) { setReplyTo(m); saw('swipe-to-reply') }
  }

  useImperativeHandle(ref, () => ({
    demo(id) {
      switch (id) {
        case 'chat-bubble': case 'read-receipt': case 'typing-indicator': send('내일 봬요!'); break
        case 'smart-reply': setDraft(''); saw('smart-reply'); break
        case 'swipe-to-reply': setReplyTo(START[0]); saw('swipe-to-reply'); break
        case 'pinned-message': setPinned(true); saw('pinned-message'); break
        case 'unread-divider': setFresh(true); setMsgs((m) => (m.some((x) => x.id === 5) ? m : [...m, ...NEW])); saw('unread-divider'); break
        case 'audio-waveform': setPlaying(true); saw('audio-waveform'); break
        default: saw(id)
      }
    },
  }))

  return (
    <div className="site mg">
      <aside className="mg-list" data-ui="list-item">
        <b className="mg-title">채팅</b>
        {CHATS.map(([n, c, unread, pin], i) => (
          <button key={n} className={`mg-chat${i === 0 ? ' on' : ''}`}>
            <span className="site-avatar" style={{ background: c }}>{n[0]}</span>
            <span className="mg-chat-t"><b>{n}{pin && <Pin size={12} className="mg-pin" data-ui="pin-icon" aria-label="고정한 채팅" />}</b><small>{i === 0 ? '소금빵 미리 사 둘게요!' : '어제 고마웠어요'}</small></span>
            {unread > 0 && <em className="mg-unread" data-ui={i === 0 ? 'badge' : undefined}>{unread}</em>}
          </button>
        ))}
      </aside>
      <section className="mg-room">
        <header className="site-bar mg-bar">
          <b className="site-logo">빵 모임 <small>4명</small></b>
          <span className="mg-faces" data-ui="avatar-group">{CHATS.slice(1).map(([n, c]) => <i key={n} style={{ background: c }}>{n[0]}</i>)}</span>
        </header>
        {pinned && (
          <div className="mg-pinned" data-ui="pinned-message"><Pin size={14} /><span><b>공지</b> 토요일 2시 성수점에서 모여요</span><button aria-label="공지 접기" onClick={() => setPinned(false)}><X size={14} /></button></div>
        )}
        <div className="mg-scroll" ref={scroll}>
          <p className="mg-date" data-ui="date-divider"><span>11월 17일 월요일</span></p>
          <p className="mg-sys" data-ui="system-message">지민님이 들어왔어요</p>
          {msgs.map((m, i) => (
            <div key={m.id}>
              {fresh && m.id === 5 && <p className="mg-new" data-ui="unread-divider"><span>여기부터 새 메시지</span></p>}
              <div className={`mg-row${m.me ? ' me' : ''}`}>
                {!m.me && (i === 0 || msgs[i - 1].who !== m.who) && <span className="site-avatar site-avatar--sm" style={{ background: CHATS.find(([n]) => n === m.who)?.[1] }}>{m.who![0]}</span>}
                <div className="mg-col">
                  {!m.me && (i === 0 || msgs[i - 1].who !== m.who) && <small className="mg-who">{m.who}</small>}
                  <div className="mg-line" data-ui={!m.me && i === 0 ? 'swipe-to-reply' : undefined}>
                    {m.me && m.unread! > 0 && <em className="mg-rr" data-ui="read-receipt">{m.unread}</em>}
                    <div className="mg-bubble" data-ui={m.kind === 'voice' ? 'audio-waveform' : m.kind === 'link' ? 'link-preview' : 'chat-bubble'}
                      onPointerDown={down(m)} onPointerMove={move} onPointerUp={up(m)} onPointerCancel={up(m)}>
                      {m.reply && <span className="mg-quote" data-ui="reply-quote">{m.reply}</span>}
                      {m.kind === 'voice' ? (
                        <span className="mg-voice"><button aria-label={playing ? '멈춤' : '재생'} onClick={() => { setPlaying((p) => !p); saw('audio-waveform') }}>{playing ? <Pause size={14} /> : <Play size={14} />}</button>
                          <span className={`mg-wave${playing ? ' on' : ''}`}>{[6, 12, 18, 10, 22, 14, 8, 16, 20, 9, 13, 6].map((h, k) => <i key={k} style={{ height: h }} />)}</span><small>{m.text}</small></span>
                      ) : m.kind === 'link' ? (
                        <span className="mg-link"><u>{m.text}</u><span className="mg-card"><i /><b>몽글 베이커리 소금빵</b><small>mongle.shop</small></span></span>
                      ) : m.text}
                    </div>
                    {!m.me && <button className="mg-reply-btn" aria-label="답장" onClick={() => { setReplyTo(m); saw('swipe-to-reply') }}>↩</button>}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {typing && <div className="mg-row"><span className="site-avatar site-avatar--sm" style={{ background: '#3e7bfa' }}>하</span><div className="mg-bubble mg-typing" data-ui="typing-indicator"><i /><i /><i /></div></div>}
        </div>
        <div className="mg-smart" data-ui="smart-reply">{SMART.map((t) => <button key={t} onClick={() => { send(t); saw('smart-reply') }}>{t}</button>)}</div>
        {replyTo && <div className="mg-replying" data-ui="reply-quote"><span><b>{replyTo.who ?? '나'}</b>에게 답장 · {replyTo.kind ? '첨부' : replyTo.text}</span><button aria-label="답장 그만" onClick={() => setReplyTo(null)}><X size={14} /></button></div>}
        <form className="mg-write" onSubmit={(e) => { e.preventDefault(); send(draft) }}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="메시지 보내기" aria-label="메시지" data-ui="text-field" />
          <button className="site-btn" disabled={!draft.trim()} aria-label="보내기"><Send size={16} /></button>
        </form>
        <p className="mg-tip">말풍선을 오른쪽으로 밀면 답장할 수 있어요</p>
      </section>
    </div>
  )
})
