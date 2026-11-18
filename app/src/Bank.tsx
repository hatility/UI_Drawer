// 체험관 사이트 3: 은행 ‘도토리 은행’. 송금은 3단계 (받는 분 → 금액 → 비밀번호) 후 완료 · 영수증.
// 모두 화면 안에서만 움직이고 실제 돈은 오가지 않아요.
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Bell, Check, CreditCard, Eye, EyeOff, Info, Search, Send, Wallet, X } from 'lucide-react'
import type { SiteHandle } from './Community'
import './sites.css'

type Props = { saw: (id: string) => void }
type Tx = { id: number; day: number; name: string; amount: number }
const won = (n: number) => `${n.toLocaleString('ko-KR')}원`
const START = 1284500
/** 12000 → '만 이천 원' (0 하나 실수를 막아요) */
export function readWon(n: number) {
  if (!n) return ''
  const d = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
  const small = (x: number) => [[1000, '천'], [100, '백'], [10, '십'], [1, '']].reduce((acc, [u, name]) => {
    const k = Math.floor(x / (u as number)) % 10
    return k ? acc + (k === 1 && name ? '' : d[k]) + name : acc
  }, '')
  const parts = [[100000000, '억'], [10000, '만'], [1, '']].map(([u, name]) => {
    const k = Math.floor(n / (u as number)) % 10000
    return k ? (k === 1 && name ? '' : small(k)) + name : ''
  }).filter(Boolean)
  return parts.join(' ') + ' 원'
}
const TX0: Tx[] = [
  { id: 1, day: 0, name: '몽글 베이커리', amount: -7000 },
  { id: 2, day: 0, name: '용돈', amount: 50000 },
  { id: 3, day: 1, name: '버스', amount: -1500 },
  { id: 4, day: 1, name: '편의점', amount: -3200 },
  { id: 5, day: 6, name: '급식비 환불', amount: 12000 },
  { id: 6, day: 20, name: '문구점', amount: -8800 },
  { id: 7, day: 45, name: '책방', amount: -15000 },
]
const dayName = (d: number) => (d === 0 ? '오늘' : d === 1 ? '어제' : `${d}일 전`)
const PEOPLE = [{ name: '김몽글', acc: '도토리 123-45-6789' }, { name: '이빵순', acc: '도토리 222-10-3333' }, { name: '박반죽', acc: '다른 은행 9876-54' }]
// 색은 사이트 스타일 토큰을 따라가요 (스타일을 바꾸면 도넛 색도 바뀌어요)
const SPEND = [['먹을거리', 46, 'var(--b-primary)'], ['교통', 18, 'color-mix(in srgb, var(--b-primary) 60%, var(--b-surface))'], ['학용품', 22, 'color-mix(in srgb, var(--b-primary) 30%, var(--b-surface))'], ['기타', 14, 'var(--b-surface-2)']] as const
// 도넛 조각: 앞 조각들이 끝난 곳에서 시작해요
const DONUT = `conic-gradient(${SPEND.map(([, v, c], i) => { const s = SPEND.slice(0, i).reduce((n, x) => n + x[1], 0); return `${c} ${s}% ${s + v}%` }).join(', ')})`

export const Bank = forwardRef<SiteHandle, Props>(function Bank({ saw }, ref) {
  const [balance, setBalance] = useState(START)
  const [shown, setShown] = useState(0) // 숫자 올라가기
  const [hidden, setHidden] = useState(false)
  const [tx, setTx] = useState(TX0)
  const [kind, setKind] = useState<'전체' | '입금' | '출금'>('전체')
  const [range, setRange] = useState(30)
  const [alarm, setAlarm] = useState(true)
  const [tip, setTip] = useState(false)
  const [left, setLeft] = useState(600)
  useEffect(() => { const t = setInterval(() => setLeft((x) => (x > 0 ? x - 1 : 0)), 1000); return () => clearInterval(t) }, [])
  const [toast, setToast] = useState<{ msg: string; k: number } | null>(null)
  // 송금: 0 닫힘 · 1 받는 분 · 2 금액 · 3 비밀번호 · 4 완료
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0)
  const [who, setWho] = useState('')
  const [to, setTo] = useState<(typeof PEOPLE)[number] | null>(null)
  const [amount, setAmount] = useState('')
  const [pin, setPin] = useState('')
  // 보안 키패드: 비밀번호 단계에 들어올 때마다 숫자 자리를 섞어요
  const [keys, setKeys] = useState<string[]>([])
  useEffect(() => { if (step === 3) setKeys([...'0123456789'].sort(() => Math.random() - 0.5)) }, [step])
  const [sending, setSending] = useState(false)
  const pinRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLElement>(null)
  const shownRef = useRef(0)
  shownRef.current = shown

  const say = (msg: string) => { setToast({ msg, k: Date.now() }); saw('toast') }
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2200); return () => clearTimeout(t) }, [toast])

  // 잔액이 바뀌면 숫자가 따라 움직여요 (count-up)
  useEffect(() => {
    const from = shownRef.current, toV = balance, t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 700)
      setShown(Math.round(from + (toV - from) * (1 - (1 - k) ** 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [balance])

  const num = Number(amount) || 0
  const amountErr = amount && num === 0 ? '0원은 보낼 수 없어요' : num > balance ? `잔액(${won(balance)})보다 많아요` : ''
  const people = PEOPLE.filter((p) => p.name.includes(who.trim()))
  const list = tx.filter((t) => t.day <= range && (kind === '전체' || (kind === '입금' ? t.amount > 0 : t.amount < 0)))
  const days = [...new Set(list.map((t) => t.day))]

  const openSend = () => { setStep(1); setWho(''); setTo(null); setAmount(''); setPin(''); saw('steps') }
  const send = (sendTo: (typeof PEOPLE)[number], value: number) => {
    setSending(true); saw('loading-button')
    setTimeout(() => {
      setSending(false); setStep(4); saw('success-state')
      setBalance((b) => b - value)
      setTx((x) => [{ id: Date.now(), day: 0, name: sendTo.name, amount: -value }, ...x])
    }, 900)
  }
  const typePin = (v: string) => {
    setPin(v)
    if (v.length === 6 && to && !sending) send(to, num)
  }
  useEffect(() => { if (step === 3) setTimeout(() => pinRef.current?.focus(), 50) }, [step])

  useImperativeHandle(ref, () => ({
    demo(id) {
      switch (id) {
        case 'steps': case 'searchable-select': case 'dialog-fullscreen': openSend(); break
        case 'disabled': openSend(); setTo(PEOPLE[0]); setStep(2); saw('disabled'); break
        case 'otp-input': openSend(); setTo(PEOPLE[0]); setAmount('10000'); setStep(3); saw('otp-input'); break
        case 'secure-keypad': openSend(); setTo(PEOPLE[0]); setAmount('10000'); setStep(3); saw('secure-keypad'); break
        case 'success-state': case 'check-animation': case 'receipt': case 'loading-button': openSend(); setTo(PEOPLE[0]); setAmount('10000'); setStep(3); setPin('123456'); send(PEOPLE[0], 10000); break
        case 'countdown': setLeft(65); saw('countdown'); break
        case 'currency-input': openSend(); setTo(PEOPLE[0]); setAmount('12000'); setStep(2); saw('currency-input'); break
        case 'count-up': setShown(0); setBalance((b) => b + 1); saw('count-up'); break
        case 'grouped-list': case 'quick-dates': listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); saw(id); break
      }
    },
  }))

  return (
    <div className="site bk">
      <header className="site-bar">
        <b className="site-logo">도토리 은행</b>
        <span className="bk-session" data-ui="countdown" role="timer" aria-label="자동 로그아웃까지 남은 시간">자동 로그아웃 {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}<button onClick={() => { setLeft(600); say('10분 연장했어요') }}>연장</button></span>
        <button className="site-icon" aria-label="알림" onClick={() => say('새 알림이 없어요')}><Bell size={19} /></button>
        <span className="site-avatar" style={{ background: 'var(--b-primary)', color: 'var(--b-on-primary)' }}>몽</span>
      </header>

      <div className="site-scroll">
        <div className="bk-main">
          <section className="bk-card" data-ui="stat-card">
            <div className="bk-card-top">
              <span>도토리 통장 <small>123-45-6789</small></span>
              <span className="bk-tipwrap" tabIndex={0} onMouseEnter={() => { setTip(true); saw('tooltip') }} onMouseLeave={() => setTip(false)} onFocus={() => setTip(true)} onBlur={() => setTip(false)} data-ui="tooltip">
                <Info size={15} />{tip && <span className="bk-tip" role="tooltip">이자 연 2.0% · 매달 1일 지급</span>}
              </span>
            </div>
            <div className="bk-balance">
              <b data-ui="count-up">{hidden ? '잔액 숨김' : won(shown)}</b>
              <button className="site-icon" aria-label={hidden ? '잔액 보기' : '잔액 숨기기'} aria-pressed={hidden} onClick={() => setHidden((h) => !h)} data-ui="icon-button">{hidden ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <div className="bk-quick">
              {([[Send, '송금', openSend], [Wallet, '충전', () => say('충전은 체험관에 없어요')], [ArrowDownLeft, '내역', () => listRef.current?.scrollIntoView({ behavior: 'smooth' })], [CreditCard, '카드', () => say('카드는 체험관에 없어요')]] as const).map(([I, t, fn]) => (
                <button key={t} onClick={fn}><span><I size={20} /></span>{t}</button>
              ))}
            </div>
          </section>

          <div className="bk-row">
            <section className="bk-panel" data-ui="donut-chart">
              <div data-h="3">이번 달 쓴 돈</div>
              <div className="bk-donut-wrap">
                <span className="bk-donut" style={{ background: DONUT }}><b>35,500원</b></span>
                <ul>{SPEND.map(([n, v, c]) => <li key={n}><i style={{ background: c }} />{n}<b>{v}%</b></li>)}</ul>
              </div>
            </section>
            <section className="bk-panel">
              <div data-h="3">알림 설정</div>
              <label className="pg-switch" data-ui="toggle"><span>입출금 알림 받기</span><input type="checkbox" role="switch" checked={alarm} onChange={(e) => { setAlarm(e.target.checked); say(e.target.checked ? '알림을 켰어요' : '알림을 껐어요') }} /></label>
              <p className="bk-note">돈이 들어오고 나갈 때마다 알려 드려요.</p>
            </section>
          </div>

          <section className="bk-panel" ref={listRef}>
            <div className="bk-list-head">
              <div data-h="3">거래 내역</div>
              <div className="bk-kind" role="radiogroup" aria-label="거래 종류" data-ui="segmented">
                {(['전체', '입금', '출금'] as const).map((k) => <button key={k} role="radio" aria-checked={kind === k} className={kind === k ? 'on' : ''} onClick={() => setKind(k)}>{k}</button>)}
              </div>
            </div>
            <div className="bk-ranges" data-ui="quick-dates">
              {([[7, '1주'], [30, '1개월'], [90, '3개월']] as const).map(([d, t]) => <button key={d} className={range === d ? 'on' : ''} aria-pressed={range === d} onClick={() => { setRange(d); saw('quick-dates') }}>{t}</button>)}
            </div>
            {days.length ? (
              <div className="bk-groups" data-ui="grouped-list">
                {days.map((d) => (
                  <div key={d}>
                    <small className="bk-day">{dayName(d)}</small>
                    {list.filter((t) => t.day === d).map((t) => (
                      <div key={t.id} className="bk-tx">
                        <span className={`bk-tx-ico${t.amount > 0 ? ' in' : ''}`}>{t.amount > 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}</span>
                        <b>{t.name}</b>
                        <span className={t.amount > 0 ? 'bk-in' : ''}>{t.amount > 0 ? '+' : '−'}{won(Math.abs(t.amount))}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : <div className="site-empty" data-ui="empty-state"><b>이 기간에는 거래가 없어요</b><small>기간을 늘려 보세요</small></div>}
          </section>
        </div>
      </div>

      {/* 송금: 화면 전체를 덮는 다이얼로그 + 단계 표시 */}
      {step > 0 && (
        <div className="bk-send" role="dialog" aria-modal="true" aria-label="송금" data-ui="dialog-fullscreen">
          <div className="bk-send-bar">
            <button className="site-icon" aria-label="닫기" disabled={sending} onClick={() => setStep(0)}><X size={20} /></button>
            <b>보내기</b>
            <span />
          </div>
          {step < 4 && (
            <ol className="bk-steps" data-ui="steps">
              {['받는 분', '금액', '비밀번호'].map((t, i) => <li key={t} className={i + 1 < step ? 'done' : i + 1 === step ? 'on' : ''}><i>{i + 1 < step ? <Check size={14} /> : i + 1}</i>{t}</li>)}
            </ol>
          )}

          {step === 1 && (
            <div className="bk-step">
              <div data-h="4">누구에게 보낼까요?</div>
              <label className="bk-find" data-ui="searchable-select"><Search size={16} /><input value={who} placeholder="이름으로 찾기" aria-label="받는 분 찾기" onChange={(e) => setWho(e.target.value)} autoFocus /></label>
              {people.length ? people.map((p) => (
                <button key={p.name} className="bk-person" onClick={() => { setTo(p); setStep(2); saw('steps') }}>
                  <span className="site-avatar" style={{ background: 'var(--b-primary-c)', color: 'var(--b-on-primary-c)' }}>{p.name[0]}</span><span><b>{p.name}</b><small>{p.acc}</small></span>
                </button>
              )) : <p className="bk-note">‘{who}’ 님을 찾지 못했어요</p>}
            </div>
          )}

          {step === 2 && to && (
            <div className="bk-step">
              <div data-h="4">{to.name}님에게 얼마를 보낼까요?</div>
              <label className="pg-field" data-ui="currency-input">
                <span>금액</span>
                <input inputMode="numeric" value={num ? num.toLocaleString('ko-KR') : amount} placeholder="0" aria-invalid={!!amountErr} className={amountErr ? 'bad' : ''} onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').slice(0, 9))} autoFocus />
                {amountErr ? <small className="pg-err" data-ui="inline-error">{amountErr}</small> : <small className="bk-note">{num ? readWon(num) : `잔액 ${won(balance)}`}</small>}
              </label>
              <div className="bk-chips" data-ui="chip">
                {[10000, 50000, 100000].map((n) => <button key={n} onClick={() => setAmount(String(num + n))}>+{n / 10000}만</button>)}
                <button onClick={() => setAmount(String(balance))}>전액</button>
              </div>
              <button className="site-btn site-btn--wide" disabled={!num || !!amountErr} data-ui={!num || amountErr ? 'disabled' : undefined} onClick={() => setStep(3)}>다음</button>
            </div>
          )}

          {step === 3 && (
            <div className="bk-step bk-pin-step">
              <div data-h="4">비밀번호 6자리를 눌러 주세요</div>
              <small className="bk-note">체험관이라 아무 숫자나 괜찮아요</small>
              <label className="bk-pin" data-ui="otp-input">
                {Array.from({ length: 6 }, (_, i) => <i key={i} className={i < pin.length ? 'on' : i === pin.length ? 'cur' : ''} />)}
                <input ref={pinRef} inputMode="numeric" autoComplete="off" value={pin} aria-label="비밀번호 6자리" disabled={sending} onChange={(e) => typePin(e.target.value.replace(/\D/g, '').slice(0, 6))} />
              </label>
              <div className="bk-keypad" data-ui="secure-keypad" aria-label="보안 키패드 (숫자 자리가 매번 섞여요)">
                {keys.map((k) => <button key={k} disabled={sending || pin.length >= 6} onClick={() => { typePin((pin + k).slice(0, 6)); saw('secure-keypad') }}>{k}</button>)}
                <button disabled={sending || !pin} aria-label="지우기" onClick={() => setPin(pin.slice(0, -1))}>⌫</button>
                <button disabled={sending} onClick={() => { setKeys((ks) => [...ks].sort(() => Math.random() - 0.5)); saw('secure-keypad') }}>섞기</button>
              </div>
              {sending && <span className="site-btn site-btn--wide" data-ui="loading-button"><i className="pg-spin" />보내는 중</span>}
            </div>
          )}

          {step === 4 && to && (
            <div className="bk-step bk-done" data-ui="success-state">
              <svg className="bk-check" viewBox="0 0 52 52" data-ui="check-animation"><circle cx="26" cy="26" r="23" /><path d="M15 27l7 7 15-16" /></svg>
              <div data-h="4">{to.name}님에게 {won(num)}을 보냈어요</div>
              <div className="bk-receipt" data-ui="receipt">
                <div><span>받는 분</span><b>{to.name}</b></div>
                <div><span>계좌</span><b>{to.acc}</b></div>
                <div><span>수수료</span><b>0원</b></div>
                <div className="sum"><span>남은 잔액</span><b>{won(balance)}</b></div>
              </div>
              <button className="site-btn site-btn--wide" onClick={() => setStep(0)}>확인</button>
            </div>
          )}
        </div>
      )}

      <div className="pg-toasts">{toast && <div key={toast.k} className="pg-toast" data-ui="toast" role="status">{toast.msg}</div>}</div>
    </div>
  )
})
